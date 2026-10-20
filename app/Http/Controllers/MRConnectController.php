<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\TourPlan;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MRConnectController extends Controller
{
    /**
     * 1. EMPLOYEE ASSIGN
     * MR only sees their own assigned profile, territory, and reporting manager.
     * Admin can view all representatives.
     */
    public function employeeAssign(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = User::where('role', 'mr');
        if (! $isAdmin) {
            $query->where('id', $user->id);
        }

        $reps = $query->with(['latestLocation'])->get()->map(function ($u, $idx) use ($user) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'reg_code' => 'MRC'.(1000 + $u->id),
                'role_title' => $u->role === 'mr' ? 'Medical Representative' : 'ABM',
                'headquarters' => 'Nagercoil Hub #'.(($u->id % 4) + 1),
                'territory' => 'Kanyakumari / Tamil Nadu',
                'assigned_doctors_count' => (int) Doctor::where('user_id', $u->id)->count(),
                'reporting_manager' => 'Kesavan T (Area Business Manager)',
                'joining_date' => '01/04/2024',
                'status' => 'active',
                'is_self' => $u->id === $user->id,
            ];
        });

        return Inertia::render('mrconnect/EmployeeAssign', [
            'representatives' => $reps,
            'isIndividualMR' => ! $isAdmin,
        ]);
    }

    /**
     * 2. TOUR PLAN
     * MR only sees their own tour plans.
     * Admin sees all tour plans and can approve/reject.
     */
    public function tourPlan(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = TourPlan::with('user:id,name,email')->latest('id');
        if (! $isAdmin) {
            $query->where('user_id', $user->id);
        }

        $tourPlans = $query->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'user_name' => $p->user ? $p->user->name : 'Representative',
                'user_id' => $p->user_id,
                'type' => $p->type,
                'month' => $p->month,
                'year' => $p->year,
                'days_count' => $p->days_count,
                'planned_visits' => $p->planned_visits,
                'visited_count' => $p->visited_count,
                'status' => $p->status,
                'notes' => $p->notes,
                'admin_feedback' => $p->admin_feedback,
                'created_at' => $p->created_at?->format('d M Y'),
            ];
        });

        return Inertia::render('mrconnect/TourPlan', [
            'tourPlans' => $tourPlans,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Store Tour Plan (Submitted by MR)
     */
    public function storeTourPlan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'month' => ['required', 'string', 'max:20'],
            'year' => ['required', 'integer', 'min:2024', 'max:2030'],
            'type' => ['required', 'string', 'max:50'],
            'days_count' => ['required', 'integer', 'min:1', 'max:31'],
            'planned_visits' => ['required', 'integer', 'min:1', 'max:300'],
            'notes' => ['nullable', 'string'],
        ]);

        TourPlan::create([
            'user_id' => $request->user()->id,
            'month' => $validated['month'],
            'year' => $validated['year'],
            'type' => $validated['type'],
            'days_count' => $validated['days_count'],
            'planned_visits' => $validated['planned_visits'],
            'visited_count' => 0,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Monthly Tour Plan submitted for administrative review.');
    }

    /**
     * Approve Tour Plan (Admin Only)
     */
    public function approveTourPlan(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Only administrators can approve tour plans.');
        }

        TourPlan::where('id', $id)->update([
            'status' => 'approved',
            'admin_feedback' => 'Approved by Regional Administration.',
        ]);

        return back()->with('success', 'Tour plan approved.');
    }

    /**
     * Reject Tour Plan (Admin Only)
     */
    public function rejectTourPlan(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Only administrators can reject tour plans.');
        }

        TourPlan::where('id', $id)->update([
            'status' => 'rejected',
            'admin_feedback' => $request->input('reason', 'Plan requires route adjustments.'),
        ]);

        return back()->with('success', 'Tour plan rejected.');
    }

    /**
     * 3. FIELD EXPENSES
     * MR only sees their own expenses.
     */
    public function fieldExpenses(Request $request): Response
    {
        $userId = $request->user()->id;
        $isAdmin = $request->user()->isAdmin();

        $query = DB::table('field_expenses')
            ->join('users', 'field_expenses.user_id', '=', 'users.id')
            ->select('field_expenses.*', 'users.name as user_name');

        if (! $isAdmin) {
            $query->where('field_expenses.user_id', $userId);
        }

        $expenses = $query->orderByDesc('field_expenses.date')->get();

        return Inertia::render('mrconnect/FieldExpenses', [
            'expenses' => $expenses,
            'isAdmin' => $isAdmin,
            'summary' => [
                'total_claimed' => $expenses->sum('amount'),
                'approved_amount' => $expenses->where('status', 'approved')->sum('amount'),
                'pending_amount' => $expenses->where('status', 'pending')->sum('amount'),
            ],
        ]);
    }

    /**
     * Store Expense Claim
     */
    public function storeExpense(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'expense_type' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:1'],
            'distance_km' => ['nullable', 'numeric'],
            'city' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
        ]);

        DB::table('field_expenses')->insert([
            'user_id' => $request->user()->id,
            'date' => $validated['date'],
            'expense_type' => $validated['expense_type'],
            'amount' => $validated['amount'],
            'distance_km' => $validated['distance_km'] ?? null,
            'city' => $validated['city'] ?? 'Headquarters',
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Field expense claim submitted successfully for review.');
    }

    /**
     * Approve Expense Claim (Admin Only)
     */
    public function approveExpense(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Only administrators can approve field expenses.');
        }

        DB::table('field_expenses')->where('id', $id)->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Expense claim approved.');
    }

    /**
     * 4. LEAVE MANAGEMENT
     * MR only sees their own leaves and balance.
     */
    public function leave(Request $request): Response
    {
        $userId = $request->user()->id;
        $isAdmin = $request->user()->isAdmin();

        $query = DB::table('leaves')
            ->join('users', 'leaves.user_id', '=', 'users.id')
            ->select('leaves.*', 'users.name as user_name');

        if (! $isAdmin) {
            $query->where('leaves.user_id', $userId);
        }

        $leaves = $query->orderByDesc('leaves.from_date')->get();

        return Inertia::render('mrconnect/Leave', [
            'leaves' => $leaves,
            'isAdmin' => $isAdmin,
            'balances' => [
                'casual_leave' => 8,
                'sick_leave' => 6,
                'earned_leave' => 12,
                'pending_requests' => $leaves->where('status', 'pending')->count(),
            ],
        ]);
    }

    /**
     * Store Leave Request
     */
    public function storeLeave(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'leave_type' => ['required', 'string'],
            'from_date' => ['required', 'date'],
            'to_date' => ['required', 'date', 'after_or_equal:from_date'],
            'reason' => ['required', 'string'],
        ]);

        $days = (int) Carbon::parse($validated['from_date'])->diffInDays(Carbon::parse($validated['to_date'])) + 1;

        DB::table('leaves')->insert([
            'user_id' => $request->user()->id,
            'leave_type' => $validated['leave_type'],
            'from_date' => $validated['from_date'],
            'to_date' => $validated['to_date'],
            'days_count' => $days,
            'reason' => $validated['reason'],
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Leave request submitted to administration.');
    }

    /**
     * Approve Leave Request (Admin Only)
     */
    public function approveLeave(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Only administrators can approve leaves.');
        }

        DB::table('leaves')->where('id', $id)->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Leave request approved.');
    }

    /**
     * 5. PRIMARY SALES
     * Filtered for MR's territory.
     */
    public function primarySales(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = DB::table('primary_sales');
        if (! $isAdmin) {
            $mrTerritories = Doctor::where('user_id', $user->id)
                ->whereNotNull('territory')
                ->pluck('territory')
                ->filter()
                ->unique()
                ->values()
                ->all();

            if (! empty($mrTerritories)) {
                $query->where(function ($q) use ($mrTerritories) {
                    foreach ($mrTerritories as $territory) {
                        $q->orWhere('territory', 'like', "%{$territory}%");
                    }
                });
            }
        }

        $sales = $query->orderByDesc('invoice_date')->get();

        return Inertia::render('mrconnect/PrimarySales', [
            'sales' => $sales,
            'isAdmin' => $isAdmin,
            'summary' => [
                'total_primary' => $sales->sum('amount'),
                'paid_amount' => $sales->where('status', 'paid')->sum('amount'),
                'pending_amount' => $sales->where('status', 'pending')->sum('amount'),
            ],
        ]);
    }

    /**
     * 6. POB ORDER (Personal Order Booking)
     * MR only sees their own POB orders.
     */
    public function pobOrder(Request $request): Response
    {
        $userId = $request->user()->id;
        $isAdmin = $request->user()->isAdmin();

        $query = DB::table('pob_orders')
            ->join('users', 'pob_orders.user_id', '=', 'users.id')
            ->select('pob_orders.*', 'users.name as representative_name');

        if (! $isAdmin) {
            $query->where('pob_orders.user_id', $userId);
        }

        $orders = $query->orderByDesc('pob_orders.created_at')->get();

        // Scope doctors dropdown strictly to the authenticated MR
        $doctorsQuery = Doctor::active();
        if (! $isAdmin) {
            $doctorsQuery->where('user_id', $userId);
        }
        $doctors = $doctorsQuery->get(['id', 'name', 'clinic_hospital_name']);

        return Inertia::render('mrconnect/PobOrder', [
            'orders' => $orders,
            'doctors' => $doctors,
            'isAdmin' => $isAdmin,
            'summary' => [
                'total_orders' => $orders->count(),
                'total_value' => $orders->sum('total_amount'),
                'verified_orders' => $orders->where('status', 'verified')->count(),
            ],
        ]);
    }

    /**
     * Store POB Order
     */
    public function storePobOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'chemist_name' => ['required', 'string', 'max:150'],
            'doctor_id' => ['nullable', 'exists:doctors,id'],
            'total_amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        $orderNo = 'POB-'.date('Y').'-'.rand(1000, 9999);

        DB::table('pob_orders')->insert([
            'user_id' => $request->user()->id,
            'doctor_id' => $validated['doctor_id'] ?? null,
            'order_no' => $orderNo,
            'chemist_name' => $validated['chemist_name'],
            'total_amount' => $validated['total_amount'],
            'items_count' => rand(2, 6),
            'notes' => $validated['notes'] ?? 'Order booked during clinic visit',
            'status' => 'submitted',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', "Personal Order {$orderNo} booked successfully!");
    }

    /**
     * 7. TARGET VS SALES
     * MR only sees their own sales targets and achievement.
     */
    public function setTarget(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = DB::table('sales_targets')
            ->join('users', 'sales_targets.user_id', '=', 'users.id')
            ->select('sales_targets.*', 'users.name as employee_name');

        if (! $isAdmin) {
            $query->where('sales_targets.user_id', $user->id);
        }

        $targets = $query->orderByDesc('year')->orderByDesc('id')->get();

        return Inertia::render('mrconnect/SetTarget', [
            'targets' => $targets,
            'isAdmin' => $isAdmin,
            'summary' => [
                'total_target' => $targets->sum('target_amount'),
                'total_achieved' => $targets->sum('achieved_amount'),
                'overall_percentage' => $targets->sum('target_amount') > 0
                    ? round(($targets->sum('achieved_amount') / $targets->sum('target_amount')) * 100, 1)
                    : 0,
            ],
        ]);
    }

    /**
     * 8. MEDIA: VIDEO LIBRARY
     */
    public function videoLibrary(): Response
    {
        $videos = [
            [
                'id' => 1,
                'title' => 'Factocel-IX Mechanism of Action (Factor IX Coagulation Cascade)',
                'category' => 'Hematology Animation',
                'duration' => '03:45',
                'thumbnail' => '/images/box_factocel_ix.jpg',
                'views' => 1240,
                'description' => 'Scientific 3D animation detailing human coagulation factor IX activation in Hemophilia B patients.',
            ],
            [
                'id' => 2,
                'title' => 'Globucel-SC Subcutaneous Administration Clinical Protocol',
                'category' => 'Immunology Video',
                'duration' => '05:12',
                'thumbnail' => '/images/box_globucel_sc.jpg',
                'views' => 890,
                'description' => 'Doctor training video on rapid subcutaneous infusion protocols and bioavailability profile.',
            ],
            [
                'id' => 3,
                'title' => 'Fibrogen-I in Acute Hemorrhage & Surgical Hemostasis',
                'category' => 'Critical Care',
                'duration' => '04:20',
                'thumbnail' => '/images/box_fibrogen_i.jpg',
                'views' => 640,
                'description' => 'Clinical evidence presentation demonstrating rapid clot firmness recovery with concentrated fibrinogen.',
            ],
        ];

        return Inertia::render('mrconnect/VideoLibrary', [
            'videos' => $videos,
        ]);
    }

    /**
     * 9. MEDIA: SLIDER
     */
    public function slider(): Response
    {
        $slides = [
            [
                'id' => 1,
                'title' => 'Ciplon Corporate Heritage Slide #1',
                'type' => 'Corporate Branding',
                'image' => '/images/ciplon_logo.png',
                'status' => 'active',
                'order' => 1,
            ],
            [
                'id' => 2,
                'title' => 'Factocel-IX High Potency Hematology Slide',
                'type' => 'Product Promotional',
                'image' => '/images/box_factocel_ix.jpg',
                'status' => 'active',
                'order' => 2,
            ],
            [
                'id' => 3,
                'title' => 'Globucel-SC Primary Immunodeficiency Slide',
                'type' => 'Product Promotional',
                'image' => '/images/box_globucel_sc.jpg',
                'status' => 'active',
                'order' => 3,
            ],
        ];

        return Inertia::render('mrconnect/Slider', [
            'slides' => $slides,
        ]);
    }

    /**
     * 10. ALERT: NOTICE / ANNOUNCEMENT
     */
    public function notice(): Response
    {
        $notices = DB::table('notices')
            ->leftJoin('users', 'notices.published_by', '=', 'users.id')
            ->select('notices.*', 'users.name as publisher_name')
            ->orderByDesc('notices.published_at')
            ->get();

        return Inertia::render('mrconnect/Notice', [
            'notices' => $notices,
        ]);
    }

    /**
     * 11. SPONSORSHIP: SPONSOR
     * MR only sees their own sponsorships.
     */
    public function sponsor(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = DB::table('sponsorships')
            ->leftJoin('doctors', 'sponsorships.doctor_id', '=', 'doctors.id')
            ->leftJoin('users', 'sponsorships.user_id', '=', 'users.id')
            ->select('sponsorships.*', 'doctors.name as doctor_name', 'users.name as representative_name');

        if (! $isAdmin) {
            $query->where('sponsorships.user_id', $user->id);
        }

        $sponsorships = $query->orderByDesc('sponsorships.created_at')->get();

        return Inertia::render('mrconnect/Sponsor', [
            'sponsorships' => $sponsorships,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * 12. SPONSORSHIP: SCHEME
     */
    public function scheme(): Response
    {
        $schemes = DB::table('schemes')->orderByDesc('valid_until')->get();

        return Inertia::render('mrconnect/Scheme', [
            'schemes' => $schemes,
        ]);
    }

    /**
     * 13. HR SECTION
     * MR only sees their own employee profile and official HR desk coordinates.
     * Admin sees all employees.
     */
    public function hrSection(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = User::query();
        if (! $isAdmin) {
            $query->where('id', $user->id);
        }

        $employees = $query->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => strtoupper($u->role),
                'emp_id' => 'EMP-'.(1000 + $u->id),
                'department' => $u->role === 'admin' ? 'Executive Management' : 'Field Sales & Marketing',
                'status' => 'active',
                'contact' => '+91 9840'.sprintf('%06d', ($u->id * 13579) % 1000000),
            ];
        });

        return Inertia::render('mrconnect/HRSection', [
            'employees' => $employees,
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * 14. REPORTS: ALL REPORTS
     * MR only sees metrics for their own activity.
     */
    public function allReports(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        if (! $isAdmin) {
            $dcrCount = Visit::where('user_id', $user->id)->count();
            $coverageCount = Doctor::where('user_id', $user->id)->count();
            $pobCount = DB::table('pob_orders')->where('user_id', $user->id)->count();
            $tourCount = TourPlan::where('user_id', $user->id)->count();
        } else {
            $dcrCount = Visit::count();
            $coverageCount = Doctor::count();
            $pobCount = DB::table('pob_orders')->count();
            $tourCount = TourPlan::count();
        }

        return Inertia::render('mrconnect/AllReports', [
            'reports' => [
                ['id' => 'dcr', 'title' => 'Daily Call Report (DCR)', 'category' => 'Field Operations', 'records' => $dcrCount, 'desc' => 'Detailed doctor visit logs, sample distributions, and physician feedback.'],
                ['id' => 'coverage', 'title' => 'Doctor Territory Coverage Report', 'category' => 'Doctor Compliance', 'records' => $coverageCount, 'desc' => 'Monthly frequency compliance across Core, Class-A, and Class-B doctors.'],
                ['id' => 'pob', 'title' => 'POB Order Booking Analysis', 'category' => 'Sales Analytics', 'records' => $pobCount, 'desc' => 'Chemist personal order bookings and prescription conversions.'],
                ['id' => 'tour', 'title' => 'Tour Plan Compliance Report', 'category' => 'Field Operations', 'records' => $tourCount, 'desc' => 'Monthly tour schedule adherence and route deviations tracking.'],
            ],
            'isAdmin' => $isAdmin,
        ]);
    }
}
