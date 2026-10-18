<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSlideSeeder extends Seeder
{
    public function run(): void
    {
        // Sample slide images available in public/images
        $sampleImages = [
            '/images/hero_indian_consultation.jpg',
            '/images/hero_indian_doctors.jpg',
            '/images/ciplon_lab.jpg',
            '/images/ciplon_facility.jpg',
            '/images/box_factocel_ix.jpg',
        ];

        // Seed slides for Product 1 (AmoxiClav 625 Duo)
        $prod1 = Product::find(1);
        if ($prod1) {
            $prod1->slides()->delete();
            $slidesData = [
                ['title' => 'AmoxiClav Clinical Overview', 'image_path' => '/images/hero_indian_consultation.jpg'],
                ['title' => 'Microbiological Spectrum & Efficacy', 'image_path' => '/images/ciplon_lab.jpg'],
                ['title' => 'Prescribing Guidelines & Safety', 'image_path' => '/images/hero_indian_doctors.jpg'],
                ['title' => 'Quality Manufacturing Standards', 'image_path' => '/images/ciplon_facility.jpg'],
            ];
            foreach ($slidesData as $idx => $s) {
                $prod1->slides()->create([
                    'title' => $s['title'],
                    'image_path' => $s['image_path'],
                    'sort_order' => $idx + 1,
                    'is_active' => true,
                ]);
            }
        }

        // Seed slides for Product 9 (AcecloPlus SP)
        $prod9 = Product::find(9);
        if ($prod9) {
            $prod9->slides()->delete();
            $slidesData = [
                ['title' => 'AcecloPlus SP — Triple Action Profile', 'image_path' => '/images/hero_indian_consultation.jpg'],
                ['title' => 'Inflammation & Edema Reduction Speed', 'image_path' => '/images/ciplon_lab.jpg'],
                ['title' => 'Tolerability & Gastric Safety Advantage', 'image_path' => '/images/hero_indian_doctors.jpg'],
                ['title' => 'WHO-GMP Cleanroom Synthesis', 'image_path' => '/images/ciplon_facility.jpg'],
            ];
            foreach ($slidesData as $idx => $s) {
                $prod9->slides()->create([
                    'title' => $s['title'],
                    'image_path' => $s['image_path'],
                    'sort_order' => $idx + 1,
                    'is_active' => true,
                ]);
            }
        }
    }
}
