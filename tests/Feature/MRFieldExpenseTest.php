<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
    Role::firstOrCreate(['name' => 'admin']);
});

test('mr representative can submit expense claim with uploaded receipt file stored in imagekit', function () {
    Http::fake([
        'https://upload.imagekit.io/*' => Http::response([
            'fileId' => 'exp_file_987',
            'url' => 'https://ik.imagekit.io/ciplon/expenses/petrol_receipt_987.jpg',
            'name' => 'petrol_receipt.jpg',
            'size' => 120000,
        ], 200),
    ]);

    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $file = UploadedFile::fake()->create('petrol_receipt.jpg', 120, 'image/jpeg');

    $response = $this->actingAs($mr)->post('/mrconnect/field-expenses', [
        'date' => '2026-10-24',
        'expense_type' => 'travel_fuel',
        'amount' => 850,
        'distance_km' => 65,
        'city' => 'Madurai',
        'notes' => 'Fuel slip attached',
        'receipt' => $file,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $record = DB::table('field_expenses')->where('user_id', $mr->id)->first();
    expect($record)->not->toBeNull();
    expect($record->expense_type)->toBe('travel_fuel');
    expect((float) $record->amount)->toBe(850.0);
    expect($record->receipt_url)->toBe('https://ik.imagekit.io/ciplon/expenses/petrol_receipt_987.jpg');
});

test('imagekit upload failure returns validation error and does not use local storage', function () {
    Http::fake([
        'https://upload.imagekit.io/*' => Http::response([
            'message' => 'Authentication failed or quota exceeded',
        ], 403),
    ]);

    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $file = UploadedFile::fake()->create('petrol_receipt.jpg', 120, 'image/jpeg');

    $response = $this->actingAs($mr)->post('/mrconnect/field-expenses', [
        'date' => '2026-10-24',
        'expense_type' => 'travel_fuel',
        'amount' => 850,
        'distance_km' => 65,
        'city' => 'Madurai',
        'receipt' => $file,
    ]);

    $response->assertSessionHasErrors(['receipt']);

    // Ensure no record was created
    expect(DB::table('field_expenses')->where('user_id', $mr->id)->count())->toBe(0);
});

test('submitting expense receipt file over 5mb fails validation', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    // 6MB file (6000 KB > 5120 KB limit)
    $file = UploadedFile::fake()->create('huge_bill.pdf', 6000, 'application/pdf');

    $response = $this->actingAs($mr)->post('/mrconnect/field-expenses', [
        'date' => '2026-10-24',
        'expense_type' => 'lodging',
        'amount' => 2500,
        'receipt' => $file,
    ]);

    $response->assertSessionHasErrors(['receipt']);
});

test('mr representative can submit expense claim with direct receipt url', function () {
    $mr = User::factory()->create(['role' => 'mr']);
    $mr->assignRole('mr');

    $response = $this->actingAs($mr)->post('/mrconnect/field-expenses', [
        'date' => '2026-10-24',
        'expense_type' => 'lodging',
        'amount' => 1800,
        'city' => 'Trichy',
        'notes' => 'Hotel bill link',
        'receipt_url' => 'https://example.com/receipts/bill1024.pdf',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $record = DB::table('field_expenses')->where('user_id', $mr->id)->first();
    expect($record)->not->toBeNull();
    expect($record->receipt_url)->toBe('https://example.com/receipts/bill1024.pdf');
});
