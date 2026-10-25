<?php

use App\Models\MRLocation;
use App\Models\User;

test('guests are redirected to login when visiting mr directory', function () {
    $this->get('/mrconnect/mr-directory')->assertRedirect('/login');
});

test('mr cannot access mr directory and receives 403 forbidden', function () {
    $mr = User::factory()->create(['role' => 'mr']);

    $response = $this->actingAs($mr)->get('/mrconnect/mr-directory');
    $response->assertStatus(403);
});

test('admin can access mr directory and view field representatives', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->create([
        'name' => 'Demo Field Representative',
        'email' => 'field.rep@example.com',
        'role' => 'mr',
    ]);

    $response = $this->actingAs($admin)->get('/mrconnect/mr-directory');
    $response->assertStatus(200);
});

test('mr directory includes live location details when mr has location synced', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mr = User::factory()->create(['role' => 'mr']);

    MRLocation::create([
        'user_id' => $mr->id,
        'latitude' => 25.6114688,
        'longitude' => 85.0952192,
        'battery_level' => 74,
        'battery_status' => 'discharging',
        'is_online' => true,
        'current_activity' => 'in_field',
        'last_synced_at' => now(),
    ]);

    $response = $this->actingAs($admin)->get('/mrconnect/mr-directory');
    $response->assertStatus(200);
    $response->assertSee('25.6114688');
});
