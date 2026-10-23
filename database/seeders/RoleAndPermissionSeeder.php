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

            // Field Operations / Medical Representative (MR)
            'dcr.view',
            'dcr.create',
            'samples.request',
            'doctors.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Create Roles
        // Super Admin (all permissions)
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->syncPermissions(Permission::all());

        // Administrator (all permissions)
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

        // Area / Regulatory Manager
        $manager = Role::firstOrCreate(['name' => 'manager']);
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
            'dcr.view',
            'doctors.view',
        ]);

        // Medical Representative (MR)
        $mr = Role::firstOrCreate(['name' => 'mr']);
        $mr->syncPermissions([
            'products.view',
            'categories.view',
            'dcr.view',
            'dcr.create',
            'samples.request',
            'doctors.view',
        ]);

        // 3. Assign super_admin role to any existing admin users in database
        $adminUsers = User::where('role', 'admin')->get();
        foreach ($adminUsers as $admin) {
            if (! $admin->hasRole('super_admin')) {
                $admin->assignRole('super_admin');
            }
        }
    }
}
