<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetOtpMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    /**
     * Show the forgot password page or redirect to login with modal trigger.
     */
    public function show(): RedirectResponse
    {
        return redirect()->route('login', ['forgot' => 1]);
    }

    /**
     * Generate and dispatch a 6-digit OTP to the user's email address.
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return $this->errorResponse('email', 'No active account found with this email address.');
        }

        $otp = sprintf('%06d', random_int(100000, 999999));

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($otp),
                'created_at' => now(),
            ]
        );

        Log::info("Password reset OTP for {$user->email}: {$otp}");

        try {
            Mail::to($user->email)->send(new PasswordResetOtpMail($otp, $user->name));
        } catch (\Throwable $e) {
            Log::error('Failed to send password reset OTP mail: '.$e->getMessage());

            if (app()->environment('production')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to send email at this moment. Please try again shortly or contact support.',
                ], 500);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'A 6-digit verification code has been dispatched to your email address.',
        ]);
    }

    /**
     * Validate the submitted 6-digit OTP.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        if ($error = $this->checkOtp($validated['email'], $validated['otp'])) {
            return $this->errorResponse('otp', $error);
        }

        return response()->json([
            'success' => true,
            'message' => 'Verification code confirmed. Please set your new password.',
        ]);
    }

    /**
     * Reset the user password after full verification.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($error = $this->checkOtp($validated['email'], $validated['otp'])) {
            return $this->errorResponse('otp', $error);
        }

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return $this->errorResponse('email', 'User account not found.', 404);
        }

        $user->forceFill(['password' => Hash::make($validated['password'])])->save();
        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully! You can now log in with your new credentials.',
        ]);
    }

    /**
     * Verify whether the stored OTP exists, matches, and is not expired.
     */
    private function checkOtp(string $email, string $otp): ?string
    {
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (! $record) {
            return 'No reset code requested for this email. Please request a new code.';
        }

        if (Carbon::parse($record->created_at)->addMinutes(10)->isPast()) {
            return 'Verification code has expired. Please request a new code.';
        }

        if (! Hash::check($otp, $record->token)) {
            return 'Incorrect verification code. Please check your email and try again.';
        }

        return null;
    }

    /**
     * Return a standardized JSON error response.
     */
    private function errorResponse(string $field, string $message, int $status = 422): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => [$field => [$message]],
        ], $status);
    }
}
