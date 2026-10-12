<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    // Seed initial pharma company and business settings.
    public function run(): void
    {
        $settings = [
            // General & Identity
            ['key' => 'company_name', 'value' => 'Ciplon Life Sciences', 'group' => 'general', 'type' => 'string', 'description' => 'Brand and trade name of the pharmaceutical company'],
            ['key' => 'legal_name', 'value' => 'Ciplon Pharmaceuticals Ltd.', 'group' => 'general', 'type' => 'string', 'description' => 'Full legally registered corporate entity name'],
            ['key' => 'tagline', 'value' => 'Advancing Global Healthcare Through Scientific Precision & Quality', 'group' => 'general', 'type' => 'string', 'description' => 'Company mission tagline'],
            ['key' => 'description', 'value' => 'A research-driven pharmaceutical enterprise dedicated to developing, manufacturing, and supplying high-quality finished formulations across diverse therapeutic areas.', 'group' => 'general', 'type' => 'text', 'description' => 'Detailed corporate overview'],
            ['key' => 'founded_year', 'value' => '2004', 'group' => 'general', 'type' => 'string', 'description' => 'Year of establishment'],
            ['key' => 'logo_url', 'value' => '', 'group' => 'general', 'type' => 'image', 'description' => 'Official logo image URL'],

            // Regulatory & Compliance
            ['key' => 'drug_license_no', 'value' => 'DL-2024-MH-BIO891', 'group' => 'regulatory', 'type' => 'string', 'description' => 'Drug Manufacturing and Wholesale License Number'],
            ['key' => 'gst_tax_id', 'value' => '27AABCA1234D1Z5', 'group' => 'regulatory', 'type' => 'string', 'description' => 'Goods and Services Tax / Corporate Tax Identification Number'],
            ['key' => 'who_gmp_certified', 'value' => '1', 'group' => 'regulatory', 'type' => 'boolean', 'description' => 'WHO-GMP certification status'],
            ['key' => 'iso_certification', 'value' => 'ISO 9001:2015 & ISO 14001:2015 Certified', 'group' => 'regulatory', 'type' => 'string', 'description' => 'Quality management standards certifications'],

            // Contact Information
            ['key' => 'company_email', 'value' => 'corporate@ciplon.com', 'group' => 'contact', 'type' => 'string', 'description' => 'Primary corporate email address'],
            ['key' => 'enquiries_email', 'value' => 'enquiry@ciplon.com', 'group' => 'contact', 'type' => 'string', 'description' => 'Commercial and business development inquiries email'],
            ['key' => 'company_phone', 'value' => '+91 800 458 7290', 'group' => 'contact', 'type' => 'string', 'description' => 'Customer service and toll-free telephone number'],
            ['key' => 'whatsapp_number', 'value' => '+91 800 458 7291', 'group' => 'contact', 'type' => 'string', 'description' => 'WhatsApp business communication number'],
            ['key' => 'business_hours', 'value' => 'Monday - Friday: 09:00 - 18:00 (IST)', 'group' => 'contact', 'type' => 'string', 'description' => 'Standard office operating hours'],

            // Location & Address
            ['key' => 'headquarters_address', 'value' => 'Innovation Park, Sector 62, Bio-Tech Corridor', 'group' => 'location', 'type' => 'string', 'description' => 'Corporate headquarters street address'],
            ['key' => 'city', 'value' => 'Boston', 'group' => 'location', 'type' => 'string', 'description' => 'City of headquarters'],
            ['key' => 'state', 'value' => 'Massachusetts', 'group' => 'location', 'type' => 'string', 'description' => 'State or province of headquarters'],
            ['key' => 'postal_code', 'value' => '02115', 'group' => 'location', 'type' => 'string', 'description' => 'Postal or ZIP code'],
            ['key' => 'country', 'value' => 'United States', 'group' => 'location', 'type' => 'string', 'description' => 'Country of incorporation'],
            ['key' => 'manufacturing_unit_address', 'value' => 'Ciplon Formulation Plant 1, Pharma SEZ, Industrial Zone', 'group' => 'location', 'type' => 'string', 'description' => 'Primary production manufacturing facility address'],

            // Social & Web Links
            ['key' => 'website_url', 'value' => 'https://ciplon.com', 'group' => 'social', 'type' => 'string', 'description' => 'Official corporate website address'],
            ['key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/ciplon', 'group' => 'social', 'type' => 'string', 'description' => 'Official LinkedIn company page'],
            ['key' => 'twitter_url', 'value' => 'https://x.com/ciplon_pharma', 'group' => 'social', 'type' => 'string', 'description' => 'Official Twitter / X profile'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
