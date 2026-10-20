<?php

namespace App\Http\Controllers\MR;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MRDoctorController extends Controller
{
    // Render the MR Doctors list view.
    public function show(Request $request): Response
    {
        return Inertia::render('mr/Doctors', [
            'initialFilters' => [
                'search' => $request->query('search', ''),
                'specialization' => $request->query('specialization', 'all'),
                'tier' => $request->query('tier', 'all'),
                'territory' => $request->query('territory', 'all'),
            ],
        ]);
    }

    /**
     * Render the dedicated Create Doctor page.
     */
    public function create(): Response
    {
        return Inertia::render('mr/DoctorForm', [
            'mode' => 'create',
        ]);
    }

    // Render the dedicated Edit Doctor page.
    public function edit(Request $request, int $id): Response
    {
        // Ensure doctor exists and belongs to authenticated MR
        Doctor::forUser($request->user()->id)->findOrFail($id);

        return Inertia::render('mr/DoctorForm', [
            'mode' => 'edit',
            'doctorId' => $id,
        ]);
    }

    // API: List doctors belonging to the authenticated MR with filters.
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $query = Doctor::forUser($userId)
            ->search($request->query('search'))
            ->bySpecialization($request->query('specialization'))
            ->byTier($request->query('tier'))
            ->byTerritory($request->query('territory'));

        if ($request->query('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        $sortField = $request->query('sort_by', 'name');
        $sortOrder = $request->query('sort_order', 'asc');
        $allowedSorts = ['name', 'specialization', 'tier', 'target_frequency_per_month', 'created_at'];

        if (in_array($sortField, $allowedSorts, true)) {
            $query->orderBy($sortField, $sortOrder === 'desc' ? 'desc' : 'asc');
        } else {
            $query->orderBy('name', 'asc');
        }

        $doctors = $query->get();

        // Calculate metadata & metrics across all active doctors for this MR
        $allUserDoctors = Doctor::forUser($userId)->get();

        $meta = [
            'total' => $allUserDoctors->count(),
            'active_count' => $allUserDoctors->where('status', 'active')->count(),
            'core_count' => $allUserDoctors->where('tier', 'core')->count(),
            'class_a_count' => $allUserDoctors->where('tier', 'class_a')->count(),
            'class_b_count' => $allUserDoctors->where('tier', 'class_b')->count(),
            'class_c_count' => $allUserDoctors->where('tier', 'class_c')->count(),
            'total_monthly_target_visits' => (int) $allUserDoctors->where('status', 'active')->sum('target_frequency_per_month'),
            'specializations' => $allUserDoctors->pluck('specialization')->unique()->values()->all(),
            'territories' => $allUserDoctors->pluck('territory')->unique()->values()->all(),
        ];

        return response()->json([
            'success' => true,
            'data' => $doctors,
            'meta' => $meta,
        ]);
    }

    /**
     * API: Store a new doctor under the authenticated MR.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'qualification' => ['nullable', 'string', 'max:255'],
            'specialization' => ['required', 'string', 'max:255'],
            'clinic_hospital_name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'territory' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'visiting_hours' => ['nullable', 'string', 'max:255'],
            'visiting_days' => ['nullable', 'string', 'max:255'],
            'tier' => ['required', 'in:core,class_a,class_b,class_c'],
            'target_frequency_per_month' => ['required', 'integer', 'min:1', 'max:30'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = $validated['status'] ?? 'active';

        $doctor = Doctor::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Doctor successfully added to your field directory.',
            'data' => $doctor,
        ], 201);
    }

    /**
     * API: Display doctor profile details.
     */
    public function showDoctor(Request $request, int $id): JsonResponse
    {
        $doctor = Doctor::forUser($request->user()->id)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $doctor,
        ]);
    }

    /**
     * API: Update doctor profile.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $doctor = Doctor::forUser($request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'qualification' => ['nullable', 'string', 'max:255'],
            'specialization' => ['sometimes', 'required', 'string', 'max:255'],
            'clinic_hospital_name' => ['sometimes', 'required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'territory' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'visiting_hours' => ['nullable', 'string', 'max:255'],
            'visiting_days' => ['nullable', 'string', 'max:255'],
            'tier' => ['sometimes', 'required', 'in:core,class_a,class_b,class_c'],
            'target_frequency_per_month' => ['sometimes', 'required', 'integer', 'min:1', 'max:30'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'required', 'in:active,inactive'],
        ]);

        $doctor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Doctor details updated successfully.',
            'data' => $doctor->fresh(),
        ]);
    }

    /**
     * API: Delete / remove doctor from directory.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $doctor = Doctor::forUser($request->user()->id)->findOrFail($id);
        $doctor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Doctor removed from your directory successfully.',
        ]);
    }
}
