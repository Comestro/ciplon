<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'super_admin']);
});

test('guest can access login page', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('authenticated mr is redirected to mr dashboard when accessing login', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->get('/login');

    $response->assertRedirect(route('mr.dashboard'));
});

test('authenticated admin is redirected to admin dashboard when accessing login', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->get('/login');

    $response->assertRedirect(route('admin.dashboard'));
});
