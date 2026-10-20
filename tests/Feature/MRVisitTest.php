<?php

use App\Models\Doctor;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
});

test('unauthenticated users are redirected from mr visits page', function () {
    $response = $this->get('/mr/visits');

    $response->assertRedirect('/login');
});

test('unauthenticated users receive 401 from mr visits api', function () {
    $response = $this->getJson('/api/v1/mr/visits');

    $response->assertStatus(401);
});

test('unauthorized users without mr role receive 403 from mr visits page and api', function () {
    $regularUser = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($regularUser)->get('/mr/visits');
    $response->assertStatus(403);

    $apiResponse = $this->actingAs($regularUser)->getJson('/api/v1/mr/visits');
    $apiResponse->assertStatus(403);
});

test('mr user can access mr visits page', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->get('/mr/visits');

    $response->assertStatus(200);
});

test('mr user can list visits with today metrics and doctors list', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Rajesh Sharma',
        'qualification' => 'MBBS, MD (Cardiology)',
        'specialization' => 'Cardiology',
        'clinic_hospital_name' => 'Metro Heart Care',
        'territory' => 'Central Hub',
        'phone' => '+91 98201 11222',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ]);

    // Visit scheduled for today
    Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::today()->toDateString(),
        'visit_time' => '10:30 AM',
        'call_type' => 'routine_detailing',
        'status' => 'scheduled',
        'products_detailed' => ['Cardiovast-AM'],
    ]);

    $response = $this->actingAs($mrUser)->getJson('/api/v1/mr/visits');

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('meta.today_total', 1)
        ->assertJsonPath('meta.today_pending', 1)
        ->assertJsonPath('meta.today_completed', 0);

    expect($response->json('data'))->toHaveCount(1);
    expect($response->json('data.0.doctor.name'))->toBe('Dr. Rajesh Sharma');
});

test('mr user can filter visits by date and status', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Multi Visit Physician',
        'specialization' => 'General Medicine',
        'clinic_hospital_name' => 'Apollo Care',
        'territory' => 'South Zone',
        'phone' => '+91 98201 33444',
        'tier' => 'class_a',
        'target_frequency_per_month' => 2,
    ]);

    // Today scheduled
    Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::today()->toDateString(),
        'call_type' => 'routine_detailing',
        'status' => 'scheduled',
    ]);

    // Yesterday completed
    Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::yesterday()->toDateString(),
        'call_type' => 'sample_delivery',
        'status' => 'completed',
    ]);

    // Tomorrow scheduled
    Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::tomorrow()->toDateString(),
        'call_type' => 'follow_up',
        'status' => 'scheduled',
    ]);

    // Filter by today
    $todayRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/visits?date=today');
    $todayRes->assertStatus(200);
    expect($todayRes->json('data'))->toHaveCount(1);

    // Filter by completed status
    $compRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/visits?status=completed');
    $compRes->assertStatus(200);
    expect($compRes->json('data'))->toHaveCount(1);

    // Filter by upcoming (includes today and future)
    $upRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/visits?date=upcoming');
    $upRes->assertStatus(200);
    expect($upRes->json('data'))->toHaveCount(2);
});

test('mr user can schedule a new field visit with validation', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Priya Desai',
        'specialization' => 'Endocrinology',
        'clinic_hospital_name' => 'Diabetes Care Center',
        'territory' => 'North Hub',
        'phone' => '+91 98201 55666',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ]);

    $payload = [
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::tomorrow()->toDateString(),
        'visit_time' => '02:30 PM',
        'call_type' => 'new_product_launch',
        'products_detailed' => ['Metabolic-XR', 'CiplonPara 650'],
        'remarks' => 'Introduce new extended-release metformin',
    ];

    $response = $this->actingAs($mrUser)->postJson('/api/v1/mr/visits', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.doctor_id', $doctor->id)
        ->assertJsonPath('data.call_type', 'new_product_launch')
        ->assertJsonPath('data.status', 'scheduled');

    $this->assertDatabaseHas('visits', [
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'call_type' => 'new_product_launch',
        'status' => 'scheduled',
    ]);
});

test('visit creation validates required fields and foreign keys', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->postJson('/api/v1/mr/visits', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['doctor_id', 'visit_date', 'call_type']);
});

