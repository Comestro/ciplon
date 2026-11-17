<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Granular Permissions
        $permissions = [
            // Products
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'products.status',

            // Categories
            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.delete',
            'categories.status',

            // Staff & Team Management
            'staff.view',
            'staff.create',
            'staff.edit',
            'staff.delete',

            // Roles & Permissions
            'roles.view',
            'roles.manage',

            // Company Settings
            'settings.view',
            'settings.edit',

            // Commercial Enquiries
            'enquiries.view',
            'enquiries.status',
            'enquiries.delete',

            // Field Operations / Medical Representative (MR)
            'dcr.view',
            'dcr.create',
            'dcr.edit',
            'dcr.delete',
            'doctors.view',
            'doctors.create',
            'doctors.edit',
            'doctors.delete',
            'samples.request',
            'tracking.view',

            // Field Expenses
            'expenses.view',
            'expenses.create',
            'expenses.approve',
            'expenses.reject',

            // Leave Management
            'leaves.view',
            'leaves.create',
            'leaves.approve',
            'leaves.reject',

            // POB Orders
            'pob.view',
            'pob.create',
            'pob.status',

            // Targets & Primary Sales
            'targets.view',
            'targets.create',
            'targets.edit',
            'targets.delete',
            'sales.view',

            // Notices & Announcements
            'notices.view',
            'notices.create',
            'notices.delete',

            // Media, Detailing & Schemes
            'detailing.view',
            'videos.view',
            'sliders.view',
            'sponsors.view',
            'schemes.view',

            // Field Force & Reports
            'directory.view',
            'reports.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $allPermissions = Permission::where('guard_name', 'web')->get();

        // 2. Create Roles & Sync Permissions
        // Super Admin (all permissions)
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions($allPermissions);

        // Administrator (all permissions)
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions($allPermissions);

        // Area / Regulatory Manager
        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager->syncPermissions([
            'products.view',
            'products.create',
            'products.edit',
            'products.status',
            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.status',
            'settings.view',
            'enquiries.view',
            'enquiries.status',
            'dcr.view',
            'doctors.view',
            'tracking.view',
            'expenses.view',
            'expenses.approve',
            'expenses.reject',
            'leaves.view',
            'leaves.approve',
            'leaves.reject',
            'pob.view',
            'pob.status',
            'targets.view',
            'targets.create',
            'targets.edit',
            'sales.view',
            'notices.view',
            'notices.create',
            'detailing.view',
            'videos.view',
            'sliders.view',
            'sponsors.view',
            'schemes.view',
            'directory.view',
            'reports.view',
        ]);

        // Medical Representative (MR)
        $mr = Role::firstOrCreate(['name' => 'mr', 'guard_name' => 'web']);
        $mr->syncPermissions([
            'products.view',
            'categories.view',
            'dcr.view',
            'dcr.create',
            'dcr.edit',
            'doctors.view',
            'doctors.create',
            'doctors.edit',
            'samples.request',
            'tracking.view',
            'expenses.view',
            'expenses.create',
            'leaves.view',
            'leaves.create',
            'pob.view',
            'pob.create',
            'targets.view',
            'sales.view',
            'notices.view',
            'detailing.view',
            'videos.view',
            'sliders.view',
            'sponsors.view',
            'schemes.view',
        ]);

        // 3. Ensure existing users have their matching Spatie role assigned
        User::where('role', 'super_admin')->each(function (User $user): void {
            if (! $user->hasRole('super_admin')) {
                $user->syncRoles(['super_admin']);
            }
        });

        User::where('role', 'admin')->each(function (User $user): void {
            if (! $user->hasAnyRole(['super_admin', 'admin'])) {
                $user->syncRoles(['admin']);
            }
        });

        User::where('role', 'manager')->each(function (User $user): void {
            if ($user->roles()->doesntExist()) {
                $user->assignRole('manager');
            }
        });

        User::where('role', 'mr')->each(function (User $user): void {
            if ($user->roles()->doesntExist()) {
                $user->assignRole('mr');
            }
        });

        // Clear cached permissions after seeding so changes take effect immediately
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
