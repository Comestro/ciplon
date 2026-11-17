<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\RoleAndPermissionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('role and permission seeder grants all permissions to super_admin and admin roles', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $totalPermissions = Permission::count();
    expect($totalPermissions)->toBeGreaterThan(0);

    $superAdminRole = Role::findByName('super_admin', 'web');
    $adminRole = Role::findByName('admin', 'web');

    expect($superAdminRole->permissions)->toHaveCount($totalPermissions);
    expect($adminRole->permissions)->toHaveCount($totalPermissions);
});

test('role and permission seeder assigns matching roles to existing users', function () {
    $superAdminUser = User::factory()->create(['role' => 'super_admin']);
    $adminUser = User::factory()->create(['role' => 'admin']);
    $managerUser = User::factory()->create(['role' => 'manager']);
    $mrUser = User::factory()->create(['role' => 'mr']);

    $this->seed(RoleAndPermissionSeeder::class);

    $totalPermissions = Permission::count();

    expect($superAdminUser->fresh()->hasRole('super_admin'))->toBeTrue();
    expect($superAdminUser->fresh()->getAllPermissions())->toHaveCount($totalPermissions);

    expect($adminUser->fresh()->hasRole('admin'))->toBeTrue();
    expect($adminUser->fresh()->getAllPermissions())->toHaveCount($totalPermissions);

    expect($managerUser->fresh()->hasRole('manager'))->toBeTrue();
    expect($mrUser->fresh()->hasRole('mr'))->toBeTrue();
});

test('database seeder grants all permissions to seeded administrator account', function () {
    $this->seed(DatabaseSeeder::class);

    $admin = User::where('email', 'admin@gmail.com')->first();
    $totalPermissions = Permission::count();

    expect($admin)->not->toBeNull();
    expect($admin->hasRole('super_admin'))->toBeTrue();
    expect($admin->getAllPermissions())->toHaveCount($totalPermissions);
});
