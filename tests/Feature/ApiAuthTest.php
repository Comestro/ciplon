<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'manager']);
});

test('mobile app can login via api v1 auth login without csrf token and receive bearer token', function () {
    $mr = User::factory()->create([
        'email' => 'rep@ciplon.test',
        'password' => Hash::make('Secret123!'),
        'role' => 'mr',
    ]);
    $mr->assignRole('mr');

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'rep@ciplon.test',
        'password' => 'Secret123!',
        'device_name' => 'Flutter Android Client',
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('token_type', 'Bearer')
        ->assertJsonPath('user.email', 'rep@ciplon.test')
        ->assertJsonPath('user.role', 'mr');

    expect($response->json('token'))->toBeString()->not->toBeEmpty();
});

test('mobile app can login using route aliases mr login and v1 login', function () {
    $mr = User::factory()->create([
        'email' => 'alias@ciplon.test',
        'password' => Hash::make('Secret123!'),
        'role' => 'mr',
    ]);
    $mr->assignRole('mr');

    $res1 = $this->postJson('/api/v1/mr/login', [
        'email' => 'alias@ciplon.test',
        'password' => 'Secret123!',
    ]);
    $res1->assertStatus(200)->assertJsonPath('success', true);

    $res2 = $this->postJson('/api/v1/login', [
        'email' => 'alias@ciplon.test',
        'password' => 'Secret123!',
    ]);
    $res2->assertStatus(200)->assertJsonPath('success', true);
});

test('login rejects invalid credentials with 401', function () {
    User::factory()->create([
        'email' => 'wrongpass@ciplon.test',
        'password' => Hash::make('CorrectPassword!'),
        'role' => 'mr',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'wrongpass@ciplon.test',
        'password' => 'WrongPassword!',
    ]);

    $response->assertStatus(401)
        ->assertJsonPath('success', false)
        ->assertJsonStructure(['message', 'errors' => ['email']]);
});

test('login rejects non-existent user with 401', function () {
    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'nonexistent@ciplon.test',
        'password' => 'Password123!',
    ]);

    $response->assertStatus(401)
        ->assertJsonPath('success', false);
});

test('login rejects unauthorized user role with 403', function () {
    $user = User::factory()->create([
        'email' => 'regular@ciplon.test',
        'password' => Hash::make('Password123!'),
        'role' => 'customer',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'regular@ciplon.test',
        'password' => 'Password123!',
    ]);

    $response->assertStatus(403)
        ->assertJsonPath('success', false);
});

test('mobile client can access auth me and mr endpoints using bearer token', function () {
    $mr = User::factory()->create([
        'email' => 'tokenuser@ciplon.test',
        'password' => Hash::make('Secret123!'),
        'role' => 'mr',
    ]);
    $mr->assignRole('mr');

    $token = $mr->createToken('Mobile Test Token')->plainTextToken;

    // Call /api/v1/auth/me
    $meResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/auth/me');

    $meResponse->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('user.email', 'tokenuser@ciplon.test');

    // Call /api/v1/mr/doctors
    $doctorsResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/mr/doctors');

    $doctorsResponse->assertStatus(200)
        ->assertJsonPath('success', true);

    // Call POST /api/v1/mr/location without CSRF
    $locationResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/mr/location', [
            'latitude' => 8.1834,
            'longitude' => 77.4121,
            'battery_level' => 90,
            'current_activity' => 'in_field',
        ]);

    $locationResponse->assertStatus(200)
        ->assertJsonPath('success', true);
});

test('mobile client can logout and revoke bearer token', function () {
    $mr = User::factory()->create([
        'email' => 'logout@ciplon.test',
        'password' => Hash::make('Secret123!'),
        'role' => 'mr',
    ]);
    $mr->assignRole('mr');

    $token = $mr->createToken('Device Token')->plainTextToken;

    $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/auth/logout');

    $logoutResponse->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Successfully logged out.');

    expect($mr->fresh()->tokens)->toHaveCount(0);
});
