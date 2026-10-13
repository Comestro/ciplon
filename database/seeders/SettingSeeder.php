<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    // Seed authentic Ciplon Pharma Private Limited company and business settings.
    public function run(): void
    {
        $settings = [
            // General & Identity
            ['key' => 'company_name', 'value' => 'Ciplon Pharma Private Limited', 'group' => 'general', 'type' => 'string', 'description' => 'Brand and trade name of the pharmaceutical company'],
            ['key' => 'legal_name', 'value' => 'Ciplon Pharma Private Limited', 'group' => 'general', 'type' => 'string', 'description' => 'Full legally registered corporate entity name'],
            ['key' => 'short_name', 'value' => 'Ciplon Pharma', 'group' => 'general', 'type' => 'string', 'description' => 'Short display brand name'],
            ['key' => 'tagline', 'value' => 'Committed to Healthcare Excellence', 'group' => 'general', 'type' => 'string', 'description' => 'Company mission tagline'],
            ['key' => 'description', 'value' => 'Ciplon Pharma Private Limited is an ISO 9001: 2015 certified pharmaceutical formulations company dedicated to marketing high-quality, accessible healthcare therapeutics across diverse therapeutic segments.', 'group' => 'general', 'type' => 'text', 'description' => 'Detailed corporate overview'],
            ['key' => 'logo_url', 'value' => '/images/ciplon_logo.png', 'group' => 'general', 'type' => 'image', 'description' => 'Official logo image URL'],

            // Regulatory & Certifications
            ['key' => 'iso_certification', 'value' => 'An ISO 9001: 2015 certified company', 'group' => 'regulatory', 'type' => 'string', 'description' => 'Quality management standards certifications'],
            ['key' => 'fssai_lic_no', 'value' => '10426340000172', 'group' => 'regulatory', 'type' => 'string', 'description' => 'FSSAI License Number'],
            ['key' => 'trademark_status', 'value' => 'TM-Trademark Under Registration', 'group' => 'regulatory', 'type' => 'string', 'description' => 'Trademark registration status'],
            ['key' => 'who_gmp_certified', 'value' => '1', 'group' => 'regulatory', 'type' => 'boolean', 'description' => 'Manufacturing partner WHO-GMP certified status'],

            // Manufacturing Partner
            ['key' => 'manufacturer_name', 'value' => 'WALPAR WELLNESS PVT.LTD.', 'group' => 'manufacturing', 'type' => 'string', 'description' => 'Manufacturing enterprise name'],
            ['key' => 'manufacturer_certification', 'value' => 'WHO-GMP & An ISO 9001 : 2015 Certified Company', 'group' => 'manufacturing', 'type' => 'string', 'description' => 'Manufacturer certification credentials'],
            ['key' => 'manufacturing_unit_address', 'value' => 'PLOT NO.2/A & 06, OPP, SABARMATI GAS STATION, KHATRAJ, KALOL, GANDHINAGAR., Gujarat-382721', 'group' => 'manufacturing', 'type' => 'string', 'description' => 'Primary production manufacturing facility address'],

            // Contact Information
            ['key' => 'company_email', 'value' => 'info@ciplonpharma.in', 'group' => 'contact', 'type' => 'string', 'description' => 'Primary corporate email address'],
            ['key' => 'enquiries_email', 'value' => 'info@ciplonpharma.in', 'group' => 'contact', 'type' => 'string', 'description' => 'Commercial and business development inquiries email'],
            ['key' => 'website_url', 'value' => 'https://www.ciplonpharma.in', 'group' => 'contact', 'type' => 'string', 'description' => 'Official corporate website address'],

            // Location & Address (Corporate Office)
            ['key' => 'headquarters_address', 'value' => 'M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi', 'group' => 'location', 'type' => 'string', 'description' => 'Corporate headquarters street address'],
            ['key' => 'city', 'value' => 'New Delhi', 'group' => 'location', 'type' => 'string', 'description' => 'City of headquarters'],
            ['key' => 'state', 'value' => 'Delhi', 'group' => 'location', 'type' => 'string', 'description' => 'State or province of headquarters'],
            ['key' => 'postal_code', 'value' => '110025', 'group' => 'location', 'type' => 'string', 'description' => 'Postal or ZIP code'],
            ['key' => 'country', 'value' => 'India', 'group' => 'location', 'type' => 'string', 'description' => 'Country of incorporation'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
