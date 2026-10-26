<?php

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    DB::table('notifications')->delete();
    DB::table('field_expenses')->delete();
});

test('mr submitting field expense sends in-app notification to all administrators', function () {
    $admin1 = User::factory()->create(['role' => 'admin']);
    $admin2 = User::factory()->create(['role' => 'super_admin']);
    $mr = User::factory()->create(['role' => 'mr', 'name' => 'Rohan Gupta']);

    $response = $this->actingAs($mr)->post('/mrconnect/field-expenses', [
        'date' => Carbon::now()->format('Y-m-d'),
        'expense_type' => 'Travel Allowance',
        'amount' => 1850,
        'distance_km' => 75,
        'city' => 'Pune',
        'notes' => 'Visited 6 clinics in South Pune zone',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('field_expenses', [
        'user_id' => $mr->id,
        'expense_type' => 'Travel Allowance',
        'amount' => 1850,
        'status' => 'pending',
    ]);

    // Check notifications dispatched to both administrators
    $this->assertDatabaseHas('notifications', [
        'user_id' => $admin1->id,
        'type' => 'expense_submitted',
        'title' => 'New Field Expense Claim',
    ]);

    $this->assertDatabaseHas('notifications', [
        'user_id' => $admin2->id,
        'type' => 'expense_submitted',
        'title' => 'New Field Expense Claim',
    ]);

    $notif = Notification::where('user_id', $admin1->id)->first();
    expect($notif->message)->toContain('Rohan Gupta')
        ->and($notif->message)->toContain('1,850')
        ->and($notif->message)->toContain('Travel Allowance')
        ->and($notif->link)->toBe('/mrconnect/field-expenses');
});

test('admin approving field expense sends in-app notification to MR', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mr = User::factory()->create(['role' => 'mr', 'name' => 'Sunil Joshi']);

    $expenseId = DB::table('field_expenses')->insertGetId([
        'user_id' => $mr->id,
        'date' => Carbon::now()->format('Y-m-d'),
        'expense_type' => 'Daily Allowance',
        'amount' => 600,
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->post("/mrconnect/field-expenses/{$expenseId}/approve");

    $response->assertSessionHas('success', 'Expense claim approved.');
    $this->assertDatabaseHas('field_expenses', [
        'id' => $expenseId,
        'status' => 'approved',
    ]);

    // Check notification sent to MR
    $this->assertDatabaseHas('notifications', [
        'user_id' => $mr->id,
        'type' => 'expense_approved',
        'title' => 'Expense Claim Approved',
    ]);

    $notif = Notification::where('user_id', $mr->id)->first();
    expect($notif->message)->toContain('600')
        ->and($notif->message)->toContain('Daily Allowance')
        ->and($notif->message)->toContain('approved')
        ->and($notif->link)->toBe('/mrconnect/field-expenses');
});

test('admin rejecting field expense sends in-app notification with reason to MR', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mr = User::factory()->create(['role' => 'mr', 'name' => 'Kunal Sharma']);

    $expenseId = DB::table('field_expenses')->insertGetId([
        'user_id' => $mr->id,
        'date' => Carbon::now()->format('Y-m-d'),
        'expense_type' => 'Hotel Stay',
        'amount' => 3200,
        'status' => 'pending',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->post("/mrconnect/field-expenses/{$expenseId}/reject", [
        'reason' => 'Hotel bill receipt is illegible. Please re-upload clear GST invoice.',
    ]);

    $response->assertSessionHas('success', 'Expense claim rejected.');
    $this->assertDatabaseHas('field_expenses', [
        'id' => $expenseId,
        'status' => 'rejected',
        'admin_feedback' => 'Hotel bill receipt is illegible. Please re-upload clear GST invoice.',
    ]);

    // Check notification sent to MR
    $notif = Notification::where('user_id', $mr->id)->first();
    expect($notif)->not->toBeNull()
        ->and($notif->type)->toBe('expense_rejected')
        ->and($notif->title)->toBe('Expense Claim Rejected')
        ->and($notif->message)->toContain('3,200')
        ->and($notif->message)->toContain('Hotel bill receipt is illegible');
});
