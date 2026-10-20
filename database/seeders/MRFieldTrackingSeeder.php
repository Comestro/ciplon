<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\MRLocation;
use App\Models\MRSchedule;
use App\Models\Setting;
use App\Models\TourPlan;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MRFieldTrackingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Configure Mapbox Settings in Settings table
        $mapboxSettings = [
            'mapbox_token' => [
                'value' => env('MAPBOX_ACCESS_TOKEN', ''),
                'group' => 'mapbox',
                'type' => 'string',
                'description' => 'Mapbox GL JS Public Access Token (pk.eyJ1...)',
            ],
            'mapbox_style' => [
                'value' => 'mapbox://styles/mapbox/streets-v12',
                'group' => 'mapbox',
                'type' => 'string',
                'description' => 'Default Mapbox vector tile style',
            ],
            'mapbox_default_lat' => [
                'value' => '8.1833',
                'group' => 'mapbox',
                'type' => 'string',
                'description' => 'Default latitude center for doctor route tracking map',
            ],
            'mapbox_default_lng' => [
                'value' => '77.4119',
                'group' => 'mapbox',
                'type' => 'string',
                'description' => 'Default longitude center for doctor route tracking map',
            ],
            'mapbox_default_zoom' => [
                'value' => '13',
                'group' => 'mapbox',
                'type' => 'integer',
                'description' => 'Default zoom level for route map',
            ],
            'mapbox_tracking_interval' => [
                'value' => '30',
                'group' => 'mapbox',
                'type' => 'integer',
                'description' => 'Live GPS sync interval in seconds',
            ],
        ];

        foreach ($mapboxSettings as $key => $conf) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $conf['value'],
                    'group' => $conf['group'],
                    'type' => $conf['type'],
                    'is_public' => true,
                    'description' => $conf['description'],
                ]
            );
        }

        // 2. Representatives from reference screenshot
        $reps = [
            [
                'name' => 'Padma Sreeban Jeyam',
                'email' => 'padma@ciplon.com',
                'reg' => '1026',
                'role_title' => 'MR',
                'time' => '09:58 AM',
                'start_time' => '11:48 AM',
                'end_time' => 'Not Ended',
                'progress' => 41,
                'visited' => 9,
                'pending' => 13,
                'total' => 22,
                'lat' => 8.1812,
                'lng' => 77.4128,
                'battery' => 84,
                'activity' => 'in_clinic',
            ],
            [
                'name' => 'G Anand',
                'email' => 'anand@ciplon.com',
                'reg' => '1000',
                'role_title' => 'MR',
                'time' => '03:36 PM',
                'start_time' => '09:15 AM',
                'end_time' => 'Not Ended',
                'progress' => 45,
                'visited' => 13,
                'pending' => 6,
                'total' => 19,
                'lat' => 8.1920,
                'lng' => 77.4250,
                'battery' => 72,
                'activity' => 'travelling',
            ],
            [
                'name' => 'Gobinath',
                'email' => 'gobinath@ciplon.com',
                'reg' => '1017',
                'role_title' => 'MR',
                'time' => '09:07 AM',
                'start_time' => '08:45 AM',
                'end_time' => 'Not Ended',
                'progress' => 83,
                'visited' => 21,
                'pending' => 5,
                'total' => 26,
                'lat' => 8.1750,
                'lng' => 77.4320,
                'battery' => 91,
                'activity' => 'in_clinic',
            ],
            [
                'name' => 'Kesavan T ABM',
                'email' => 'kesavan@ciplon.com',
                'reg' => '1015',
                'role_title' => 'ABM',
                'time' => '09:12 AM',
                'start_time' => '09:00 AM',
                'end_time' => 'Not Ended',
                'progress' => 82,
                'visited' => 15,
                'pending' => 3,
                'total' => 18,
                'lat' => 8.1880,
                'lng' => 77.4080,
                'battery' => 68,
                'activity' => 'travelling',
            ],
            [
                'name' => 'M. Prabakaran',
                'email' => 'prabakaran@ciplon.com',
                'reg' => '1023',
                'role_title' => 'MR',
                'time' => '10:57 AM',
                'start_time' => '10:00 AM',
                'end_time' => 'Not Ended',
                'progress' => 51,
                'visited' => 13,
                'pending' => 12,
                'total' => 25,
                'lat' => 8.1700,
                'lng' => 77.4200,
                'battery' => 78,
                'activity' => 'in_clinic',
            ],
            [
                'name' => 'Yokeshwaran',
                'email' => 'yokeshwaran@ciplon.com',
                'reg' => '1019',
                'role_title' => 'MR',
                'time' => '11:17 AM',
                'start_time' => '10:30 AM',
                'end_time' => 'Not Ended',
                'progress' => 51,
                'visited' => 11,
                'pending' => 11,
                'total' => 22,
                'lat' => 8.1650,
                'lng' => 77.4410,
                'battery' => 59,
                'activity' => 'travelling',
            ],
            [
                'name' => 'Rajendra Prasad',
                'email' => 'rajendra@ciplon.com',
                'reg' => '1019B',
                'role_title' => 'MR',
                'time' => '07:54 AM',
                'start_time' => '08:00 AM',
                'end_time' => 'Not Ended',
                'progress' => 33,
                'visited' => 5,
                'pending' => 10,
                'total' => 15,
                'lat' => 8.1840,
                'lng' => 77.3980,
                'battery' => 86,
                'activity' => 'in_clinic',
            ],
            [
                'name' => 'B. Haris',
                'email' => 'haris@ciplon.com',
                'reg' => '1027',
                'role_title' => 'MR',
                'time' => '09:42 AM',
                'start_time' => '09:15 AM',
                'end_time' => 'Not Ended',
                'progress' => 24,
                'visited' => 4,
                'pending' => 12,
                'total' => 16,
                'lat' => 8.1550,
                'lng' => 77.4100,
                'battery' => 64,
                'activity' => 'travelling',
            ],
            [
                'name' => 'Rahul',
                'email' => 'rahul@ciplon.com',
                'reg' => '1028',
                'role_title' => 'MR',
                'time' => '08:30 AM',
                'start_time' => '08:15 AM',
                'end_time' => 'Not Ended',
                'progress' => 65,
                'visited' => 15,
                'pending' => 8,
                'total' => 23,
                'lat' => 8.1950,
                'lng' => 77.4350,
                'battery' => 95,
                'activity' => 'in_clinic',
            ],
        ];

        // Ensure default demo MR exists
        $primaryMR = User::where('email', 'mr@ciplon.com')->first();
        if ($primaryMR) {
            $primaryMR->update(['name' => 'Padma Sreeban Jeyam']);
        }

        $createdUsers = [];

        foreach ($reps as $rep) {
            $user = User::updateOrCreate(
                ['email' => $rep['email']],
                [
                    'name' => $rep['name'],
                    'password' => Hash::make('123456789'),
                    'role' => 'mr',
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('mr');
            $createdUsers[$rep['name']] = $user;

            // Live location
            MRLocation::create([
                'user_id' => $user->id,
                'latitude' => $rep['lat'],
                'longitude' => $rep['lng'],
                'accuracy' => 12.5,
                'speed' => $rep['activity'] === 'travelling' ? 24.5 : 0.0,
                'battery_level' => $rep['battery'],
                'battery_status' => 'discharging',
                'is_online' => true,
                'current_activity' => $rep['activity'],
                'last_synced_at' => now()->subMinutes(rand(1, 15)),
            ]);
        }

        // 3. Doctors with realistic coordinates along the Nagercoil movement route
        $doctorStops = [
            // Visited doctor stops (Rajakkamangalam up towards Parvathipuram)
            [
                'name' => 'Dr. K. Senthil Nathan',
                'specialization' => 'Cardiology',
                'clinic_hospital_name' => 'Nagercoil Heart Institute',
                'address' => 'Main Road, Rajakkamangalam Junction',
                'city' => 'Rajakkamangalam',
                'latitude' => 8.1250,
                'longitude' => 77.3750,
                'status' => 'visited',
                'time' => '10:00 AM',
            ],
            [
                'name' => 'Dr. Meenakshi Sundaram',
                'specialization' => 'General Physician',
                'clinic_hospital_name' => 'Vembanoor Community Clinic',
                'address' => 'Near Vembanoor Lake Bridge',
                'city' => 'Vembanoor',
                'latitude' => 8.1420,
                'longitude' => 77.3880,
                'status' => 'visited',
                'time' => '10:45 AM',
            ],
            [
                'name' => 'Dr. S. Radhakrishnan',
                'specialization' => 'Orthopedics',
                'clinic_hospital_name' => 'Peramselvavilai Bone Care',
                'address' => 'Peramselvavilai Bus Stop',
                'city' => 'Nagercoil',
                'latitude' => 8.1630,
                'longitude' => 77.3980,
                'status' => 'visited',
                'time' => '11:20 AM',
            ],
            [
                'name' => 'Dr. Anitha Raman',
                'specialization' => 'Pediatrics',
                'clinic_hospital_name' => 'Asaripallam Children Hospital',
                'address' => 'Govt Medical College Road',
                'city' => 'Asaripallam',
                'latitude' => 8.1810,
                'longitude' => 77.4010,
                'status' => 'visited',
                'time' => '12:00 PM',
            ],
            [
                'name' => 'Dr. Rajesh Kumar MD',
                'specialization' => 'Diabetology & Endocrinology',
                'clinic_hospital_name' => 'Parvathipuram Diabetes Center',
                'address' => 'KP Road, Parvathipuram Junction',
                'city' => 'Parvathipuram',
                'latitude' => 8.1880,
                'longitude' => 77.4120,
                'status' => 'visited',
                'time' => '12:45 PM',
            ],
            // Pending doctor stops (around Melasurankudy, Nagercoil town, Kottar, Erulappapuram)
            [
                'name' => 'Dr. V. Chidambaram',
                'specialization' => 'Pulmonology',
                'clinic_hospital_name' => 'Nagercoil Chest Clinic',
                'address' => 'Court Road, Wadasery',
                'city' => 'Nagercoil',
                'latitude' => 8.1850,
                'longitude' => 77.4240,
                'status' => 'pending',
                'time' => '02:30 PM',
            ],
            [
                'name' => 'Dr. P. Venkatesh',
                'specialization' => 'Gastroenterology',
                'clinic_hospital_name' => 'Kottar Digestive Diseases Clinic',
                'address' => 'Kottar Main Bazaar',
                'city' => 'Kottar',
                'latitude' => 8.1760,
                'longitude' => 77.4350,
                'status' => 'pending',
                'time' => '03:15 PM',
            ],
            [
                'name' => 'Dr. Latha Murugesan',
                'specialization' => 'Obstetrics & Gynecology',
                'clinic_hospital_name' => 'Erulappapuram Maternity Care',
                'address' => 'Near Erulappapuram Temple',
                'city' => 'Erulappapuram',
                'latitude' => 8.1680,
                'longitude' => 77.4420,
                'status' => 'pending',
                'time' => '04:00 PM',
            ],
            [
                'name' => 'Dr. M. Balaji',
                'specialization' => 'Dermatology',
                'clinic_hospital_name' => 'Skin & Hair Aesthetics Centre',
                'address' => 'Melasurankudy Cross Road',
                'city' => 'Melasurankudy',
                'latitude' => 8.1580,
                'longitude' => 77.4310,
                'status' => 'pending',
                'time' => '04:45 PM',
            ],
        ];

        $targetUser = $createdUsers['Padma Sreeban Jeyam'] ?? User::where('role', 'mr')->first();

        foreach ($doctorStops as $idx => $doc) {
            $createdDoc = Doctor::updateOrCreate(
                [
                    'name' => $doc['name'],
                    'clinic_hospital_name' => $doc['clinic_hospital_name'],
                ],
                [
                    'user_id' => $targetUser->id,
                    'qualification' => 'MBBS, MD',
                    'specialization' => $doc['specialization'],
                    'address' => $doc['address'],
                    'city' => $doc['city'],
                    'territory' => 'Kanyakumari / Nagercoil',
                    'phone' => '+91 984'.rand(1000000, 9999999),
                    'email' => strtolower(str_replace([' ', '.'], '', $doc['name'])).'@example.com',
                    'visiting_hours' => '10:00 AM - 01:00 PM',
                    'visiting_days' => 'Mon, Wed, Fri',
                    'tier' => 'class_a',
                    'target_frequency_per_month' => 2,
                    'status' => 'active',
                    'latitude' => $doc['latitude'],
                    'longitude' => $doc['longitude'],
                ]
            );

            // Record schedule / visit
            if ($doc['status'] === 'visited') {
                Visit::updateOrCreate(
                    [
                        'doctor_id' => $createdDoc->id,
                        'user_id' => $targetUser->id,
                        'visit_date' => Carbon::today()->toDateString(),
                    ],
                    [
                        'visit_time' => $doc['time'],
                        'call_type' => 'routine_detailing',
                        'status' => 'completed',
                        'doctor_feedback' => 'highly_interested',
                        'remarks' => 'Detailed Factocel-IX and Globucel-SC indications with excellent physician reception.',
                        'samples_given' => 'Factocel-IX 500IU x 2 vials',
                        'created_at' => Carbon::today()->setTime(11, 0),
                    ]
                );

                MRSchedule::updateOrCreate(
                    [
                        'doctor_id' => $createdDoc->id,
                        'user_id' => $targetUser->id,
                        'scheduled_date' => Carbon::today()->toDateString(),
                    ],
                    [
                        'scheduled_time' => $doc['time'],
                        'status' => 'completed',
                        'priority' => 'high',
                        'purpose' => 'Detailing on Hematology portfolio',
                        'completed_at' => Carbon::today()->setTime(11, 0),
                    ]
                );
            } else {
                MRSchedule::updateOrCreate(
                    [
                        'doctor_id' => $createdDoc->id,
                        'user_id' => $targetUser->id,
                        'scheduled_date' => Carbon::today()->toDateString(),
                    ],
                    [
                        'scheduled_time' => $doc['time'],
                        'status' => 'pending',
                        'priority' => 'normal',
                        'purpose' => 'Follow-up on product presentation and brochure drop',
                    ]
                );
            }
        }

        // 4. Seed Tour Plans for Approval matching the screenshot table
        $approvalList = [
            ['name' => 'B MOHANASUNDARAM', 'email' => 'mohana@ciplon.com', 'month' => 'July 2026', 'year' => 2026, 'days' => 10, 'planned' => 64],
            ['name' => 'M.PRABAKARAN', 'email' => 'prabakaran@ciplon.com', 'month' => 'July 2026', 'year' => 2026, 'days' => 27, 'planned' => 140],
            ['name' => 'NAGENDRAN', 'email' => 'nagendran@ciplon.com', 'month' => 'July 2026', 'year' => 2026, 'days' => 26, 'planned' => 135],
            ['name' => 'RAHUL', 'email' => 'rahul@ciplon.com', 'month' => 'July 2026', 'year' => 2026, 'days' => 7, 'planned' => 45],
            ['name' => 'RAHUL', 'email' => 'rahul@ciplon.com', 'month' => 'June 2026', 'year' => 2026, 'days' => 1, 'planned' => 8],
            ['name' => 'SARATH', 'email' => 'sarath@ciplon.com', 'month' => 'July 2026', 'year' => 2026, 'days' => 26, 'planned' => 132],
            ['name' => 'SARATH', 'email' => 'sarath@ciplon.com', 'month' => 'June 2026', 'year' => 2026, 'days' => 2, 'planned' => 16],
        ];

        foreach ($approvalList as $item) {
            $user = User::firstOrCreate(
                ['email' => $item['email']],
                [
                    'name' => $item['name'],
                    'password' => Hash::make('123456789'),
                    'role' => 'mr',
                    'email_verified_at' => now(),
                ]
            );

            TourPlan::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'month' => $item['month'],
                    'type' => 'doctor',
                ],
                [
                    'year' => $item['year'],
                    'days_count' => $item['days'],
                    'planned_visits' => $item['planned'],
                    'visited_count' => 0,
                    'status' => 'pending',
                    'notes' => 'Comprehensive territory coverage submitted for review and approval.',
                ]
            );
        }
    }
}
