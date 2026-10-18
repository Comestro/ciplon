<?php

use App\Models\User;
use App\Models\Doctor;
use App\Models\MRSchedule;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
});

test('unauthenticated users are redirected from mr schedule', function () {
    $response = $this->get('/mr/schedule');
    $response->assertRedirect('/login');
});

test('non-mr user cannot access mr schedule', function () {
    $regularUser = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($regularUser)->get('/mr/schedule');
    $response->assertStatus(403);
});

test('mr user can access schedule planner page', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->get('/mr/visits');
    $response->assertStatus(200);

    $redirectResponse = $this->actingAs($mr)->get('/mr/schedule');
    $redirectResponse->assertRedirect('/mr/visits?view=planner');
});

test('mr can create a visit schedule for a registered doctor', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $doctor = Doctor::create([
        'user_id' => $mr->id,
        'name' => 'Dr. Rajesh Sharma',
        'qualification' => 'MBBS, MD',
        'specialization' => 'Cardiology',
        'clinic_hospital_name' => 'Metro Heart Care',
        'territory' => 'Central Hub',
        'phone' => '+91 98201 11222',
        'tier' => 'core',
        'target_frequency_per_month' => 4,
    ]);

    $payload = [
        'doctor_id' => $doctor->id,
        'contact_type' => 'doctor',
        'action_type' => 'visit',
        'scheduled_date' => Carbon::today()->toDateString(),
        'scheduled_time' => 'Morning OPD (10:30 AM)',
        'priority' => 'high',
        'purpose' => 'Detailing Ciplox and sample distribution',
        'notes' => 'Discuss clinical trial efficacy',
    ];

    $response = $this->actingAs($mr)->post('/mr/schedule', $payload);
    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('mr_schedules', [
        'user_id' => $mr->id,
        'doctor_id' => $doctor->id,
        'action_type' => 'visit',
        'priority' => 'high',
        'status' => 'pending',
    ]);
});

test('mr can create a call schedule for a custom chemist contact', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $payload = [
        'custom_contact_name' => 'City Medico Pharmacy',
        'contact_type' => 'chemist',
        'action_type' => 'call',
        'scheduled_date' => Carbon::today()->toDateString(),
        'scheduled_time' => '02:30 PM',
        'priority' => 'normal',
        'purpose' => 'Stock verification of Ciplocef',
    ];

    $response = $this->actingAs($mr)->post('/mr/schedule', $payload);
    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('mr_schedules', [
        'user_id' => $mr->id,
        'custom_contact_name' => 'City Medico Pharmacy',
        'contact_type' => 'chemist',
        'action_type' => 'call',
        'status' => 'pending',
    ]);
});

test('creating schedule fails without doctor or custom contact', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $payload = [
        'contact_type' => 'doctor',
        'action_type' => 'call',
        'scheduled_date' => Carbon::today()->toDateString(),
        'priority' => 'normal',
        'purpose' => 'General follow up',
    ];

    $response = $this->actingAs($mr)->post('/mr/schedule', $payload);
    $response->assertSessionHasErrors(['doctor_id']);
});

test('mr can mark schedule as completed with outcome note', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $schedule = MRSchedule::create([
        'user_id' => $mr->id,
        'custom_contact_name' => 'Dr. Sharma Clinic Desk',
        'contact_type' => 'doctor',
        'action_type' => 'call',
        'scheduled_date' => Carbon::today()->toDateString(),
        'priority' => 'high',
        'purpose' => 'Check OPD availability',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($mr)->put("/mr/schedule/{$schedule->id}/status", [
        'status' => 'completed',
        'outcome_note' => 'Spoke with receptionist, confirmed doctor OPD on Monday.',
    ]);

    $response->assertRedirect();

    $schedule->refresh();
    expect($schedule->status)->toBe('completed');
    expect($schedule->outcome_note)->toBe('Spoke with receptionist, confirmed doctor OPD on Monday.');
    expect($schedule->completed_at)->not->toBeNull();
});

test('mr can mark completed schedule back to pending', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $schedule = MRSchedule::create([
        'user_id' => $mr->id,
        'custom_contact_name' => 'Dr. Sharma Clinic Desk',
        'contact_type' => 'doctor',
        'action_type' => 'call',
        'scheduled_date' => Carbon::today()->toDateString(),
        'priority' => 'high',
        'purpose' => 'Check OPD availability',
        'status' => 'completed',
        'completed_at' => now(),
    ]);

    $response = $this->actingAs($mr)->put("/mr/schedule/{$schedule->id}/status", [
        'status' => 'pending',
    ]);

    $response->assertRedirect();

    $schedule->refresh();
    expect($schedule->status)->toBe('pending');
    expect($schedule->completed_at)->toBeNull();
});

test('mr can reschedule an item to a new date and time', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $schedule = MRSchedule::create([
        'user_id' => $mr->id,
        'custom_contact_name' => 'City Hospital Desk',
        'contact_type' => 'hospital',
        'action_type' => 'visit',
        'scheduled_date' => Carbon::today()->toDateString(),
        'scheduled_time' => '10:00 AM',
        'priority' => 'normal',
        'purpose' => 'Submit purchase quotation',
        'status' => 'pending',
    ]);

    $tomorrow = Carbon::tomorrow()->toDateString();

    $response = $this->actingAs($mr)->put("/mr/schedule/{$schedule->id}/status", [
        'status' => 'rescheduled',
        'new_date' => $tomorrow,
        'new_time' => '11:30 AM',
    ]);

    $response->assertRedirect();

    $schedule->refresh();
    expect($schedule->scheduled_date->toDateString())->toBe($tomorrow);
    expect($schedule->scheduled_time)->toBe('11:30 AM');
    expect($schedule->status)->toBe('pending');
});

test('mr cannot update or delete another mr schedule', function () {
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr1->assignRole('mr');

    $mr2 = User::factory()->create(['role' => 'mr']);
    $mr2->assignRole('mr');

    $schedule = MRSchedule::create([
        'user_id' => $mr1->id,
        'custom_contact_name' => 'Private Hospital',
        'contact_type' => 'hospital',
        'action_type' => 'call',
        'scheduled_date' => Carbon::today()->toDateString(),
        'priority' => 'normal',
        'purpose' => 'Private enquiry',
        'status' => 'pending',
    ]);

    // MR2 attempts to update MR1's schedule
    $response = $this->actingAs($mr2)->put("/mr/schedule/{$schedule->id}/status", [
        'status' => 'completed',
    ]);
    $response->assertStatus(403);

    // MR2 attempts to delete MR1's schedule
    $deleteResponse = $this->actingAs($mr2)->delete("/mr/schedule/{$schedule->id}");
    $deleteResponse->assertStatus(403);
});

test('mr can delete own schedule', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $schedule = MRSchedule::create([
        'user_id' => $mr->id,
        'custom_contact_name' => 'Temporary Contact',
        'contact_type' => 'chemist',
        'action_type' => 'call',
        'scheduled_date' => Carbon::today()->toDateString(),
        'priority' => 'low',
        'purpose' => 'Discardable task',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($mr)->delete("/mr/schedule/{$schedule->id}");
    $response->assertRedirect();

    $this->assertDatabaseMissing('mr_schedules', ['id' => $schedule->id]);
});
