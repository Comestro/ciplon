<?php

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
    Role::firstOrCreate(['name' => 'admin']);
});

test('mr can view pob orders scoped to themselves and see active company products', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');
    $otherMr = User::factory()->create(['role' => 'mr']);
    $otherMr->assignRole('mr');

    // Create an order for this MR
    DB::table('pob_orders')->insert([
        'user_id' => $mr->id,
        'order_no' => 'POB-TEST-001',
        'chemist_name' => 'MR Apollo Pharmacy',
        'total_amount' => 5000,
        'items_count' => 1,
        'status' => 'submitted',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Create an order for other MR
    DB::table('pob_orders')->insert([
        'user_id' => $otherMr->id,
        'order_no' => 'POB-TEST-002',
        'chemist_name' => 'Other Medicos',
        'total_amount' => 8000,
        'items_count' => 2,
        'status' => 'submitted',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($mr)->get(route('mrconnect.pob.order'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mrconnect/PobOrder')
        ->has('orders', 1)
        ->where('orders.0.order_no', 'POB-TEST-001')
        ->has('products')
    );
});

test('mr can book a pob order with multiple product items', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mr->id,
        'name' => 'Dr. Test Physician',
        'specialization' => 'General Medicine',
        'clinic_hospital_name' => 'City Clinic',
        'territory' => 'Central',
        'phone' => '+91 98765 43210',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ]);

    $payload = [
        'chemist_name' => 'City Health Pharmacy',
        'doctor_id' => $doctor->id,
        'notes' => 'Deliver via city stockist within 24 hours',
        'items' => [
            [
                'product_id' => 1,
                'product_name' => 'CIPLOMAX CD3',
                'quantity' => 10,
                'unit_price' => 180,
            ],
            [
                'product_id' => 2,
                'product_name' => 'DICLOTRYP-FORT',
                'quantity' => 5,
                'unit_price' => 220,
            ],
        ],
    ];

    $response = $this->actingAs($mr)->post(route('mrconnect.pob.order.store'), $payload);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('pob_orders', [
        'user_id' => $mr->id,
        'chemist_name' => 'City Health Pharmacy',
        'doctor_id' => $doctor->id,
        'total_amount' => 2900.00, // 10*180 + 5*220 = 1800 + 1100 = 2900
        'items_count' => 2,
        'status' => 'submitted',
    ]);
});

test('admin can see all pob orders across all representatives', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');
    $mr1 = User::factory()->create(['role' => 'mr', 'name' => 'Rep One']);
    $mr1->assignRole('mr');
    $mr2 = User::factory()->create(['role' => 'mr', 'name' => 'Rep Two']);
    $mr2->assignRole('mr');

    DB::table('pob_orders')->insert([
        [
            'user_id' => $mr1->id,
            'order_no' => 'POB-ADMIN-01',
            'chemist_name' => 'Chemist One',
            'total_amount' => 3000,
            'items_count' => 1,
            'status' => 'submitted',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'user_id' => $mr2->id,
            'order_no' => 'POB-ADMIN-02',
            'chemist_name' => 'Chemist Two',
            'total_amount' => 4500,
            'items_count' => 1,
            'status' => 'submitted',
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);

    $response = $this->actingAs($admin)->get(route('mrconnect.pob.order'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mrconnect/PobOrder')
        ->has('orders', 2)
        ->where('isAdmin', true)
    );
});

test('admin can verify a submitted pob order', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $orderId = DB::table('pob_orders')->insertGetId([
        'user_id' => $mr->id,
        'order_no' => 'POB-VERIFY-01',
        'chemist_name' => 'Apollo Chemist',
        'total_amount' => 5000,
        'items_count' => 1,
        'status' => 'submitted',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->post(route('mrconnect.pob.order.status', $orderId), [
        'status' => 'verified',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('pob_orders', [
        'id' => $orderId,
        'status' => 'verified',
    ]);
});

test('mr cannot verify orders (forbidden 403)', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $orderId = DB::table('pob_orders')->insertGetId([
        'user_id' => $mr->id,
        'order_no' => 'POB-DENY-01',
        'chemist_name' => 'Apollo Chemist',
        'total_amount' => 5000,
        'items_count' => 1,
        'status' => 'submitted',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($mr)->post(route('mrconnect.pob.order.status', $orderId), [
        'status' => 'verified',
    ]);

    $response->assertForbidden();
});
