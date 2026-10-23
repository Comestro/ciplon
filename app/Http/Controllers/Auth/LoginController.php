<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    // Display the administrator login page.
    public function create(): Response
    {
        return Inertia::render('auth/LoginPage');
    }

    // Authenticate the user and establish a web session.
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'No account found with this email address.',
            ]);
        }

        if (! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => 'The password you entered is incorrect.',
            ]);
        }

        $isAllowed = $user->isAdmin()
            || $user->hasRole(['manager', 'mr'])
            || in_array($user->role, ['super_admin', 'admin', 'manager', 'mr']);

        if (! $isAllowed) {
            throw ValidationException::withMessages([
                'email' => 'Access denied. Staff or administrator credentials required.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        if ($user->hasRole('mr') || $user->role === 'mr') {
            return redirect()->intended('/mr/dashboard')->with('success', 'Signed into MR portal successfully.');
        }

        return redirect()->intended('/admin')->with('success', 'Signed in successfully.');
    }

    // Terminate session and logout user.
    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('success', 'Logged out successfully.');
    }
}
