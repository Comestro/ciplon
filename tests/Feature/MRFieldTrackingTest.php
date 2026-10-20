<?php

use App\Models\MRLocation;
use App\Models\Setting;
use App\Models\TourPlan;
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
                'tour_plans_for_approval',
                'leaderboard',
            ],
        ]);
});

test('admin can approve tour plan', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('super_admin');

    $mr = User::factory()->create(['role' => 'mr']);
    $plan = TourPlan::create([
        'user_id' => $mr->id,
        'type' => 'doctor',
        'month' => 'July 2026',
        'year' => 2026,
        'days_count' => 26,
        'planned_visits' => 120,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->postJson("/admin/tour-plans/{$plan->id}/approve", [
        'notes' => 'Plan looks great, approved.',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Tour plan has been approved successfully.',
        ]);

    expect($plan->fresh()->status)->toBe('approved');
    expect($plan->fresh()->reviewed_by)->toBe($admin->id);
});

test('admin can reject tour plan', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('super_admin');

    $mr = User::factory()->create(['role' => 'mr']);
    $plan = TourPlan::create([
        'user_id' => $mr->id,
        'type' => 'doctor',
        'month' => 'July 2026',
        'year' => 2026,
        'days_count' => 26,
        'planned_visits' => 120,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->postJson("/admin/tour-plans/{$plan->id}/reject", [
        'notes' => 'Please revise scheduled days.',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Tour plan has been rejected.',
        ]);

    expect($plan->fresh()->status)->toBe('rejected');
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

test('mr only sees their own tour plan and cannot approve', function () {
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr1->assignRole('mr');
    $mr2 = User::factory()->create(['role' => 'mr']);
    $mr2->assignRole('mr');

    $plan1 = TourPlan::create([
        'user_id' => $mr1->id,
        'type' => 'doctor',
        'month' => 'August 2026',
        'year' => 2026,
        'days_count' => 24,
        'planned_visits' => 100,
        'status' => 'pending',
    ]);

    $plan2 = TourPlan::create([
        'user_id' => $mr2->id,
        'type' => 'doctor',
        'month' => 'August 2026',
        'year' => 2026,
        'days_count' => 25,
        'planned_visits' => 110,
        'status' => 'pending',
    ]);

    // MR1 accesses tour plans
    $response = $this->actingAs($mr1)->get('/mrconnect/tour-plan');
    $response->assertStatus(200);
    $plans = $response->viewData('page')['props']['tourPlans'];
    expect(count($plans))->toBe(1);
    expect($plans[0]['id'])->toBe($plan1->id);

    // MR1 attempts to approve plan2 -> gets 403
    $approveResponse = $this->actingAs($mr1)->post("/mrconnect/tour-plan/{$plan2->id}/approve");
    $approveResponse->assertStatus(403);
});

test('mr only sees their own assigned profile in employee assign', function () {
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr1->assignRole('mr');
    $mr2 = User::factory()->create(['role' => 'mr']);
    $mr2->assignRole('mr');

    $response = $this->actingAs($mr1)->get('/mrconnect/employee-assign');
    $response->assertStatus(200);
    $reps = $response->viewData('page')['props']['representatives'];
    expect(count($reps))->toBe(1);
    expect($reps[0]['id'])->toBe($mr1->id);
});
