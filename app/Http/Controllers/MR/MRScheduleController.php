<?php

namespace App\Http\Controllers\MR;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\MRSchedule;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MRScheduleController extends Controller
{
    /**
     * Display the MR's Call & Visit schedule planner.
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $today = Carbon::today()->toDateString();

        $tab = $request->query('tab', 'today'); // today, upcoming, history, all
        $actionFilter = $request->query('action_type', 'all'); // all, visit, call
        $statusFilter = $request->query('status', 'all'); // all, pending, completed, missed
        $search = trim($request->query('search', ''));

        $query = MRSchedule::where('user_id', $userId)
            ->with(['doctor:id,name,specialization,clinic_hospital_name,phone,city,tier,visiting_hours']);

        // Apply Tab Filter
        if ($tab === 'today') {
            $query->whereDate('scheduled_date', $today);
        } elseif ($tab === 'upcoming') {
            $query->whereDate('scheduled_date', '>', $today);
        } elseif ($tab === 'history') {
            $query->whereDate('scheduled_date', '<', $today);
        }

        // Action Type Filter
        if ($actionFilter !== 'all') {
            $query->where('action_type', $actionFilter);
        }

        // Status Filter
        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        // Search Filter
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('purpose', 'like', "%{$search}%")
                    ->orWhere('custom_contact_name', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('doctor', function ($dq) use ($search) {
                        $dq->where('name', 'like', "%{$search}%")
                            ->orWhere('clinic_hospital_name', 'like', "%{$search}%")
                            ->orWhere('specialization', 'like', "%{$search}%");
                    });
            });
        }

        // Ordering: pending first, then by scheduled date
        $schedules = $query->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->orderBy('scheduled_date', $tab === 'history' ? 'desc' : 'asc')
            ->orderBy('id', 'asc')
            ->get();

        // Calculate Today's Performance Metrics
        $todayAll = MRSchedule::where('user_id', $userId)
            ->whereDate('scheduled_date', $today)
            ->get();

        $todayTotal = $todayAll->count();
        $todayCompleted = $todayAll->where('status', 'completed')->count();
        $todayPending = $todayAll->where('status', 'pending')->count();
        $todayVisits = $todayAll->where('action_type', 'visit')->count();
        $todayCalls = $todayAll->where('action_type', 'call')->count();

        $metrics = [
            'today_total' => $todayTotal,
            'today_completed' => $todayCompleted,
            'today_pending' => $todayPending,
            'today_visits' => $todayVisits,
            'today_calls' => $todayCalls,
            'completion_rate' => $todayTotal > 0 ? (int) round(($todayCompleted / $todayTotal) * 100) : 0,
            'upcoming_count' => MRSchedule::where('user_id', $userId)->whereDate('scheduled_date', '>', $today)->count(),
        ];

        // Load active doctors list for the schedule modal
        $doctors = Doctor::where('user_id', $userId)
            ->where('status', 'active')
            ->select('id', 'name', 'specialization', 'clinic_hospital_name', 'phone', 'visiting_hours', 'tier')
            ->orderBy('name')
            ->get();

        // Load active products list for quick purpose tags
        $products = Product::where('status', 'active')
            ->select('id', 'brand_name', 'dosage_form')
            ->orderBy('brand_name')
            ->get();

        return Inertia::render('mr/Schedule', [
            'schedules' => $schedules,
            'metrics' => $metrics,
            'doctors' => $doctors,
            'products' => $products,
            'todayDate' => $today,
            'filters' => [
                'tab' => $tab,
                'action_type' => $actionFilter,
                'status' => $statusFilter,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a new planned call or visit.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'doctor_id' => ['nullable', 'exists:doctors,id'],
            'custom_contact_name' => ['nullable', 'string', 'max:255'],
            'contact_type' => ['required', 'string', 'in:doctor,chemist,hospital,stockist'],
            'action_type' => ['required', 'string', 'in:visit,call'],
            'scheduled_date' => ['required', 'date'],
            'priority' => ['required', 'string', 'in:high,normal,low'],
            'purpose' => ['required', 'string', 'max:500'],
            'notes' => ['nullable', 'string'],
        ]);

        if (empty($validated['doctor_id']) && empty($validated['custom_contact_name'])) {
            return redirect()->back()->withErrors([
                'doctor_id' => 'Please select a registered doctor or enter a custom contact name.',
            ]);
        }

        $request->user()->mrSchedules()->create([
            'doctor_id' => $validated['doctor_id'] ?? null,
            'custom_contact_name' => $validated['custom_contact_name'] ?? null,
            'contact_type' => $validated['contact_type'],
            'action_type' => $validated['action_type'],
            'scheduled_date' => $validated['scheduled_date'],
            'priority' => $validated['priority'],
            'purpose' => $validated['purpose'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        $label = $validated['action_type'] === 'call' ? 'Call' : 'Visit';

        return redirect()->back()->with('success', "{$label} scheduled successfully.");
    }

    /**
     * Mark a scheduled item as completed (visited / called) or missed.
     */
    public function updateStatus(Request $request, MRSchedule $schedule): RedirectResponse
    {
        if ($schedule->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,completed,missed,rescheduled'],
            'outcome_note' => ['nullable', 'string', 'max:1000'],
            'new_date' => ['nullable', 'date'],
        ]);

        $updates = [
            'status' => $validated['status'],
            'outcome_note' => $validated['outcome_note'] ?? $schedule->outcome_note,
        ];

        if ($validated['status'] === 'completed') {
            $updates['completed_at'] = now();
        } elseif ($validated['status'] === 'pending') {
            $updates['completed_at'] = null;
        } elseif ($validated['status'] === 'rescheduled' && ! empty($validated['new_date'])) {
            $updates['scheduled_date'] = $validated['new_date'];
            $updates['status'] = 'pending';
        }

        $schedule->update($updates);

        $actionWord = $schedule->action_type === 'call' ? 'Call' : 'Visit';
        $statusMsg = $validated['status'] === 'completed'
            ? "Marked {$actionWord} as completed."
            : "Status updated to {$validated['status']}.";

        return redirect()->back()->with('success', $statusMsg);
    }

    /**
     * Delete a scheduled call or visit.
     */
    public function destroy(Request $request, MRSchedule $schedule): RedirectResponse
    {
        if ($schedule->user_id !== $request->user()->id) {
            abort(403);
        }

        $schedule->delete();

        return redirect()->back()->with('success', 'Scheduled item removed.');
    }
}