test('mr user can log call and complete visit with detailing and feedback', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Sameer Khan',
        'specialization' => 'Pulmonology',
        'clinic_hospital_name' => 'Chest & Allergy Care',
        'territory' => 'East Zone',
        'phone' => '+91 98201 77888',
        'tier' => 'class_a',
        'target_frequency_per_month' => 3,
    ]);

    $visit = Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::today()->toDateString(),
        'call_type' => 'routine_detailing',
        'status' => 'scheduled',
    ]);

    $completePayload = [
        'status' => 'completed',
        'products_detailed' => ['AzithroCare 500', 'CiplonVit Gold'],
        'doctor_feedback' => 'highly_interested',
        'samples_given' => '3 strips AzithroCare, 2 bottles CiplonVit',
        'remarks' => 'Doctor agreed to prescribe for respiratory OPD patients',
        'next_visit_date' => Carbon::today()->addDays(14)->toDateString(),
    ];

    $response = $this->actingAs($mrUser)->putJson("/api/v1/mr/visits/{$visit->id}", $completePayload);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.status', 'completed')
        ->assertJsonPath('data.doctor_feedback', 'highly_interested')
        ->assertJsonPath('data.samples_given', '3 strips AzithroCare, 2 bottles CiplonVit');

    $this->assertDatabaseHas('visits', [
        'id' => $visit->id,
        'status' => 'completed',
        'doctor_feedback' => 'highly_interested',
    ]);
});

test('mr user can delete visit record', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Anita Joshi',
        'specialization' => 'Dermatology',
        'clinic_hospital_name' => 'Skin Health Hub',
        'territory' => 'West Zone',
        'phone' => '+91 98201 99000',
        'tier' => 'class_b',
        'target_frequency_per_month' => 2,
    ]);

    $visit = Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::tomorrow()->toDateString(),
        'call_type' => 'cme_invite',
        'status' => 'scheduled',
    ]);

    $response = $this->actingAs($mrUser)->deleteJson("/api/v1/mr/visits/{$visit->id}");

    $response->assertStatus(200)
        ->assertJsonPath('success', true);

    $this->assertDatabaseMissing('visits', ['id' => $visit->id]);
});

test('mr user cannot view or delete visits belonging to another mr', function () {
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr1->assignRole('mr');

    $mr2 = User::factory()->create(['role' => 'mr']);
    $mr2->assignRole('mr');

    $doc1 = Doctor::create([
        'user_id' => $mr1->id,
        'name' => 'Dr. Territory 1 Doctor',
        'specialization' => 'ENT',
        'clinic_hospital_name' => 'ENT Care',
        'territory' => 'Zone 1',
        'phone' => '+91 98201 00111',
        'tier' => 'class_c',
        'target_frequency_per_month' => 1,
    ]);

    $visit1 = Visit::create([
        'user_id' => $mr1->id,
        'doctor_id' => $doc1->id,
        'visit_date' => Carbon::today()->toDateString(),
        'call_type' => 'routine_detailing',
        'status' => 'scheduled',
    ]);

    // MR2 tries to access MR1's visit
    $getRes = $this->actingAs($mr2)->getJson("/api/v1/mr/visits/{$visit1->id}");
    $getRes->assertStatus(404);

    // MR2 tries to update MR1's visit
    $putRes = $this->actingAs($mr2)->putJson("/api/v1/mr/visits/{$visit1->id}", ['status' => 'completed']);
    $putRes->assertStatus(404);

    // MR2 tries to delete MR1's visit
    $delRes = $this->actingAs($mr2)->deleteJson("/api/v1/mr/visits/{$visit1->id}");
    $delRes->assertStatus(404);

    $this->assertDatabaseHas('visits', ['id' => $visit1->id]);
});

test('mr dashboard reflects visit counts and completion in real time', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Dashboard Sync Doctor',
        'specialization' => 'Cardiology',
        'clinic_hospital_name' => 'Metro Care',
        'territory' => 'Central Hub',
        'phone' => '+91 98201 22334',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ]);

    // Schedule 2 visits for today
    Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::today()->toDateString(),
        'call_type' => 'routine_detailing',
        'status' => 'scheduled',
    ]);

    Visit::create([
        'user_id' => $mrUser->id,
        'doctor_id' => $doctor->id,
        'visit_date' => Carbon::today()->toDateString(),
        'call_type' => 'sample_delivery',
        'status' => 'completed',
        'products_detailed' => ['Cardiovast-AM'],
    ]);

    $dashRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/dashboard');

    $dashRes->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.summary.today_visits', 2)
        ->assertJsonPath('data.summary.completed_visits', 1)
        ->assertJsonPath('data.summary.pending_visits', 1);
});
