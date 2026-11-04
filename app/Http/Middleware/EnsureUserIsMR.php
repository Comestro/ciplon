<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsMR
{
    /**
     * Handle an incoming request and ensure authenticated user has MR or Administrator privileges.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            return redirect()->guest('/login');
        }

        $isAuthorized = $user->isAdmin()
            || $user->hasRole(['mr', 'super_admin', 'manager', 'admin'])
            || in_array($user->role, ['mr', 'super_admin', 'manager', 'admin'], true);

        if (! $isAuthorized) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Medical Representative privileges required.',
                ], 403);
            }

            abort(403, 'Access denied. Medical Representative privileges required.');
        }

        return $next($request);
    }
}
