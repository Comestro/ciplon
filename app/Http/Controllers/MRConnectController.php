<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Notification;
use App\Models\Product;
use App\Models\TourPlan;
use App\Models\User;
use App\Models\Visit;
use App\Services\ImageKitService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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
            ->join('users as reps', 'field_expenses.user_id', '=', 'reps.id')
            ->leftJoin('users as reviewers', 'field_expenses.reviewed_by', '=', 'reviewers.id')
            ->select(
                'field_expenses.*',
                'reps.name as user_name',
                'reviewers.name as reviewer_name'
            );

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
    public function storeExpense(Request $request, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'expense_type' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:1'],
            'distance_km' => ['nullable', 'numeric'],
            'city' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
            'receipt' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp,pdf', 'max:5120'],
            'receipt_url' => ['nullable', 'string', 'max:1000'],
        ]);

        $receiptUrl = $validated['receipt_url'] ?? null;
        if ($request->hasFile('receipt')) {
            try {
                $uploadData = $imageKit->upload(
                    file: $request->file('receipt'),
                    folder: '/expenses'
                );
                $receiptUrl = $uploadData['url'] ?? null;
            } catch (\Throwable $e) {
                return back()->withErrors(['receipt' => 'Failed to upload receipt to ImageKit: '.$e->getMessage()]);
            }
        }

        $expenseId = DB::table('field_expenses')->insertGetId([
            'user_id' => $request->user()->id,
            'date' => $validated['date'],
            'expense_type' => $validated['expense_type'],
            'amount' => $validated['amount'],
            'distance_km' => $validated['distance_km'] ?? null,
            'city' => $validated['city'] ?? 'Headquarters',
            'receipt_url' => $receiptUrl,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Dispatch in-app notification to all administrators
        $applicantName = $request->user()->name;
        $formattedAmount = number_format((float) $validated['amount']);
        Notification::sendToAdmins(
            type: 'expense_submitted',
            title: 'New Field Expense Claim',
            message: "{$applicantName} submitted an expense claim of ₹{$formattedAmount} for {$validated['expense_type']} ({$validated['date']}).",
            link: '/mrconnect/field-expenses',
            data: [
                'expense_id' => $expenseId,
                'mr_id' => $request->user()->id,
                'mr_name' => $applicantName,
                'expense_type' => $validated['expense_type'],
                'amount' => $validated['amount'],
            ]
        );

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

        $expense = DB::table('field_expenses')->where('id', $id)->first();
        if (! $expense) {
            abort(404, 'Field expense claim not found.');
        }

        DB::table('field_expenses')->where('id', $id)->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'updated_at' => now(),
        ]);

        // Dispatch in-app notification to the MR
        $formattedAmount = number_format((float) $expense->amount);
        Notification::sendToUser(
            userId: (int) $expense->user_id,
            type: 'expense_approved',
            title: 'Expense Claim Approved',
            message: "Your expense claim of ₹{$formattedAmount} for {$expense->expense_type} ({$expense->date}) has been approved.",
            link: '/mrconnect/field-expenses',
            data: ['expense_id' => $expense->id, 'amount' => $expense->amount]
        );

        return back()->with('success', 'Expense claim approved.');
    }

    /**
     * Reject Expense Claim (Admin Only)
     */
    public function rejectExpense(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Only administrators can reject field expenses.');
        }

        $expense = DB::table('field_expenses')->where('id', $id)->first();
        if (! $expense) {
            abort(404, 'Field expense claim not found.');
        }

        $reason = $request->input('reason', 'Claim rejected by administration.');

        DB::table('field_expenses')->where('id', $id)->update([
            'status' => 'rejected',
            'admin_feedback' => $reason,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'updated_at' => now(),
        ]);

        // Dispatch in-app notification to the MR
        $formattedAmount = number_format((float) $expense->amount);
        Notification::sendToUser(
            userId: (int) $expense->user_id,
            type: 'expense_rejected',
            title: 'Expense Claim Rejected',
            message: "Your expense claim of ₹{$formattedAmount} for {$expense->expense_type} was rejected. Reason: {$reason}",
            link: '/mrconnect/field-expenses',
            data: ['expense_id' => $expense->id, 'amount' => $expense->amount, 'reason' => $reason]
        );

        return back()->with('success', 'Expense claim rejected.');
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
            ->join('users as reps', 'leaves.user_id', '=', 'reps.id')
            ->leftJoin('users as reviewers', 'leaves.reviewed_by', '=', 'reviewers.id')
            ->select(
                'leaves.*',
                'reps.name as user_name',
                'reviewers.name as reviewer_name'
            );

        if (! $isAdmin) {
            $query->where('leaves.user_id', $userId);
        }

        $leaves = $query->orderByDesc('leaves.from_date')->get();

        return Inertia::render('mrconnect/Leave', [
            'leaves' => $leaves,
            'isAdmin' => $isAdmin,
            'stats' => [
                'total' => $leaves->count(),
                'pending' => $leaves->where('status', 'pending')->count(),
                'approved' => $leaves->where('status', 'approved')->count(),
                'rejected' => $leaves->where('status', 'rejected')->count(),
                'total_days_approved' => (int) $leaves->where('status', 'approved')->sum('days_count'),
            ],
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

        $leaveId = DB::table('leaves')->insertGetId([
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

        // Dispatch in-app notification to all administrators
        $applicantName = $request->user()->name;
        $periodStr = $days > 1
            ? "{$days} days: ".Carbon::parse($validated['from_date'])->format('d M').' to '.Carbon::parse($validated['to_date'])->format('d M Y')
            : '1 day: '.Carbon::parse($validated['from_date'])->format('d M Y');

        Notification::sendToAdmins(
            type: 'leave_applied',
            title: 'New Leave Request',
            message: "{$applicantName} applied for {$validated['leave_type']} ({$periodStr}). Reason: {$validated['reason']}",
            link: '/mrconnect/leave',
            data: [
                'leave_id' => $leaveId,
                'mr_id' => $request->user()->id,
                'mr_name' => $applicantName,
                'leave_type' => $validated['leave_type'],
            ]
        );

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

        $leave = DB::table('leaves')->where('id', $id)->first();
        if (! $leave) {
            abort(404, 'Leave request not found.');
        }

        DB::table('leaves')->where('id', $id)->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'updated_at' => now(),
        ]);

        // Dispatch in-app notification to the MR
        Notification::sendToUser(
            userId: (int) $leave->user_id,
            type: 'leave_approved',
            title: 'Leave Request Approved',
            message: "Your {$leave->leave_type} request ({$leave->from_date} to {$leave->to_date}) has been approved by administration.",
            link: '/mrconnect/leave',
            data: ['leave_id' => $leave->id]
        );

        return back()->with('success', 'Leave request approved.');
    }

    /**
     * Reject Leave Request (Admin Only)
     */
    public function rejectLeave(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Only administrators can reject leave requests.');
        }

        $leave = DB::table('leaves')->where('id', $id)->first();
        if (! $leave) {
            abort(404, 'Leave request not found.');
        }

        $feedback = $request->input('reason', $request->input('admin_feedback', 'Application rejected by administration.'));

        DB::table('leaves')->where('id', $id)->update([
            'status' => 'rejected',
            'admin_feedback' => $feedback,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'updated_at' => now(),
        ]);

        // Dispatch in-app notification to the MR
        Notification::sendToUser(
            userId: (int) $leave->user_id,
            type: 'leave_rejected',
            title: 'Leave Request Rejected',
            message: "Your {$leave->leave_type} request ({$leave->from_date} to {$leave->to_date}) was rejected. Reason: {$feedback}",
            link: '/mrconnect/leave',
            data: ['leave_id' => $leave->id, 'feedback' => $feedback]
        );

        return back()->with('success', 'Leave request rejected.');
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
     * MR only sees their own POB orders; Admin sees orders from all representatives.
     */
    public function pobOrder(Request $request): Response
    {
        $userId = $request->user()->id;
        $isAdmin = $request->user()->isAdmin();

        $query = DB::table('pob_orders')
            ->join('users', 'pob_orders.user_id', '=', 'users.id')
            ->leftJoin('doctors', 'pob_orders.doctor_id', '=', 'doctors.id')
            ->select(
                'pob_orders.*',
                'users.name as representative_name',
                'doctors.name as doctor_name',
                'doctors.clinic_hospital_name'
            );

        if (! $isAdmin) {
            $query->where('pob_orders.user_id', $userId);
        }

        $orders = $query->orderByDesc('pob_orders.created_at')->get()->map(function ($ord) {
            $ord->items = is_string($ord->items_json)
                ? json_decode($ord->items_json, true)
                : ($ord->items_json ?? []);

            return $ord;
        });

        // Scope doctors dropdown strictly to the authenticated MR (or all if admin)
        $doctorsQuery = Doctor::active();
        if (! $isAdmin) {
            $doctorsQuery->where('user_id', $userId);
        }
        $doctors = $doctorsQuery->get(['id', 'name', 'clinic_hospital_name']);

        // Active company products for itemized booking
        $products = Product::where('status', 'active')
            ->select('id', 'brand_name', 'generic_name', 'product_code', 'dosage_form', 'strength')
            ->orderBy('brand_name')
            ->get();

        return Inertia::render('mrconnect/PobOrder', [
            'orders' => $orders,
            'doctors' => $doctors,
            'products' => $products,
            'isAdmin' => $isAdmin,
            'summary' => [
                'total_orders' => $orders->count(),
                'total_value' => (float) $orders->sum('total_amount'),
                'verified_orders' => $orders->where('status', 'verified')->count(),
                'pending_orders' => $orders->where('status', 'submitted')->count(),
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
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['nullable', 'array', 'min:1'],
            'items.*.product_name' => ['required_with:items', 'string', 'max:150'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
            'items.*.unit_price' => ['required_with:items', 'numeric', 'min:0.01'],
            'total_amount' => ['nullable', 'numeric', 'min:1'],
        ]);

        $sanitizedItems = [];
        $totalAmount = 0;

        if (! empty($validated['items'])) {
            foreach ($validated['items'] as $item) {
                $qty = (int) $item['quantity'];
                $price = (float) $item['unit_price'];
                $subtotal = round($qty * $price, 2);
                $totalAmount += $subtotal;

                $sanitizedItems[] = [
                    'product_id' => $item['product_id'] ?? null,
                    'product_name' => trim($item['product_name']),
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'subtotal' => $subtotal,
                ];
            }
        } else {
            $totalAmount = (float) ($validated['total_amount'] ?? 0);
        }

        $orderNo = 'POB-'.date('Y').'-'.rand(1000, 9999);

        DB::table('pob_orders')->insert([
            'user_id' => $request->user()->id,
            'doctor_id' => $validated['doctor_id'] ?? null,
            'order_no' => $orderNo,
            'chemist_name' => $validated['chemist_name'],
            'total_amount' => $totalAmount,
            'items_count' => count($sanitizedItems) > 0 ? count($sanitizedItems) : 1,
            'items_json' => ! empty($sanitizedItems) ? json_encode($sanitizedItems) : null,
            'notes' => $validated['notes'] ?? 'Order booked during chemist visit',
            'status' => 'submitted',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', "Personal Order {$orderNo} booked successfully!");
    }

    /**
     * Update POB Order Status (Admin action)
     */
    public function updatePobStatus(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:submitted,verified,dispatched,delivered'],
        ]);

        $order = DB::table('pob_orders')->where('id', $id)->first();
        if (! $order) {
            abort(404, 'POB Order not found.');
        }

        DB::table('pob_orders')->where('id', $id)->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        // Auto-sync MR's sales target for this month upon verification / dispatch
        try {
            $orderDate = Carbon::parse($order->created_at);
            $monthName = $orderDate->format('F');
            $yearNum = (int) $orderDate->format('Y');

            $pobSum = (float) DB::table('pob_orders')
                ->where('user_id', $order->user_id)
                ->whereIn('status', ['verified', 'dispatched', 'delivered'])
                ->whereBetween('created_at', [$orderDate->copy()->startOfMonth(), $orderDate->copy()->endOfMonth()])
                ->sum('total_amount');

            $target = DB::table('sales_targets')
                ->where('user_id', $order->user_id)
                ->where('month', $monthName)
                ->where('year', $yearNum)
                ->first();

            if ($target) {
                $newAchieved = max((float) $target->achieved_amount, $pobSum);
                DB::table('sales_targets')->where('id', $target->id)->update([
                    'achieved_amount' => $newAchieved,
                    'updated_at' => now(),
                ]);
            }
        } catch (\Throwable $e) {
        }

        return back()->with('success', "POB Order {$order->order_no} status updated to ".ucfirst($validated['status']).'!');
    }

    /**
     * 7. TARGET VS SALES
     * MR only sees their own sales targets and achievement; Admin can assign and manage quotas.
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

        $targets = $query->orderByDesc('year')->orderByDesc('id')->get()->map(function ($tgt) {
            try {
                $startDate = Carbon::parse("1 {$tgt->month} {$tgt->year}")->startOfMonth();
                $endDate = Carbon::parse("1 {$tgt->month} {$tgt->year}")->endOfMonth();

                $pobAchieved = (float) DB::table('pob_orders')
                    ->where('user_id', $tgt->user_id)
                    ->whereIn('status', ['verified', 'dispatched', 'delivered'])
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount');

                $effectiveAchieved = max((float) $tgt->achieved_amount, $pobAchieved);
                $tgt->achieved_amount = $effectiveAchieved;
                $tgt->pob_achieved = $pobAchieved;

                // Sync with database if POB orders increased achievement
                if ($effectiveAchieved > 0) {
                    DB::table('sales_targets')->where('id', $tgt->id)->update([
                        'achieved_amount' => $effectiveAchieved,
                    ]);
                }
            } catch (\Throwable $e) {
                $tgt->pob_achieved = 0;
            }

            return $tgt;
        });

        $representatives = $isAdmin
            ? User::where('role', 'mr')->select('id', 'name', 'email')->orderBy('name')->get()
            : [];

        $totalTarget = (float) $targets->sum('target_amount');
        $totalAchieved = (float) $targets->sum('achieved_amount');
        $overallPercentage = $totalTarget > 0 ? min(100, round(($totalAchieved / $totalTarget) * 100, 1)) : 0;

        return Inertia::render('mrconnect/SetTarget', [
            'targets' => $targets,
            'representatives' => $representatives,
            'isAdmin' => $isAdmin,
            'summary' => [
                'total_target' => $totalTarget,
                'total_achieved' => $totalAchieved,
                'overall_percentage' => $overallPercentage,
            ],
        ]);
    }

    /**
     * Store new Sales Target (Admin only)
     */
    public function storeTarget(Request $request): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'month' => ['required', 'string', 'max:20'],
            'year' => ['required', 'integer', 'min:2020', 'max:2035'],
            'target_amount' => ['required', 'numeric', 'min:1'],
            'achieved_amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $rep = User::find($validated['user_id']);

        $existing = DB::table('sales_targets')
            ->where('user_id', $validated['user_id'])
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->first();

        if ($existing) {
            DB::table('sales_targets')->where('id', $existing->id)->update([
                'target_amount' => $validated['target_amount'],
                'achieved_amount' => $validated['achieved_amount'] ?? $existing->achieved_amount,
                'notes' => $validated['notes'] ?? $existing->notes,
                'updated_at' => now(),
            ]);

            return back()->with('success', "Target for {$rep->name} ({$validated['month']} {$validated['year']}) updated successfully!");
        }

        DB::table('sales_targets')->insert([
            'user_id' => $validated['user_id'],
            'month' => $validated['month'],
            'year' => $validated['year'],
            'target_amount' => $validated['target_amount'],
            'achieved_amount' => $validated['achieved_amount'] ?? 0,
            'notes' => $validated['notes'] ?? 'Monthly sales quota',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', "Sales target assigned to {$rep->name} successfully!");
    }

    /**
     * Update Sales Target / Achieved volume (Admin only)
     */
    public function updateTarget(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'target_amount' => ['required', 'numeric', 'min:1'],
            'achieved_amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $target = DB::table('sales_targets')->where('id', $id)->first();
        if (! $target) {
            abort(404, 'Target record not found.');
        }

        DB::table('sales_targets')->where('id', $id)->update([
            'target_amount' => $validated['target_amount'],
            'achieved_amount' => $validated['achieved_amount'] ?? $target->achieved_amount,
            'notes' => $validated['notes'] ?? $target->notes,
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Sales target updated successfully!');
    }

    /**
     * Delete Sales Target (Admin only)
     */
    public function destroyTarget(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $target = DB::table('sales_targets')->where('id', $id)->first();
        if (! $target) {
            abort(404, 'Target record not found.');
        }

        DB::table('sales_targets')->where('id', $id)->delete();

        return back()->with('success', 'Sales target deleted successfully!');
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
                'title' => 'Ciplon Corporate Heritage & Portfolio Overview',
                'type' => 'Corporate Branding',
                'image' => '/images/ciplon_logo.png',
                'status' => 'active',
                'order' => 1,
            ],
            [
                'id' => 2,
                'title' => 'WHO-GMP Certified Facility — Walpar Wellness (Mfg. for Sun Pharma, Cipla, Alkem, Torrent)',
                'type' => 'Facility & Quality Standards',
                'image' => '/images/walpar_logo.png',
                'status' => 'active',
                'order' => 2,
            ],
            [
                'id' => 3,
                'title' => 'Pure & Cure Healthcare (Subsidiary of Akums Drugs & Pharmaceuticals Ltd.) — Baddi Unit',
                'type' => 'CDMO Manufacturing Partner',
                'image' => '/images/akums_logo.png',
                'status' => 'active',
                'order' => 3,
            ],
            [
                'id' => 4,
                'title' => 'CIPLOMAX CD3 — Neurotrophic & Metabolic Tablet',
                'type' => 'Product Promotional',
                'image' => '/images/diplomax_cd3.jpg',
                'status' => 'active',
                'order' => 4,
            ],
            [
                'id' => 5,
                'title' => 'DICLOTRYP-FORT — Proteolytic Anti-Inflammatory Tablets',
                'type' => 'Product Promotional',
                'image' => '/images/diclotryp_fort.png',
                'status' => 'active',
                'order' => 5,
            ],
            [
                'id' => 6,
                'title' => 'CIPLON-D — Esomeprazole & Domperidone SR Capsules',
                'type' => 'Product Promotional',
                'image' => '/images/ciplon_d.png',
                'status' => 'active',
                'order' => 6,
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
            ->orderByDesc('notices.created_at')
            ->get();

        return Inertia::render('mrconnect/Notice', [
            'notices' => $notices,
        ]);
    }

    /**
     * Store a new notice or official announcement (Admin only).
     */
    public function storeNotice(Request $request): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action. Administrator credentials required to publish circulars.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'content' => ['required', 'string'],
        ]);

        $title = ucfirst(trim($validated['title']));
        $content = ucfirst(trim($validated['content']));

        $noticeId = DB::table('notices')->insertGetId([
            'title' => $title,
            'content' => $content,
            'published_by' => $request->user()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Notification::broadcastToAll(
            type: 'notice',
            title: 'Official Announcement: '.$title,
            message: Str::limit($content, 120),
            link: '/mrconnect/notice',
            data: [
                'notice_id' => $noticeId,
            ],
            exceptUserId: $request->user()->id
        );

        return back()->with('success', 'Official announcement published successfully.');
    }

    /**
     * Delete an announcement (Admin only).
     */
    public function destroyNotice(Request $request, int $id): RedirectResponse
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $notice = DB::table('notices')->where('id', $id)->first();
        if (! $notice) {
            abort(404, 'Notice not found.');
        }

        DB::table('notices')->where('id', $id)->delete();

        return back()->with('success', 'Announcement deleted successfully.');
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
     * 13. MR DIRECTORY (Admin Only)
     * Lists all Medical Representatives with their doctor coverage, visits, and tracking data.
     */
    public function mrDirectory(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized access. The MR Directory is reserved for administrators.');
        }

        $mrs = User::where('role', 'mr')
            ->with(['latestLocation'])
            ->withCount(['doctors', 'visits'])
            ->orderBy('name')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'emp_code' => 'MR-'.str_pad($u->id, 4, '0', STR_PAD_LEFT),
                    'doctors_count' => $u->doctors_count,
                    'visits_count' => $u->visits_count,
                    'latest_location' => $u->latestLocation ? [
                        'latitude' => $u->latestLocation->latitude,
                        'longitude' => $u->latestLocation->longitude,
                        'address' => $u->latestLocation->address,
                        'updated_at' => $u->latestLocation->updated_at?->diffForHumans(),
                    ] : null,
                    'created_at' => $u->created_at?->format('d M Y'),
                    'status' => 'active',
                ];
            });

        return Inertia::render('mrconnect/MRDirectory', [
            'mrs' => $mrs,
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
