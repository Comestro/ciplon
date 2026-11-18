<?php

use App\Models\User;
use App\Services\R2StorageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
    Role::firstOrCreate(['name' => 'admin']);
});

test('mr representative can submit expense claim with uploaded receipt file stored in cloudflare r2', function () {
    Storage::fake('r2');

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
    expect($record->receipt_url)->toContain('/expenses/petrol-receipt_');

    $files = Storage::disk('r2')->files('expenses');
    expect($files)->toHaveCount(1);
});

test('r2 upload failure returns validation error and does not use local storage', function () {
    $mock = Mockery::mock(R2StorageService::class);
    $mock->shouldReceive('upload')->once()->andThrow(new RuntimeException('R2 connection failed'));
    app()->instance(R2StorageService::class, $mock);

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
