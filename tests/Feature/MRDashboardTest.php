<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
});

test('unauthenticated users are redirected from mr dashboard', function () {
    $response = $this->get('/mr/dashboard');

    $response->assertRedirect('/login');
});

test('unauthenticated users accessing /mr are redirected to login', function () {
    $response = $this->get('/mr');

    $response->assertRedirect('/login');
});

test('guest accessing /mr/login is redirected to /login', function () {
    $response = $this->get('/mr/login');

    $response->assertRedirect('/login');
});

test('mr user accessing /mr is redirected to /mr/dashboard', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->get('/mr');

    $response->assertRedirect('/mr/dashboard');
});

test('mr user accessing /admin is redirected to /mr/dashboard', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->get('/admin');

    $response->assertRedirect('/mr/dashboard');
});

test('unauthenticated users receive 401 from mr dashboard api', function () {
    $response = $this->getJson('/api/v1/mr/dashboard');

    $response->assertStatus(401);
});

test('unauthorized users without mr role are denied access to mr dashboard', function () {
    $regularUser = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($regularUser)->get('/mr/dashboard');
    $response->assertStatus(403);

    $apiResponse = $this->actingAs($regularUser)->getJson('/api/v1/mr/dashboard');
    $apiResponse->assertStatus(403);
});

test('mr user can access mr dashboard page', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->get('/mr/dashboard');

    $response->assertStatus(200);
});

test('mr user can fetch mr dashboard api data', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->getJson('/api/v1/mr/dashboard');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'data' => [
                'summary' => [
                    'today_visits' => 0,
                    'completed_visits' => 0,
                    'pending_visits' => 0,
                    'follow_ups_due' => 0,
                ],
                'performance' => [
                    'visits' => [
                        'completed' => 0,
                        'target' => 0,
                    ],
                    'doctors' => [
                        'covered' => 0,
                        'target' => 0,
                    ],
                    'product_promotions' => [
                        'completed' => 0,
                        'target' => 0,
                    ],
                    'achievement' => 0,
                ],
                'today_visits' => [],
                'upcoming_followups' => [],
                'recent_activities' => [],
            ],
        ]);
});
