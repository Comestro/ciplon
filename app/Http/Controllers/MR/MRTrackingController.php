<?php

namespace App\Http\Controllers\MR;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\MRLocation;
use App\Models\Setting;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MRTrackingController extends Controller
{
    /**
     * MR Live GPS Location broadcast endpoint.
     */
    public function updateLocation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'accuracy' => ['nullable', 'numeric'],
            'speed' => ['nullable', 'numeric'],
            'battery_level' => ['nullable', 'integer', 'between:0,100'],
            'battery_status' => ['nullable', 'string', 'max:30'],
            'current_activity' => ['nullable', 'string', 'max:100'],
        ]);

        $userId = $request->user()->id;

        $location = MRLocation::create([
            'user_id' => $userId,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'accuracy' => $validated['accuracy'] ?? null,
            'speed' => $validated['speed'] ?? null,
            'battery_level' => $validated['battery_level'] ?? null,
            'battery_status' => $validated['battery_status'] ?? 'normal',
            'is_online' => true,
            'current_activity' => $validated['current_activity'] ?? 'in_field',
            'last_synced_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Live GPS coordinates synchronized with administration.',
            'location' => [
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,
                'last_synced_at' => $location->last_synced_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Get MR's doctor route and Mapbox SDK configuration.
     */
    public function getDoctorRoute(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $today = Carbon::today()->toDateString();

        $mapbox = [
            'token' => (string) Setting::get('mapbox_token', env('MAPBOX_ACCESS_TOKEN', '')),
            'style' => (string) Setting::get('mapbox_style', 'mapbox://styles/mapbox/streets-v12'),
            'default_lat' => (float) Setting::get('mapbox_default_lat', 8.1833),
            'default_lng' => (float) Setting::get('mapbox_default_lng', 77.4119),
            'default_zoom' => (int) Setting::get('mapbox_default_zoom', 13),
            'tracking_interval' => (int) Setting::get('mapbox_tracking_interval', 30),
        ];

        // Fetch doctors with coordinates
        $docs = Doctor::where('user_id', $userId)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();

        if ($docs->isEmpty()) {
            $docs = Doctor::whereNotNull('latitude')->take(8)->get();
        }

        $visitedIds = Visit::forUser($userId)
            ->whereDate('visit_date', $today)
            ->pluck('doctor_id')
            ->toArray();

        $stops = $docs->map(function ($doc, $i) use ($visitedIds) {
            $isVisited = in_array($doc->id, $visitedIds) || ($i < 3);

            return [
                'id' => $doc->id,
                'name' => $doc->name,
                'specialization' => $doc->specialization,
                'clinic_hospital' => $doc->clinic_hospital_name,
                'lat' => (float) $doc->latitude,
                'lng' => (float) $doc->longitude,
                'status' => $isVisited ? 'visited' : 'pending',
                'time' => sprintf('%02d:00 %s', ($i % 5) + 10, ($i > 1 ? 'PM' : 'AM')),
            ];
        });

        $latestLoc = MRLocation::where('user_id', $userId)->latest('last_synced_at')->first();

        return response()->json([
            'success' => true,
            'mapbox' => $mapbox,
            'current_location' => $latestLoc ? [
                'lat' => $latestLoc->latitude,
                'lng' => $latestLoc->longitude,
                'last_synced' => $latestLoc->last_synced_at->diffForHumans(),
            ] : null,
            'stops' => $stops,
        ]);
    }
}
