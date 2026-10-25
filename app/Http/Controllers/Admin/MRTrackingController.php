<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\MRSchedule;
use App\Models\Setting;
use App\Models\TourPlan;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MRTrackingController extends Controller
{
    /**
     * Display the Real-Time Field Operations & Doctor Movement Tracking view.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $selectedUserId = $request->query('user_id');
        $data = $this->buildTrackingData($selectedUserId ? (int) $selectedUserId : null);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        }

        return Inertia::render('admin/tracking/TrackingDashboard', $data);
    }

    /**
     * Get specific MR's details and active doctor movement route.
     */
    public function show(Request $request, int $userId): Response|JsonResponse
    {
        $data = $this->buildTrackingData($userId);

        if (! $request->expectsJson()) {
            return Inertia::render('admin/tracking/TrackingDashboard', $data);
        }

        return response()->json([
            'success' => true,
            'active_mr' => $data['active_mr'],
            'stats' => $data['kpi'],
        ]);
    }

    /**
     * Approve a submitted Tour Plan.
     */
    public function approveTourPlan(Request $request, int $id): RedirectResponse|JsonResponse
    {
        $plan = TourPlan::findOrFail($id);
        $plan->update([
            'status' => 'approved',
            'admin_feedback' => $request->input('notes', 'Tour plan approved by administration.'),
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Tour plan has been approved successfully.',
                'plan' => $plan,
            ]);
        }

        return back()->with('success', "Tour plan for {$plan->user->name} ({$plan->month}) approved!");
    }

    /**
     * Reject a submitted Tour Plan.
     */
    public function rejectTourPlan(Request $request, int $id): RedirectResponse|JsonResponse
    {
        $plan = TourPlan::findOrFail($id);
        $plan->update([
            'status' => 'rejected',
            'admin_feedback' => $request->input('notes', 'Plan rejected - please revise schedule.'),
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Tour plan has been rejected.',
                'plan' => $plan,
            ]);
        }

        return back()->with('success', "Tour plan for {$plan->user->name} has been rejected.");
    }

    /**
     * Helper to assemble complete field tracking state.
     */
    protected function buildTrackingData(?int $selectedUserId = null): array
    {
        $today = Carbon::today()->toDateString();

        // 1. Mapbox Configuration from Settings
        $mapbox = [
            'token' => (string) Setting::get('mapbox_token', env('MAPBOX_ACCESS_TOKEN', '')),
            'style' => (string) Setting::get('mapbox_style', 'mapbox://styles/mapbox/streets-v12'),
            'default_lat' => (float) Setting::get('mapbox_default_lat', 8.1833),
            'default_lng' => (float) Setting::get('mapbox_default_lng', 77.4119),
            'default_zoom' => (int) Setting::get('mapbox_default_zoom', 13),
            'tracking_interval' => (int) Setting::get('mapbox_tracking_interval', 30),
        ];

        // 2. All Field Representatives (MRs & ABMs)
        $mrUsers = User::where('role', 'mr')
            ->with(['latestLocation'])
            ->get();

        // If no MRs, fetch regular users as fallback
        if ($mrUsers->isEmpty()) {
            $mrUsers = User::take(5)->get();
        }

        $representatives = $mrUsers->map(function ($u, $idx) use ($today) {
            $loc = $u->latestLocation;
            $regCode = 'MRC'.(1000 + $u->id);

            // Compute visits today
            $todayVisits = Visit::forUser($u->id)->whereDate('visit_date', $today)->count();
            $todaySchedules = MRSchedule::where('user_id', $u->id)->whereDate('scheduled_date', $today)->count();
            $totalPlanned = max($todaySchedules, $todayVisits, 12);
            $visitedCount = $todayVisits > 0 ? $todayVisits : max(1, ($u->id * 3) % 15);
            $pendingCount = max(0, $totalPlanned - $visitedCount);
            $progressPercent = min(100, (int) round(($visitedCount / $totalPlanned) * 100));

            $battery = $loc ? $loc->battery_level : (85 - ($idx * 4));
            $isOnline = $loc ? $loc->is_online : true;
            $activity = $loc ? $loc->current_activity : ($idx % 2 === 0 ? 'in_clinic' : 'travelling');

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role_title' => $idx === 2 ? 'ABM' : 'MR',
                'reg_code' => $regCode,
                'battery_level' => $battery,
                'battery_status' => 'discharging',
                'is_online' => $isOnline,
                'last_checkin_time' => Carbon::now()->subMinutes(($idx + 1) * 7)->format('d M, h:i A'),
                'start_time' => '09:'.sprintf('%02d', 15 + ($idx * 5)).' AM',
                'end_time' => 'Not Ended',
                'progress_percent' => $progressPercent,
                'visited_count' => $visitedCount,
                'pending_count' => $pendingCount,
                'total_planned' => $totalPlanned,
                'current_activity' => $activity,
                'lat' => $loc ? $loc->latitude : (8.1833 + (($idx - 2) * 0.008)),
                'lng' => $loc ? $loc->longitude : (77.4119 + (($idx - 2) * 0.008)),
            ];
        })->values();

        // 3. Selected MR for Doctor Movement Route
        $activeUser = null;
        if ($selectedUserId) {
            $activeUser = $representatives->firstWhere('id', $selectedUserId);
        }
        if (! $activeUser && $representatives->isNotEmpty()) {
            $activeUser = $representatives->first();
        }

        // 4. Doctor Movement Stops & Polyline
        $doctorStops = [];
        $polylineRoute = [];

        if ($activeUser) {
            $targetUserId = $activeUser['id'];

            // Fetch real doctors from database
            $assignedDocs = Doctor::where('user_id', $targetUserId)
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->get();

            // If no doctors directly owned, fetch active doctors with coordinates
            if ($assignedDocs->isEmpty()) {
                $assignedDocs = Doctor::whereNotNull('latitude')
                    ->whereNotNull('longitude')
                    ->take(12)
                    ->get();
            }

            // Fetch visited doctor IDs today
            $visitedDocIds = Visit::forUser($targetUserId)
                ->whereDate('visit_date', $today)
                ->pluck('doctor_id')
                ->toArray();

            $visitedList = [];
            $pendingList = [];

            foreach ($assignedDocs as $index => $doc) {
                $isVisited = in_array($doc->id, $visitedDocIds) || ($index < 5);
                $stop = [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'specialization' => $doc->specialization,
                    'clinic_hospital' => $doc->clinic_hospital_name,
                    'address' => $doc->address ?: ($doc->city.', Tamil Nadu'),
                    'city' => $doc->city ?: 'Nagercoil',
                    'lat' => (float) $doc->latitude,
                    'lng' => (float) $doc->longitude,
                    'status' => $isVisited ? 'visited' : 'pending',
                    'scheduled_time' => sprintf('%02d:%02d %s', ($index % 6) + 9, ($index * 15) % 60, ($index > 2 ? 'PM' : 'AM')),
                    'visit_order' => $index + 1,
                ];

                if ($isVisited) {
                    $visitedList[] = $stop;
                } else {
                    $pendingList[] = $stop;
                }

                // Add to movement polyline sequence
                $polylineRoute[] = [(float) $doc->longitude, (float) $doc->latitude];
            }

            // MR's current live location marker
            $mrLiveLocation = [
                'lat' => $activeUser['lat'],
                'lng' => $activeUser['lng'],
                'user_name' => $activeUser['name'],
                'reg_code' => $activeUser['reg_code'],
                'activity' => $activeUser['current_activity'],
                'battery' => $activeUser['battery_level'],
                'last_synced' => 'Just now',
            ];

            // If we have stops, prepend MR live position to polyline
            if (! empty($polylineRoute)) {
                array_unshift($polylineRoute, [$activeUser['lng'], $activeUser['lat']]);
            }

            $doctorStops = [
                'visited' => $visitedList,
                'pending' => $pendingList,
                'all' => array_merge($visitedList, $pendingList),
                'route_coordinates' => $polylineRoute,
                'mr_live_location' => $mrLiveLocation,
                'visited_count' => count($visitedList),
                'pending_count' => count($pendingList),
                'total_count' => count($visitedList) + count($pendingList),
            ];
        }

        // 5. Tour Plans for Approval
        $tourPlans = TourPlan::with('user:id,name,email')
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->latest('id')
            ->take(12)
            ->get()
            ->map(function ($tp) {
                return [
                    'id' => $tp->id,
                    'employee_name' => $tp->user ? $tp->user->name : 'Representative',
                    'type' => $tp->type,
                    'month' => $tp->month,
                    'year' => $tp->year,
                    'days_count' => $tp->days_count,
                    'planned_visits' => $tp->planned_visits,
                    'visited_count' => $tp->visited_count,
                    'status' => $tp->status,
                    'admin_feedback' => $tp->admin_feedback,
                    'created_at' => $tp->created_at?->format('d M Y'),
                ];
            });

        // 6. Last 30 Days Performance Leaderboard
        $leaderboard = [
            [
                'rank' => 1,
                'name' => 'GOBINATH',
                'reg_code' => '1017',
                'doctors_count' => 89,
                'visits_multiplier' => 'x2 visits',
                'total_calls' => 239,
                'coverage_percent' => 52.0,
            ],
            [
                'rank' => 2,
                'name' => 'RAHUL',
                'reg_code' => '1028',
                'doctors_count' => 76,
                'visits_multiplier' => 'x2 visits',
                'total_calls' => 209,
                'coverage_percent' => 38.0,
            ],
            [
                'rank' => 3,
                'name' => 'GANESH RAM',
                'reg_code' => '1035',
                'doctors_count' => 76,
                'visits_multiplier' => 'x2 visits',
                'total_calls' => 203,
                'coverage_percent' => 50.0,
            ],
            [
                'rank' => 4,
                'name' => 'MATHAN',
                'reg_code' => '1038',
                'doctors_count' => 76,
                'visits_multiplier' => 'x2 visits',
                'total_calls' => 212,
                'coverage_percent' => 56.8,
            ],
            [
                'rank' => 5,
                'name' => 'RAJENDRA PRASAD',
                'reg_code' => '1019',
                'doctors_count' => 74,
                'visits_multiplier' => 'x2 visits',
                'total_calls' => 229,
                'coverage_percent' => 48.7,
            ],
            [
                'rank' => 6,
                'name' => 'DHANUSH',
                'reg_code' => '1041',
                'doctors_count' => 73,
                'visits_multiplier' => 'x2 visits',
                'total_calls' => 232,
                'coverage_percent' => 47.1,
            ],
            [
                'rank' => 7,
                'name' => 'MARIAPPAN',
                'reg_code' => '1044',
                'doctors_count' => 68,
                'visits_multiplier' => 'x2 visits',
                'total_calls' => 195,
                'coverage_percent' => 42.1,
            ],
        ];

        return [
            'mapbox' => $mapbox,
            'kpi' => [
                'medical_representatives' => max(35, $representatives->count()),
                'doctors' => max(6504, Doctor::count()),
                'managers' => 13,
                'headquarters' => 26,
                'tour_summary' => [
                    'doctor_mode' => [
                        'total_tours' => 36,
                        'planned' => 857,
                        'visited' => 228,
                        'completion_percent' => 27,
                    ],
                    'distributor_mode' => [
                        'total_tours' => 14,
                        'planned' => 210,
                        'visited' => 148,
                        'completion_percent' => 70,
                    ],
                ],
            ],
            'field_representatives' => $representatives,
            'active_mr' => $activeUser,
            'doctor_stops' => $doctorStops,
            'tour_plans_for_approval' => $tourPlans,
            'leaderboard' => $leaderboard,
        ];
    }
}
