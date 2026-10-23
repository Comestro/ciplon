<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    // Handle an incoming request and ensure authenticated user has admin role.
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            return redirect()->guest('/login');
        }

        if (! $request->user()->isAdmin()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Administrator privileges required.',
                ], 403);
            }

            abort(403, 'Access denied. Administrator privileges required.');
        }

        return $next($request);
    }
}
