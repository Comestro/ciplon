<?php

use App\Models\Doctor;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
});

test('unauthenticated users are redirected from mr doctors page', function () {
    $response = $this->get('/mr/doctors');

    $response->assertRedirect('/login');
});

test('unauthenticated users receive 401 from mr doctors api', function () {
    $response = $this->getJson('/api/v1/mr/doctors');

    $response->assertStatus(401);
});

test('unauthorized users without mr role receive 403 from mr doctors page and api', function () {
    $regularUser = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($regularUser)->get('/mr/doctors');
    $response->assertStatus(403);

    $apiResponse = $this->actingAs($regularUser)->getJson('/api/v1/mr/doctors');
    $apiResponse->assertStatus(403);
});

test('mr user can access mr doctors page', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->get('/mr/doctors');

    $response->assertStatus(200);
});

test('mr user can list their assigned doctors via api with metadata', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Test Physician',
        'qualification' => 'MBBS',
        'specialization' => 'Cardiology',
        'clinic_hospital_name' => 'City Care Clinic',
        'territory' => 'Downtown',
        'phone' => '+91 99999 88888',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
        'status' => 'active',
    ]);

    $response = $this->actingAs($mrUser)->getJson('/api/v1/mr/doctors');

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('meta.core_count', 1)
        ->assertJsonPath('meta.total_monthly_target_visits', 4);
});

test('mr user can search and filter doctors by specialization and tier', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Heart Specialist',
        'specialization' => 'Cardiology',
        'clinic_hospital_name' => 'Heart Hospital',
        'territory' => 'South Zone',
        'phone' => '+91 91111 22222',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ]);

    Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Bone Specialist',
        'specialization' => 'Orthopedics',
        'clinic_hospital_name' => 'Ortho Center',
        'territory' => 'North Zone',
        'phone' => '+91 93333 44444',
        'tier' => 'class_b',
        'target_frequency_per_month' => 2,
    ]);

    // Search by name
    $searchRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/doctors?search=Heart');
    $searchRes->assertStatus(200);
    expect($searchRes->json('data'))->toHaveCount(1);

    // Filter by specialization
    $specRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/doctors?specialization=Orthopedics');
    $specRes->assertStatus(200);
    expect($specRes->json('data'))->toHaveCount(1);
    expect($specRes->json('data.0.specialization'))->toBe('Orthopedics');

    // Filter by tier
    $tierRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/doctors?tier=core');
    $tierRes->assertStatus(200);
    expect($tierRes->json('data'))->toHaveCount(1);
    expect($tierRes->json('data.0.tier'))->toBe('core');
});

test('mr user can create a doctor with valid fields', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $payload = [
        'name' => 'Dr. New Provider',
        'qualification' => 'MBBS, MD',
        'specialization' => 'Pediatrics',
        'clinic_hospital_name' => 'Children Clinic',
        'address' => '123 Main Road',
        'territory' => 'East Zone',
        'city' => 'Mumbai',
        'phone' => '+91 97777 66666',
        'email' => 'newdoc@clinic.com',
        'visiting_hours' => '10:00 AM - 01:00 PM',
        'visiting_days' => 'Mon - Sat',
        'tier' => 'class_a',
        'target_frequency_per_month' => 3,
        'notes' => 'Key pediatrician in area',
    ];

    $response = $this->actingAs($mrUser)->postJson('/api/v1/mr/doctors', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.name', 'Dr. New Provider');

    $this->assertDatabaseHas('doctors', [
        'user_id' => $mrUser->id,
        'name' => 'Dr. New Provider',
        'specialization' => 'Pediatrics',
    ]);
});

test('doctor creation validates required fields', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->postJson('/api/v1/mr/doctors', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'specialization', 'clinic_hospital_name', 'territory', 'phone', 'tier', 'target_frequency_per_month']);
});

test('mr user can update doctor details', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Initial Name',
        'specialization' => 'General Medicine',
        'clinic_hospital_name' => 'Initial Clinic',
        'territory' => 'Downtown',
        'phone' => '+91 98888 77777',
        'tier' => 'class_b',
        'target_frequency_per_month' => 2,
    ]);

    $updatePayload = [
        'name' => 'Dr. Updated Name',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ];

    $response = $this->actingAs($mrUser)->putJson("/api/v1/mr/doctors/{$doctor->id}", $updatePayload);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.name', 'Dr. Updated Name')
        ->assertJsonPath('data.tier', 'core')
        ->assertJsonPath('data.target_frequency_per_month', 4);

    $this->assertDatabaseHas('doctors', [
        'id' => $doctor->id,
        'name' => 'Dr. Updated Name',
        'tier' => 'core',
    ]);
});

test('mr user can delete a doctor from their directory', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. To Delete',
        'specialization' => 'Dermatology',
        'clinic_hospital_name' => 'Skin Clinic',
        'territory' => 'West Zone',
        'phone' => '+91 95555 44444',
        'tier' => 'class_c',
        'target_frequency_per_month' => 1,
    ]);

    $response = $this->actingAs($mrUser)->deleteJson("/api/v1/mr/doctors/{$doctor->id}");

    $response->assertStatus(200)
        ->assertJsonPath('success', true);

    $this->assertDatabaseMissing('doctors', ['id' => $doctor->id]);
});

test('mr user cannot access or delete doctors belonging to another mr user', function () {
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr1->assignRole('mr');

    $mr2 = User::factory()->create(['role' => 'mr']);
    $mr2->assignRole('mr');

    $doctorOfMr1 = Doctor::create([
        'user_id' => $mr1->id,
        'name' => 'Dr. MR1 Exclusive Doctor',
        'specialization' => 'Neurology',
        'clinic_hospital_name' => 'Neuro Clinic',
        'territory' => 'Central Suburbs',
        'phone' => '+91 94444 33333',
        'tier' => 'class_a',
        'target_frequency_per_month' => 2,
    ]);

    // MR2 tries to view MR1's doctor
    $viewRes = $this->actingAs($mr2)->getJson("/api/v1/mr/doctors/{$doctorOfMr1->id}");
    $viewRes->assertStatus(404);

    // MR2 tries to delete MR1's doctor
    $delRes = $this->actingAs($mr2)->deleteJson("/api/v1/mr/doctors/{$doctorOfMr1->id}");
    $delRes->assertStatus(404);

    // MR1's doctor still exists
    $this->assertDatabaseHas('doctors', ['id' => $doctorOfMr1->id]);
});

test('mr user can access create doctor page', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->get('/mr/doctors/create');

    $response->assertStatus(200);
});

test('mr user can access edit doctor page for their own doctor', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mrUser->id,
        'name' => 'Dr. Edit Page Test',
        'specialization' => 'Cardiology',
        'clinic_hospital_name' => 'Cardio Care',
        'territory' => 'Central Hub',
        'phone' => '+91 98201 44556',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ]);

    $response = $this->actingAs($mrUser)->get("/mr/doctors/{$doctor->id}/edit");

    $response->assertStatus(200);
});

test('mr user cannot access edit doctor page for doctor belonging to another mr', function () {
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr1->assignRole('mr');

    $mr2 = User::factory()->create(['role' => 'mr']);
    $mr2->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mr1->id,
        'name' => 'Dr. Exclusive to MR1',
        'specialization' => 'Neurology',
        'clinic_hospital_name' => 'Neuro Clinic',
        'territory' => 'Suburbs',
        'phone' => '+91 98201 77889',
        'tier' => 'class_a',
        'target_frequency_per_month' => 3,
    ]);

    $response = $this->actingAs($mr2)->get("/mr/doctors/{$doctor->id}/edit");

    $response->assertStatus(404);
});
