<?php

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    // Clean tables
    DB::table('notifications')->delete();
    DB::table('leaves')->delete();
});

test('mr applying for leave sends in-app notification to all administrators', function () {
    $admin1 = User::factory()->create(['role' => 'admin']);
    $admin2 = User::factory()->create(['role' => 'super_admin']);
    $mr = User::factory()->create(['role' => 'mr', 'name' => 'Amit Kumar']);

    $response = $this->actingAs($mr)->post('/mrconnect/leave', [
        'leave_type' => 'Casual Leave',
        'from_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
        'to_date' => Carbon::now()->addDays(4)->format('Y-m-d'),
        'reason' => 'Family function in hometown',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('leaves', [
        'user_id' => $mr->id,
        'leave_type' => 'Casual Leave',
        'status' => 'pending',
    ]);

    // Check notifications sent to both admins
    $this->assertDatabaseHas('notifications', [
        'user_id' => $admin1->id,
        'type' => 'leave_applied',
        'title' => 'New Leave Request',
    ]);

    $this->assertDatabaseHas('notifications', [
        'user_id' => $admin2->id,
        'type' => 'leave_applied',
        'title' => 'New Leave Request',
    ]);

    $notif = Notification::where('user_id', $admin1->id)->first();
    expect($notif->message)->toContain('Amit Kumar')
        ->and($notif->message)->toContain('Casual Leave')
        ->and($notif->link)->toBe('/mrconnect/leave')
        ->and($notif->read_at)->toBeNull();
});

test('admin approving leave sends in-app notification to MR', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mr = User::factory()->create(['role' => 'mr', 'name' => 'Suresh Verma']);

    $leaveId = DB::table('leaves')->insertGetId([
        'user_id' => $mr->id,
        'leave_type' => 'Sick Leave',
        'from_date' => Carbon::now()->format('Y-m-d'),
        'to_date' => Carbon::now()->addDay()->format('Y-m-d'),
        'days_count' => 2,
        'reason' => 'Viral fever',
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->post("/mrconnect/leave/{$leaveId}/approve");

    $response->assertSessionHas('success', 'Leave request approved.');
    $this->assertDatabaseHas('leaves', [
        'id' => $leaveId,
        'status' => 'approved',
    ]);

    // Check notification sent to MR
    $this->assertDatabaseHas('notifications', [
        'user_id' => $mr->id,
        'type' => 'leave_approved',
        'title' => 'Leave Request Approved',
    ]);

    $notif = Notification::where('user_id', $mr->id)->first();
    expect($notif->message)->toContain('Sick Leave')
        ->and($notif->message)->toContain('approved');
});

test('admin rejecting leave sends in-app notification with feedback to MR', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mr = User::factory()->create(['role' => 'mr', 'name' => 'Vikas Pandey']);

    $leaveId = DB::table('leaves')->insertGetId([
        'user_id' => $mr->id,
        'leave_type' => 'Earned Leave',
        'from_date' => Carbon::now()->addDays(5)->format('Y-m-d'),
        'to_date' => Carbon::now()->addDays(10)->format('Y-m-d'),
        'days_count' => 6,
        'reason' => 'Vacation trip',
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->post("/mrconnect/leave/{$leaveId}/reject", [
        'admin_feedback' => 'Quarterly doctor campaign scheduled on these dates',
    ]);

    $response->assertSessionHas('success', 'Leave request rejected.');
    $this->assertDatabaseHas('leaves', [
        'id' => $leaveId,
        'status' => 'rejected',
        'admin_feedback' => 'Quarterly doctor campaign scheduled on these dates',
    ]);

    // Check notification sent to MR
    $notif = Notification::where('user_id', $mr->id)->first();
    expect($notif)->not->toBeNull()
        ->and($notif->type)->toBe('leave_rejected')
        ->and($notif->title)->toBe('Leave Request Rejected')
        ->and($notif->message)->toContain('Quarterly doctor campaign scheduled');
});

test('user can mark notification as read and mark all as read', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $n1 = Notification::create([
        'user_id' => $user->id,
        'type' => 'leave_applied',
        'title' => 'Leave Request 1',
        'message' => 'MR 1 applied',
    ]);

    $n2 = Notification::create([
        'user_id' => $user->id,
        'type' => 'leave_applied',
        'title' => 'Leave Request 2',
        'message' => 'MR 2 applied',
    ]);

    expect($n1->fresh()->read_at)->toBeNull();
    expect($n2->fresh()->read_at)->toBeNull();

    // Mark single as read
    $res1 = $this->actingAs($user)->postJson("/notifications/{$n1->id}/read");
    $res1->assertOk();
    expect($n1->fresh()->read_at)->not->toBeNull();
    expect($n2->fresh()->read_at)->toBeNull();

    // Mark all as read
    $res2 = $this->actingAs($user)->postJson('/notifications/mark-all-read');
    $res2->assertOk();
    expect($n2->fresh()->read_at)->not->toBeNull();
});

test('clicking notification marks as read and redirects to redirect_to destination', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $n = Notification::create([
        'user_id' => $user->id,
        'type' => 'leave_applied',
        'title' => 'Leave Request Test',
        'message' => 'MR applied',
        'link' => '/mrconnect/leave',
    ]);

    expect($n->fresh()->read_at)->toBeNull();

    $response = $this->actingAs($user)->post("/notifications/{$n->id}/read", [
        'redirect_to' => '/mrconnect/leave',
    ]);

    $response->assertRedirect('/mrconnect/leave');
    expect($n->fresh()->read_at)->not->toBeNull();
});
