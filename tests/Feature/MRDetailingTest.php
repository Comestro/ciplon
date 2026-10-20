<?php

use App\Models\Category;
use App\Models\Doctor;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
});

test('unauthenticated users are redirected from mr detailing slideshow page', function () {
    $response = $this->get('/mr/detailing');

    $response->assertRedirect('/login');
});

test('unauthorized users without mr role receive 403 from mr detailing page', function () {
    $regularUser = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($regularUser)->get('/mr/detailing');
    $response->assertStatus(403);
});

test('mr user can access doctor e-detailing interactive slide show page with ordered data', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $category = Category::firstOrCreate(
        ['slug' => 'gastro-care'],
        ['name' => 'Gastro Care']
    );

    $product = Product::create([
        'category_id' => $category->id,
        'brand_name' => 'Ciplocid-DSR',
        'generic_name' => 'Rabeprazole Sodium & Domperidone SR',
        'product_code' => 'CP-CD-001',
        'slug' => 'ciplocid-dsr',
        'dosage_form' => 'Capsule',
        'strength' => '20mg + 30mg',
        'packaging_type' => '10x10 Alu-Alu Strip',
        'is_active' => true,
    ]);

    Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Arvind Sharma',
        'qualification' => 'MD, DM',
        'specialization' => 'Gastroenterologist',
        'clinic_hospital_name' => 'Metro Care Hospital',
        'territory' => 'Central City',
        'phone' => '+91 98765 43210',
        'tier' => 'super_core',
        'target_frequency_per_month' => 4,
        'status' => 'active',
    ]);

    $response = $this->actingAs($mrUser)->get('/mr/detailing');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('mr/Detailing')
        ->has('products')
        ->has('doctors')
        ->has('company')
    );
});
