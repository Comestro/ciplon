<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    // Display paginated staff list with search and role filter
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $roleFilter = $request->input('role');

        $staff = User::query()
            ->with('roles:id,name')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($roleFilter, function ($query, $roleFilter) {
                $query->whereHas('roles', function ($q) use ($roleFilter) {
                    $q->where('name', $roleFilter);
                });
            })
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        $roles = Role::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/staff/StaffList', [
            'staff' => $staff,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
            ],
            'roles' => $roles,
        ]);
    }

    // Display form to add a new staff member
    public function create(): Response
    {
        $roles = Role::where('name', '!=', 'super_admin')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/staff/StaffForm', [
            'isEdit' => false,
            'roles' => $roles,
        ]);
    }

    // Store a newly created staff member in database
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validated['role'] === 'super_admin') {
            return back()->withErrors(['role' => 'There can only be one Super Administrator. You can create an Administrator instead.'])->withInput();
        }

        $user = User::create([
            'name' => ucwords(trim($validated['name'])),
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('admin.staff.index')->with('success', 'Staff member created successfully.');
    }

    // Display form to edit staff member and change role
    public function edit(Request $request, User $staff): Response|RedirectResponse
    {
        if ($staff->isSuperAdmin() && ! $request->user()->isSuperAdmin()) {
            return redirect()->route('admin.staff.index')->with('error', 'Only the Super Administrator can modify the master account.');
        }

        $roles = $staff->isSuperAdmin()
            ? Role::orderBy('name')->get(['id', 'name'])
            : Role::where('name', '!=', 'super_admin')->orderBy('name')->get(['id', 'name']);
        $currentRole = $staff->roles()->first()?->name ?? $staff->role;

        return Inertia::render('admin/staff/StaffForm', [
            'isEdit' => true,
            'staff' => [
                'id' => $staff->id,
                'name' => ucwords($staff->name),
                'email' => $staff->email,
                'role' => $currentRole,
            ],
            'roles' => $roles,
        ]);
    }

    // Update staff profile, credentials and assigned role
    public function update(Request $request, User $staff): RedirectResponse
    {
        if ($staff->isSuperAdmin() && ! $request->user()->isSuperAdmin()) {
            return back()->with('error', 'Only the Super Administrator can modify the master account.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($staff->id)],
            'role' => ['required', 'string', 'exists:roles,name'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if ($validated['role'] === 'super_admin' && ! $staff->isSuperAdmin()) {
            return back()->withErrors(['role' => 'There can only be one Super Administrator.'])->withInput();
        }

        $updateData = [
            'name' => ucwords(trim($validated['name'])),
            'email' => $validated['email'],
            'role' => $staff->isSuperAdmin() ? 'super_admin' : $validated['role'],
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $staff->update($updateData);
        $staff->syncRoles([$staff->isSuperAdmin() ? 'super_admin' : $validated['role']]);

        return redirect()->route('admin.staff.index')->with('success', 'Staff details updated successfully.');
    }

    // Remove staff member from system
    public function destroy(Request $request, User $staff): RedirectResponse
    {
        if ($staff->isSuperAdmin() || $staff->role === 'super_admin' || $staff->hasRole('super_admin') || $staff->id === 1) {
            return back()->with('error', 'The Super Administrator account is protected and cannot be deleted.');
        }

        if ($staff->id === $request->user()?->id) {
            return back()->with('error', 'You cannot delete your own administrative account.');
        }

        $staff->delete();

        return redirect()->route('admin.staff.index')->with('success', 'Staff member removed successfully.');
    }
}
