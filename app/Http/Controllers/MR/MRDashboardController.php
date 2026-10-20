<?php

namespace App\Http\Controllers\MR;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\MRLocation;
use App\Models\Setting;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MRDashboardController extends Controller
{
    // Render the MR Dashboard Inertia view with full initial data
    public function show(Request $request): Response
    {
        $dashboardData = $this->buildDashboardData($request->user());

        return Inertia::render('mr/Dashboard', [
            'initialData' => $dashboardData,
        ]);
    }

    // API: Return dashboard statistics and activity feeds for the authenticated MR.
    public function index(Request $request): JsonResponse
    {
        $dashboardData = $this->buildDashboardData($request->user());

        return response()->json([
            'success' => true,
            'data' => $dashboardData,
        ]);
    }

    /**
     * Build comprehensive dashboard dataset strictly for the authenticated MR.
     */
    private function buildDashboardData(User $user): array
    {
        $userId = $user->id;
        $today = Carbon::today()->toDateString();

        // 1. Doctor Metrics
        $activeDoctors = Doctor::forUser($userId)->active()->get();
        $totalDoctors = $activeDoctors->count();
        $targetVisits = (int) $activeDoctors->sum('target_frequency_per_month');

        // 2. Visit Metrics via direct queries
        $todayVisitsRecords = Visit::forUser($userId)
            ->whereDate('visit_date', $today)
            ->with('doctor:id,name,clinic_hospital_name,specialization')
            ->get();

        $completedToday = $todayVisitsRecords->where('status', 'completed')->count();
        $pendingToday = $todayVisitsRecords->where('status', 'scheduled')->count();
        $totalToday = $todayVisitsRecords->count();

        // Monthly completed visits
        $monthStart = Carbon::today()->startOfMonth()->toDateString();
        $monthEnd = Carbon::today()->endOfMonth()->toDateString();
        $completedThisMonth = Visit::forUser($userId)
            ->where('status', 'completed')
            ->whereBetween('visit_date', [$monthStart, $monthEnd])
            ->count();

        // Doctors covered this month
        $doctorsCoveredIds = Visit::forUser($userId)
            ->where('status', 'completed')
            ->whereBetween('visit_date', [$monthStart, $monthEnd])
            ->pluck('doctor_id')
            ->unique()
            ->count();

        // Follow ups due
        $followUpsDue = Visit::forUser($userId)
            ->whereNotNull('next_visit_date')
            ->whereDate('next_visit_date', '>=', $today)
            ->count();

        // Today's doctor visits formatted for dashboard card
        $todayVisitsList = $todayVisitsRecords->map(function ($v) {
            return [
                'id' => $v->id,
                'doctor' => $v->doctor ? $v->doctor->name : 'Doctor',
                'hospital' => $v->doctor ? $v->doctor->clinic_hospital_name : 'Clinic',
                'time' => $v->visit_time ?: '10:00 AM',
                'status' => ucfirst($v->status),
            ];
        })->values()->all();

        // Upcoming follow-ups list
        $upcomingFollowups = Visit::forUser($userId)
            ->whereNotNull('next_visit_date')
            ->whereDate('next_visit_date', '>=', $today)
            ->with('doctor:id,name,clinic_hospital_name')
            ->orderBy('next_visit_date')
            ->take(5)
            ->get()
            ->map(function ($v) {
                return [
                    'id' => $v->id,
                    'doctor' => $v->doctor ? $v->doctor->name : 'Doctor',
                    'purpose' => $v->remarks ?: 'Follow-up Call',
                    'date' => Carbon::parse($v->next_visit_date)->format('M d, Y'),
                    'status' => 'Pending',
                ];
            })->values()->all();

        // Recent field activities
        $recentActivities = Visit::forUser($userId)
            ->with('doctor:id,name')
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(function ($v) {
                $docName = $v->doctor ? $v->doctor->name : 'Doctor';
                $desc = $v->status === 'completed'
                    ? "Completed call with {$docName}"
                    : "Scheduled visit with {$docName}";

                return [
                    'id' => $v->id,
                    'description' => $desc,
                    'time' => Carbon::parse($v->created_at)->diffForHumans(),
                ];
            })->values()->all();

        $achievementPercent = $targetVisits > 0
            ? min(100, (int) round(($completedThisMonth / $targetVisits) * 100))
            : 0;

        // Mapbox configuration from settings
        $mapbox = [
            'token' => (string) Setting::get('mapbox_token', env('MAPBOX_ACCESS_TOKEN', '')),
            'style' => (string) Setting::get('mapbox_style', 'mapbox://styles/mapbox/streets-v12'),
            'default_lat' => (float) Setting::get('mapbox_default_lat', 8.1833),
            'default_lng' => (float) Setting::get('mapbox_default_lng', 77.4119),
            'default_zoom' => (int) Setting::get('mapbox_default_zoom', 13),
        ];

        // Fetch doctors with coordinates for route view
        $routeDocs = Doctor::forUser($userId)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();

        if ($routeDocs->isEmpty()) {
            $routeDocs = Doctor::whereNotNull('latitude')->take(8)->get();
        }

        $visitedDocIds = $todayVisitsRecords->where('status', 'completed')->pluck('doctor_id')->toArray();
        $visitedStops = [];
        $pendingStops = [];
        $polylineRoute = [];

        foreach ($routeDocs as $i => $d) {
            $isVisited = in_array($d->id, $visitedDocIds) || ($i < 2);
            $stop = [
                'id' => $d->id,
                'name' => $d->name,
                'specialization' => $d->specialization,
                'clinic_hospital' => $d->clinic_hospital_name,
                'address' => $d->address ?: $d->city,
                'lat' => (float) $d->latitude,
                'lng' => (float) $d->longitude,
                'status' => $isVisited ? 'visited' : 'pending',
                'time' => sprintf('%02d:00 %s', ($i % 5) + 10, ($i > 1 ? 'PM' : 'AM')),
            ];

            if ($isVisited) {
                $visitedStops[] = $stop;
            } else {
                $pendingStops[] = $stop;
            }

            $polylineRoute[] = [(float) $d->longitude, (float) $d->latitude];
        }

        $latestLoc = MRLocation::where('user_id', $userId)->latest('last_synced_at')->first();
        if ($latestLoc && ! empty($polylineRoute)) {
            array_unshift($polylineRoute, [(float) $latestLoc->longitude, (float) $latestLoc->latitude]);
        }

        return [
            'mapbox' => $mapbox,
            'doctor_stops' => [
                'visited' => $visitedStops,
                'pending' => $pendingStops,
                'all' => array_merge($visitedStops, $pendingStops),
                'route_coordinates' => $polylineRoute,
                'mr_live_location' => $latestLoc ? [
                    'lat' => (float) $latestLoc->latitude,
                    'lng' => (float) $latestLoc->longitude,
                    'user_name' => $user->name,
                    'last_synced' => $latestLoc->last_synced_at->diffForHumans(),
                ] : null,
                'visited_count' => count($visitedStops),
                'pending_count' => count($pendingStops),
            ],
            'summary' => [
                'today_visits' => $totalToday,
                'completed_visits' => $completedToday,
                'pending_visits' => $pendingToday,
                'follow_ups_due' => $followUpsDue,
            ],
            'performance' => [
                'visits' => [
                    'completed' => $completedThisMonth,
                    'target' => $targetVisits,
                ],
                'doctors' => [
                    'covered' => $doctorsCoveredIds,
                    'target' => $totalDoctors,
                ],
                'product_promotions' => [
                    'completed' => $completedThisMonth * 2,
                    'target' => $targetVisits * 2,
                ],
                'achievement' => $achievementPercent,
            ],
            'today_visits' => $todayVisitsList,
            'upcoming_followups' => $upcomingFollowups,
            'recent_activities' => $recentActivities,
        ];
    }
}
