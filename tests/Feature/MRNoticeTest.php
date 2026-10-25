<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

test('guest cannot access notice page or store notice', function () {
    $this->get('/mrconnect/notice')->assertRedirect('/login');
    $this->post('/mrconnect/notice', [
        'title' => 'Test Notice',
        'content' => 'Test content',
    ])->assertRedirect('/login');
});

test('mr user can view notices but cannot create or delete announcements', function () {
    $mr = User::factory()->create(['role' => 'mr']);

    $noticeId = DB::table('notices')->insertGetId([
        'title' => 'Company Policy Update',
        'content' => 'Review new guidelines.',
        'published_by' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // View notices
    $response = $this->actingAs($mr)->get('/mrconnect/notice');
    $response->assertStatus(200);

    // Try creating notice - should be forbidden 403
    $this->actingAs($mr)->post('/mrconnect/notice', [
        'title' => 'Unauthorized Post',
        'content' => 'Should fail',
    ])->assertStatus(403);

    // Try deleting notice - should be forbidden 403
    $this->actingAs($mr)->delete("/mrconnect/notice/{$noticeId}")->assertStatus(403);
});

test('admin can create and broadcast an official announcement', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mr1 = User::factory()->create(['role' => 'mr']);
    $mr2 = User::factory()->create(['role' => 'mr']);

    $response = $this->actingAs($admin)->post('/mrconnect/notice', [
        'title' => 'New Q4 Antibiotic Price Structure',
        'content' => 'Effective November 1st, revised price lists will apply across all stockists.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('notices', [
        'title' => 'New Q4 Antibiotic Price Structure',
        'published_by' => $admin->id,
    ]);

    // Verify notifications were broadcast to MRs
    $this->assertDatabaseHas('notifications', [
        'user_id' => $mr1->id,
        'type' => 'notice',
    ]);
    $this->assertDatabaseHas('notifications', [
        'user_id' => $mr2->id,
        'type' => 'notice',
    ]);
});

test('admin can delete an announcement', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $noticeId = DB::table('notices')->insertGetId([
        'title' => 'Temporary Notice',
        'content' => 'To be deleted.',
        'published_by' => $admin->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($admin)->delete("/mrconnect/notice/{$noticeId}");
    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('notices', [
        'id' => $noticeId,
    ]);
});
