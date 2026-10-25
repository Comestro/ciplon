<?php

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
