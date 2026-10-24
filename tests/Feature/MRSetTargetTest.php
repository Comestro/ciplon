<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
    Role::firstOrCreate(['name' => 'admin']);
});

test('mr can view sales targets scoped to themselves', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');
    $otherMr = User::factory()->create(['role' => 'mr']);
    $otherMr->assignRole('mr');

    DB::table('sales_targets')->insert([
        [
            'user_id' => $mr->id,
            'month' => 'October',
            'year' => 2026,
            'target_amount' => 300000,
            'achieved_amount' => 150000,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'user_id' => $otherMr->id,
            'month' => 'October',
            'year' => 2026,
            'target_amount' => 500000,
            'achieved_amount' => 400000,
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);

    $response = $this->actingAs($mr)->get(route('mrconnect.set.target'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mrconnect/SetTarget')
        ->has('targets', 1)
        ->where('targets.0.user_id', $mr->id)
    );
});

test('admin can view all sales targets and representatives list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr1->assignRole('mr');
    $mr2 = User::factory()->create(['role' => 'mr']);
    $mr2->assignRole('mr');

    DB::table('sales_targets')->insert([
        [
            'user_id' => $mr1->id,
            'month' => 'October',
            'year' => 2026,
            'target_amount' => 300000,
            'achieved_amount' => 150000,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'user_id' => $mr2->id,
            'month' => 'October',
            'year' => 2026,
            'target_amount' => 400000,
            'achieved_amount' => 200000,
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);

    $response = $this->actingAs($admin)->get(route('mrconnect.set.target'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mrconnect/SetTarget')
        ->has('targets', 2)
        ->where('isAdmin', true)
        ->has('representatives')
    );
});

test('admin can assign a new sales target to representative', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');
    $mr = User::factory()->create(['role' => 'mr', 'name' => 'Rajesh']);
    $mr->assignRole('mr');

    $payload = [
        'user_id' => $mr->id,
        'month' => 'November',
        'year' => 2026,
        'target_amount' => 380000,
        'achieved_amount' => 50000,
        'notes' => 'Q4 target with Neuro complex focus',
    ];

    $response = $this->actingAs($admin)->post(route('mrconnect.set.target.store'), $payload);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('sales_targets', [
        'user_id' => $mr->id,
        'month' => 'November',
        'year' => 2026,
        'target_amount' => 380000,
        'achieved_amount' => 50000,
    ]);
});

test('admin can update an existing sales target quota and achieved amount', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $targetId = DB::table('sales_targets')->insertGetId([
        'user_id' => $mr->id,
        'month' => 'November',
        'year' => 2026,
        'target_amount' => 300000,
        'achieved_amount' => 100000,
        'notes' => 'Old note',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->put(route('mrconnect.set.target.update', $targetId), [
        'target_amount' => 350000,
        'achieved_amount' => 250000,
        'notes' => 'Updated note and achieved volume',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('sales_targets', [
        'id' => $targetId,
        'target_amount' => 350000,
        'achieved_amount' => 250000,
        'notes' => 'Updated note and achieved volume',
    ]);
});

test('admin can delete a sales target', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $targetId = DB::table('sales_targets')->insertGetId([
        'user_id' => $mr->id,
        'month' => 'November',
        'year' => 2026,
        'target_amount' => 300000,
        'achieved_amount' => 0,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->delete(route('mrconnect.set.target.destroy', $targetId));

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseMissing('sales_targets', ['id' => $targetId]);
});

test('mr cannot assign, update, or delete sales targets (forbidden 403)', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    // MR tries to assign target
    $resStore = $this->actingAs($mr)->post(route('mrconnect.set.target.store'), [
        'user_id' => $mr->id,
        'month' => 'December',
        'year' => 2026,
        'target_amount' => 500000,
    ]);
    $resStore->assertForbidden();

    // Create target to test update & delete
    $targetId = DB::table('sales_targets')->insertGetId([
        'user_id' => $mr->id,
        'month' => 'December',
        'year' => 2026,
        'target_amount' => 300000,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $resUpdate = $this->actingAs($mr)->put(route('mrconnect.set.target.update', $targetId), [
        'target_amount' => 400000,
    ]);
    $resUpdate->assertForbidden();

    $resDelete = $this->actingAs($mr)->delete(route('mrconnect.set.target.destroy', $targetId));
    $resDelete->assertForbidden();
});