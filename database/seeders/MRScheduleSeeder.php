<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\MRSchedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MRScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $mr = User::where('role', 'mr')->first();
        if (! $mr) {
            $this->command->error('No MR user found.');

            return;
        }

        $today = Carbon::today()->toDateString();
        $tomorrow = Carbon::tomorrow()->toDateString();
        $yesterday = Carbon::yesterday()->toDateString();

        $doctors = Doctor::where('user_id', $mr->id)->get();
        if ($doctors->count() < 4) {
            $this->command->error('Not enough doctors.');

            return;
        }

        // Clear existing
        MRSchedule::where('user_id', $mr->id)->delete();

        $items = [
            // Today 1: In-person Visit - Completed
            [
                'user_id' => $mr->id,
                'doctor_id' => $doctors[0]->id,
                'custom_contact_name' => null,
                'contact_type' => 'doctor',
                'action_type' => 'visit',
                'scheduled_date' => $today,
                'scheduled_time' => 'Morning OPD (10:30 AM)',
                'priority' => 'high',
                'purpose' => 'Detailing Ciplox 500 & Ciplocef; pitch for acute respiratory infections',
                'notes' => 'Carry visual aid booklet and 10 trial sample strips',
                'status' => 'completed',
                'completed_at' => Carbon::now()->subHours(2),
                'outcome_note' => 'Visited clinic & completed product detailing. Doctor committed to trial on 5+ patients. Requested 10 sample strips.',
            ],
            // Today 2: Phone Call - Completed
            [
                'user_id' => $mr->id,
                'doctor_id' => $doctors[1]->id,
                'custom_contact_name' => null,
                'contact_type' => 'doctor',
                'action_type' => 'call',
                'scheduled_date' => $today,
                'scheduled_time' => '12:15 PM',
                'priority' => 'high',
                'purpose' => 'Telephonic follow-up on Rosucipl trial patient tolerance feedback',
                'notes' => 'Call between OPD shifts',
                'status' => 'completed',
                'completed_at' => Carbon::now()->subMinutes(45),
                'outcome_note' => 'Spoke with Doctor - Positive response. Confirmed excellent tolerance and promised prescriptions for upcoming month.',
            ],
            // Today 3: In-person Visit - Pending
            [
                'user_id' => $mr->id,
                'doctor_id' => $doctors[2]->id,
                'custom_contact_name' => null,
                'contact_type' => 'doctor',
                'action_type' => 'visit',
                'scheduled_date' => $today,
                'scheduled_time' => 'Evening OPD (05:30 PM)',
                'priority' => 'high',
                'purpose' => 'Detailing Glycicip Trio (Metformin + Glimepiride + Voglibose); hand over starter kits',
                'notes' => 'Discuss new HbA1c control clinical trial data',
                'status' => 'pending',
                'completed_at' => null,
                'outcome_note' => null,
            ],
            // Today 4: Phone Call - Pending (Chemist stock check)
            [
                'user_id' => $mr->id,
                'doctor_id' => null,
                'custom_contact_name' => 'Apollo Pharmacy (Opp. Civil Hospital)',
                'contact_type' => 'chemist',
                'action_type' => 'call',
                'scheduled_date' => $today,
                'scheduled_time' => '03:45 PM',
                'priority' => 'normal',
                'purpose' => 'Stock inquiry & verification of Ciplox Eye Drops and Azicip 500 availability',
                'notes' => 'Contact: Mr. Suresh (Purchase Manager)',
                'status' => 'pending',
                'completed_at' => null,
                'outcome_note' => null,
            ],
            // Upcoming 1: Tomorrow Clinic Visit
            [
                'user_id' => $mr->id,
                'doctor_id' => $doctors[3]->id,
                'custom_contact_name' => null,
                'contact_type' => 'doctor',
                'action_type' => 'visit',
                'scheduled_date' => $tomorrow,
                'scheduled_time' => 'Morning OPD (11:00 AM)',
                'priority' => 'high',
                'purpose' => 'Detailing Orthocip-D pain management roll-on & tablets',
                'notes' => 'Target orthopedic surgery pre/post-op pain regimens',
                'status' => 'pending',
                'completed_at' => null,
                'outcome_note' => null,
            ],
            // Past 1: Yesterday Clinic Visit - Completed
            [
                'user_id' => $mr->id,
                'doctor_id' => $doctors[0]->id,
                'custom_contact_name' => null,
                'contact_type' => 'doctor',
                'action_type' => 'visit',
                'scheduled_date' => $yesterday,
                'scheduled_time' => '04:00 PM',
                'priority' => 'normal',
                'purpose' => 'Routine monthly coverage and brochure distribution',
                'notes' => null,
                'status' => 'completed',
                'completed_at' => Carbon::yesterday()->setTime(16, 30),
                'outcome_note' => 'Handed over samples & clinical visual aid shown. Dr agreed to recommend.',
            ],
        ];

        foreach ($items as $data) {
            MRSchedule::create($data);
        }

        $this->command->info('Seeded '.count($items).' MR schedules.');
    }
}
