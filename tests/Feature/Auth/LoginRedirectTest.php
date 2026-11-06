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

test('authenticated mr can logout via inertia post', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->post('/logout', [], [
        'X-Inertia' => 'true',
    ]);

    $response->assertStatus(409);
    $response->assertHeader('X-Inertia-Location');
    $this->assertGuest();
});

test('authenticated admin can logout via inertia post', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->post('/logout', [], [
        'X-Inertia' => 'true',
    ]);

    $response->assertStatus(409);
    $response->assertHeader('X-Inertia-Location');
    $this->assertGuest();
});

test('user can logout via standard post request', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->post('/logout');

    $response->assertRedirect('/login');
    $this->assertGuest();
});

test('user can logout via standard get request', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->get('/logout');

    $response->assertRedirect('/login');
    $this->assertGuest();
});

test('authenticated mr accessing admin dashboard is redirected to mr dashboard', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->get('/admin');

    $response->assertRedirect(route('mr.dashboard'));
});

test('guest accessing mr portal is redirected to login', function () {
    $response = $this->get('/mr');

    $response->assertRedirect('/login');
});

test('authenticated mr accessing /mr is redirected to mr dashboard', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->get('/mr');

    $response->assertRedirect(route('mr.dashboard'));
});

test('mr logging in with intended admin url is redirected to mr dashboard', function () {
    $password = 'Password123!';
    $mr = User::factory()->create([
        'role' => 'mr',
        'password' => bcrypt($password),
    ]);
    $mr->assignRole('mr');

    $response = $this->withSession(['url.intended' => 'http://localhost/admin'])
        ->post('/login', [
            'email' => $mr->email,
            'password' => $password,
        ]);

    $response->assertRedirect('/mr/dashboard');
});
