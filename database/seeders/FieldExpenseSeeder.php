<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FieldExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mrUsers = User::where('role', 'mr')->get();
        if ($mrUsers->isEmpty()) {
            $mrUsers = User::take(2)->get();
        }

        $adminUsers = User::whereIn('role', ['admin', 'super_admin'])->get();
        $admin1 = $adminUsers->first() ?? User::first();
        $admin2 = $adminUsers->skip(1)->first() ?? $admin1;

        $sampleReceipts = [
            'fuel_1' => 'https://ik.imagekit.io/man96/expenses/Screenshot_2026-08-03_103907_1792822229_1792822229_luzTYkKIt.png',
            'hotel_1' => 'https://ik.imagekit.io/man96/expenses/hotel_residency_bill_sample.jpg',
            'cme_1' => 'https://ik.imagekit.io/man96/expenses/hospitality_cme_receipt.png',
            'fuel_2' => 'https://ik.imagekit.io/man96/expenses/indian_oil_fuel_slip.jpg',
            'courier' => 'https://ik.imagekit.io/man96/expenses/dtdc_sample_dispatch_bill.pdf',
        ];

        $records = [];

        foreach ($mrUsers as $index => $mr) {
            // 1. Travel Fuel - Approved
            $records[] = [
                'user_id' => $mr->id,
                'date' => Carbon::today()->subDays(1)->toDateString(),
                'expense_type' => 'travel_fuel',
                'amount' => 580.00,
                'distance_km' => 58.0,
                'city' => 'Nagercoil - Kanyakumari Rural',
                'receipt_url' => $sampleReceipts['fuel_1'],
                'notes' => 'Two-wheeler travel allowance @ ₹10/km for visiting 12 interior clinics.',
                'status' => 'approved',
                'admin_feedback' => null,
                'reviewed_by' => $admin1->id,
                'reviewed_at' => Carbon::now()->subHours(6),
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subHours(6),
            ];

            // 2. Daily Allowance - Approved (Flat DA, no receipt needed)
            $records[] = [
                'user_id' => $mr->id,
                'date' => Carbon::today()->subDays(2)->toDateString(),
                'expense_type' => 'daily_allowance',
                'amount' => 450.00,
                'distance_km' => 35.0,
                'city' => 'Headquarters - City Circle',
                'receipt_url' => null,
                'notes' => 'Standard field daily allowance for routine doctor detailing.',
                'status' => 'approved',
                'admin_feedback' => null,
                'reviewed_by' => $admin2->id,
                'reviewed_at' => Carbon::now()->subDays(1),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(1),
            ];

            // 3. Lodging / Hotel Stay - Pending (with bill receipt)
            $records[] = [
                'user_id' => $mr->id,
                'date' => Carbon::today()->toDateString(),
                'expense_type' => 'lodging',
                'amount' => 1450.00,
                'distance_km' => 130.0,
                'city' => 'Tirunelveli Ex-Station',
                'receipt_url' => $sampleReceipts['hotel_1'],
                'notes' => 'Overnight hotel accommodation during 2-day orthopedic camp coverage.',
                'status' => 'pending',
                'admin_feedback' => null,
                'reviewed_by' => null,
                'reviewed_at' => null,
                'created_at' => Carbon::now()->subHours(2),
                'updated_at' => Carbon::now()->subHours(2),
            ];

            // 4. Meal / CME Hospitality - Rejected with Feedback
            $records[] = [
                'user_id' => $mr->id,
                'date' => Carbon::today()->subDays(4)->toDateString(),
                'expense_type' => 'meal',
                'amount' => 920.00,
                'distance_km' => null,
                'city' => 'Madurai Medical College Road',
                'receipt_url' => $sampleReceipts['cme_1'],
                'notes' => 'Evening high tea with pediatric specialists after formulation launch.',
                'status' => 'rejected',
                'admin_feedback' => 'Prior approval required for doctor hospitality exceeding ₹500. Please obtain ASM sign-off.',
                'reviewed_by' => $admin1->id,
                'reviewed_at' => Carbon::now()->subDays(3),
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(3),
            ];

            // 5. Travel Fuel - Pending review (with slip attached)
            $records[] = [
                'user_id' => $mr->id,
                'date' => Carbon::today()->subDays(3)->toDateString(),
                'expense_type' => 'travel_fuel',
                'amount' => 740.00,
                'distance_km' => 74.0,
                'city' => 'Thuckalay / Marthandam',
                'receipt_url' => $sampleReceipts['fuel_2'],
                'notes' => 'Mileage claim for distributor visit and chemist POB follow-up.',
                'status' => 'pending',
                'admin_feedback' => null,
                'reviewed_by' => null,
                'reviewed_at' => null,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ];

            // 6. Miscellaneous / Courier - Approved (with PDF invoice)
            $records[] = [
                'user_id' => $mr->id,
                'date' => Carbon::today()->subDays(5)->toDateString(),
                'expense_type' => 'miscellaneous',
                'amount' => 260.00,
                'distance_km' => null,
                'city' => 'Chennai HQ Courier Hub',
                'receipt_url' => $sampleReceipts['courier'],
                'notes' => 'Courier charges for dispatching physician promotional samples.',
                'status' => 'approved',
                'admin_feedback' => null,
                'reviewed_by' => $admin1->id,
                'reviewed_at' => Carbon::now()->subDays(4),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(4),
            ];
        }

        foreach ($records as $record) {
            DB::table('field_expenses')->insert($record);
        }

        $this->command->info('Seeded '.count($records).' field expense claim records successfully.');
    }
}
