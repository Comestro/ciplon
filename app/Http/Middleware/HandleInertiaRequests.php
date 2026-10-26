<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Notification;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
            'notifications' => function () use ($request) {
                if (! $request->user()) {
                    return null;
                }

                $user = $request->user();
                $unread = Notification::where('user_id', $user->id)
                    ->whereNull('read_at')
                    ->count();

                $recent = Notification::where('user_id', $user->id)
                    ->orderByDesc('created_at')
                    ->limit(10)
                    ->get()
                    ->map(function ($n) {
                        return [
                            'id' => $n->id,
                            'type' => $n->type,
                            'title' => $n->title,
                            'message' => $n->message,
                            'link' => $n->link,
                            'data' => $n->data,
                            'read_at' => $n->read_at ? $n->read_at->toIso8601String() : null,
                            'created_at' => $n->created_at ? $n->created_at->diffForHumans() : null,
                            'created_at_raw' => $n->created_at ? $n->created_at->toIso8601String() : null,
                        ];
                    });

                return [
                    'unread_count' => $unread,
                    'list' => $recent,
                ];
            },
            'company' => fn () => Setting::getPublicMap(),
            'navCategories' => fn () => Category::where('status', 'active')->whereNull('parent_id')->with('children:id,name,slug,parent_id')->orderBy('name')->get(['id', 'name', 'slug']),
        ];
    }
}
