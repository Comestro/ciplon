<?php

use App\Mail\PasswordResetOtpMail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
});

test('guest cannot request otp for non-existent email', function () {
    $response = $this->postJson('/forgot-password/send-otp', [
        'email' => 'doesnotexist@example.com',
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'No active account found with this email address.',
        ]);

    Mail::assertNothingSent();
});

test('guest can request otp for valid registered account', function () {
    $user = User::factory()->create([
        'email' => 'doctor.sharma@example.com',
    ]);

    $response = $this->postJson('/forgot-password/send-otp', [
        'email' => 'doctor.sharma@example.com',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ]);

    Mail::assertSent(PasswordResetOtpMail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email) && strlen($mail->otp) === 6;
    });

    $this->assertDatabaseHas('password_reset_tokens', [
        'email' => 'doctor.sharma@example.com',
    ]);
});

test('guest cannot verify invalid or expired otp', function () {
    $user = User::factory()->create(['email' => 'mr.verma@example.com']);

    // Seed token
    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $user->email],
        [
            'token' => Hash::make('123456'),
            'created_at' => now()->subMinutes(15), // expired
        ]
    );

    // Expired OTP
    $response = $this->postJson('/forgot-password/verify-otp', [
        'email' => $user->email,
        'otp' => '123456',
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'Verification code has expired. Please request a new code.',
        ]);

    // Update to non-expired, test wrong OTP
    DB::table('password_reset_tokens')->where('email', $user->email)->update([
        'created_at' => now(),
    ]);

    $responseWrong = $this->postJson('/forgot-password/verify-otp', [
        'email' => $user->email,
        'otp' => '999999',
    ]);

    $responseWrong->assertStatus(422)
        ->assertJson([
            'success' => false,
            'message' => 'Incorrect verification code. Please check your email and try again.',
        ]);
});

test('guest can verify valid otp', function () {
    $user = User::factory()->create(['email' => 'mr.gupta@example.com']);

    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $user->email],
        [
            'token' => Hash::make('654321'),
            'created_at' => now(),
        ]
    );

    $response = $this->postJson('/forgot-password/verify-otp', [
        'email' => $user->email,
        'otp' => '654321',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ]);
});

test('guest can reset password using valid otp and log in with new password', function () {
    $user = User::factory()->create([
        'email' => 'admin.test@example.com',
        'password' => Hash::make('old_password_123'),
        'role' => 'admin',
    ]);

    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $user->email],
        [
            'token' => Hash::make('789012'),
            'created_at' => now(),
        ]
    );

    $response = $this->postJson('/forgot-password/reset-password', [
        'email' => $user->email,
        'otp' => '789012',
        'password' => 'new_secret_password_123',
        'password_confirmation' => 'new_secret_password_123',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ]);

    // Token record should be cleared
    $this->assertDatabaseMissing('password_reset_tokens', [
        'email' => $user->email,
    ]);

    // Fresh user should have new password
    $user->refresh();
    expect(Hash::check('new_secret_password_123', $user->password))->toBeTrue();

    // Verify user can now authenticate with the new password
    $loginResponse = $this->post('/login', [
        'email' => $user->email,
        'password' => 'new_secret_password_123',
    ]);

    $loginResponse->assertRedirect('/admin');
});
