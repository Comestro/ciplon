<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    // Seed the application database with administrator credentials and settings.
    public function run(): void
    {
        // 1. Roles and Permissions
        $this->call(RoleAndPermissionSeeder::class);

        // Primary Administrator Account
        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('123456789'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('super_admin');

        // Demo Medical Representative (MR) Account
        $mr = User::updateOrCreate(
            ['email' => 'mr@ciplon.com'],
            [
                'name' => 'Rajesh Sharma',
                'password' => Hash::make('123456789'),
                'role' => 'mr',
                'email_verified_at' => now(),
            ]
        );
        $mr->assignRole('mr');

        // Secondary / Test Administrator Account
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('123456789'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // Seed Company Profile, Catalog, Doctors & Visits
        $this->call([
            SettingSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            DoctorSeeder::class,
            VisitSeeder::class,
        ]);
    }
}
