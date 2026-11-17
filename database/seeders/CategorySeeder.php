<?php

namespace Database\Seeders;

use App\Enums\CategoryStatus;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    // Seed standard pharmaceutical therapeutic categories.
    public function run(): void
    {
        $admin = User::first();
        $adminId = $admin?->id;

        $categories = [
            [
                'name' => 'Antibiotics & Antimicrobials',
                'description' => 'Broad-spectrum antimicrobial agents, penicillins, and cephalosporins formulated to treat bacterial infections with high efficacy.',
                'slug' => 'antibiotics-and-antimicrobials',
            ],
            [
                'name' => 'Cardiovascular & Hypertension',
                'description' => 'Essential cardiovascular therapeutics targeting hypertension, dyslipidemia, heart failure, and stroke prevention.',
                'slug' => 'cardiovascular-and-hypertension',
            ],
            [
                'name' => 'Analgesics & Anti-Inflammatory',
                'description' => 'Comprehensive pain management, antipyretics, and non-steroidal anti-inflammatory drugs (NSAIDs) for acute and chronic conditions.',
                'slug' => 'analgesics-and-anti-inflammatory',
            ],
            [
                'name' => 'Gastrointestinal & Hepatology',
                'description' => 'Targeted gastrointestinal solutions including proton pump inhibitors, prokinetics, antacids, and liver health formulations.',
                'slug' => 'gastrointestinal-and-hepatology',
            ],
            [
                'name' => 'Respiratory & Pulmonology',
                'description' => 'Bronchodilators, anti-allergics, antihistamines, and mucolytics for asthma, allergic rhinitis, and pulmonary conditions.',
                'slug' => 'respiratory-and-pulmonology',
            ],
            [
                'name' => 'Nutraceuticals & Multivitamins',
                'description' => 'Essential vitamins, zinc, minerals, and bioactive antioxidants designed to support immune function and metabolic vitality.',
                'slug' => 'nutraceuticals-and-multivitamins',
            ],
            [
                'name' => 'Dental & Oral Care',
                'description' => 'Targeted antiseptic mouthwashes, cavity prevention, and gingival oral hygiene formulations.',
                'slug' => 'dental-and-oral-care',
            ],
        ];

        foreach ($categories as $data) {
            Category::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'status' => CategoryStatus::ACTIVE,
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ]
            );
        }
    }
}
