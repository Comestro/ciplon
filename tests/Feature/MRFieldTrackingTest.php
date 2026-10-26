<?php

use App\Models\MRLocation;
use App\Models\Setting;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
    Role::firstOrCreate(['name' => 'admin']);
});

test('admin can access field operations tracking dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('super_admin');

    $response = $this->actingAs($admin)->get('/admin/tracking');

    $response->assertStatus(200);
});

test('admin can fetch tracking data as json', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('super_admin');

    $response = $this->actingAs($admin)->getJson('/admin/tracking');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => [
                'mapbox' => ['token', 'style', 'default_lat', 'default_lng', 'default_zoom'],
                'kpi' => ['medical_representatives', 'doctors', 'managers', 'headquarters', 'tour_summary'],
                'field_representatives',
                'leaderboard',
            ],
        ]);
});

test('mr can update live gps location', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->postJson('/api/v1/mr/location', [
        'latitude' => 8.1833,
        'longitude' => 77.4119,
        'accuracy' => 15.2,
        'speed' => 22.0,
        'battery_level' => 88,
        'battery_status' => 'discharging',
        'current_activity' => 'in_clinic',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Live GPS coordinates synchronized with administration.',
        ]);

    $location = MRLocation::where('user_id', $mr->id)->latest('id')->first();
    expect($location)->not->toBeNull();
    expect((float) $location->latitude)->toBe(8.1833);
    expect((float) $location->longitude)->toBe(77.4119);
    expect($location->battery_level)->toBe(88);
});

test('mapbox settings can be saved and retrieved', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('super_admin');

    $response = $this->actingAs($admin)->post('/admin/settings', [
        'settings' => [
            'mapbox_token' => 'pk.test_sample_token_123',
            'mapbox_style' => 'mapbox://styles/mapbox/streets-v12',
            'mapbox_default_lat' => '8.1833',
            'mapbox_default_lng' => '77.4119',
            'mapbox_default_zoom' => '14',
            'mapbox_tracking_interval' => '25',
        ],
    ]);

    $response->assertRedirect();

    expect(Setting::get('mapbox_token'))->toBe('pk.test_sample_token_123');
    expect(Setting::get('mapbox_default_zoom'))->toBe(14);
});

test('mr cannot access admin tracking dashboard and gets 403', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->get('/admin/tracking');

    $response->assertStatus(403);
});
