<?php

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Seed only the 3 official Ciplon pharmaceutical products matching packaging designs:
     * 1. CIPLOMAX CD3 (Alpha Lipoic Acid, Benfotiamine, Chromium, Pyridoxine HCl, Folic Acid, Myo-Inositol, Mecobalamin, Vitamin D3, Calcium Carbonate Tablets)
     * 2. DICLOTRYP-FORT (Trypsin, Bromelain, Rutoside Trihydrate & Diclofenac Sodium Tablets)
     * 3. CIPLON-D (Esomeprazole & Sustained Release Domperidone Capsules)
     */
    public function run(): void
    {
        $admin = User::first();
        $adminId = $admin?->id ?? 1;

        // Ensure primary categories exist
        $nutraceuticalsCat = Category::firstOrCreate(
            ['slug' => 'nutraceuticals-and-multivitamins'],
            [
                'name' => 'Nutraceuticals & Multivitamins',
                'description' => 'Advanced neurotrophic, metabolic, and micronutrient formulations.',
                'status' => 'active',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        $analgesicCat = Category::firstOrCreate(
            ['slug' => 'analgesics-and-anti-inflammatory'],
            [
                'name' => 'Analgesics & Anti-Inflammatory',
                'description' => 'Targeted anti-inflammatory, proteolytic enzyme and pain relief formulations.',
                'status' => 'active',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        $gastroCat = Category::firstOrCreate(
            ['slug' => 'gastrointestinal-and-hepatology'],
            [
                'name' => 'Gastrointestinal & Hepatology',
                'description' => 'Gastro-resistant proton pump inhibitors and prokinetic combinations.',
                'status' => 'active',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]
        );

        $productsData = [
            // 1. CIPLOMAX CD3
            [
                'category_id' => $nutraceuticalsCat->id,
                'brand_name' => 'CIPLOMAX CD3',
                'generic_name' => 'Alpha Lipoic Acid, Benfotiamine, Chromium, Pyridoxine Hydrochloride, Folic Acid, Myo-Inositol, Mecobalamin, Vitamin D3 and Calcium Carbonate Tablets',
                'product_code' => 'CIP-MAX-CD3',
                'dosage_form' => 'Film-Coated Tablet',
                'strength' => '10-in-1 Neuro-Metabolic Complex',
                'short_description' => 'Comprehensive neuroprotective and metabolic support formulation with essential active vitamins, antioxidants, and minerals.',
                'description' => "CIPLOMAX CD3 is an advanced neuro-metabolic formulation combining Alpha Lipoic Acid, Benfotiamine, Mecobalamin, Myo-Inositol, Pyridoxine, Folic Acid, Chromium, Vitamin D3, and Calcium Carbonate. Manufactured by Pure & Cure Healthcare Pvt. Ltd. (A subsidiary of Akums Drugs & Pharmaceuticals Ltd.) under strict cGMP protocols. Marketed by CIPLON PHARMA PRIVATE LIMITED (ISO 9001:2015 Certified Company).\n\nPackaging: 1 x 10 Tablets (150x15x100 mm box).\nMfg. Lic. No.: 61/UA/SC/P-2013.",
                'indications' => 'Diabetic peripheral neuropathy, nerve regeneration, metabolic syndrome, generalized neuro-vascular weakness, hyperhomocysteinemia, and therapeutic micronutrient replenishment.',
                'directions' => 'One tablet a day or as directed by the Physician. Tablet should be swallowed whole with water.',
                'precautions' => 'Keep all medicines out of reach of children. Appropriate overages added to compensate the loss on storage. Not for medicinal misuse.',
                'storage' => 'Store protected from light & moisture, at a temperature not exceeding 25°C.',
                'prescription_type' => 'Rx / Therapeutic',
                'is_featured' => true,
                'image_path' => '/images/diplomax_cd3.jpg',
                'compositions' => [
                    ['ingredient_name' => 'Alpha Lipoic Acid IP', 'strength' => '200', 'unit' => 'mg'],
                    ['ingredient_name' => 'Benfotiamine', 'strength' => '150', 'unit' => 'mg'],
                    ['ingredient_name' => 'Chromium Picolinate IP (Eq. to Chromium 200mcg)', 'strength' => '200', 'unit' => 'mcg'],
                    ['ingredient_name' => 'Pyridoxine Hydrochloride IP', 'strength' => '3', 'unit' => 'mg'],
                    ['ingredient_name' => 'Folic Acid IP', 'strength' => '1.5', 'unit' => 'mg'],
                    ['ingredient_name' => 'Myo-Inositol IP', 'strength' => '100', 'unit' => 'mg'],
                    ['ingredient_name' => 'Mecobalamin IP', 'strength' => '1000', 'unit' => 'mcg'],
                    ['ingredient_name' => 'Vitamin D3 IP', 'strength' => '1000', 'unit' => 'IU'],
                    ['ingredient_name' => 'Calcium Carbonate IP', 'strength' => '500', 'unit' => 'mg'],
                ],
            ],

            // 2. DICLOTRYP-FORT
            [
                'category_id' => $analgesicCat->id,
                'brand_name' => 'DICLOTRYP-FORT',
                'generic_name' => 'Trypsin, Bromelain, Rutoside & Diclofenac Sodium Tablets',
                'product_code' => 'CIP-DIC-FRT',
                'dosage_form' => 'Enteric Coated Tablet',
                'strength' => '48mg + 90mg + 100mg + 50mg',
                'short_description' => 'Synergistic proteolytic enzyme & NSAID formulation for rapid edema resolution, inflammation control, and targeted pain relief.',
                'description' => "DICLOTRYP-FORT combines proteolytic enzymes (Trypsin and Bromelain) with the antioxidant bioflavonoid Rutoside Trihydrate and the potent analgesic Diclofenac Sodium. Each enteric-coated tablet facilitates microcirculation breakdown of inflammatory exudates and rapid analgesia.\n\nManufactured by: Pure & Cure Healthcare Pvt. Ltd. (A subsidiary of Akums Drugs & Pharmaceuticals Ltd.), Plot No. 26A, 27-30, Sector-8A, I.I.E., SIDCUL, Ranipur, Haridwar-249 403, (Uttarakhand).\nMarketed by: CIPLON PHARMA PRIVATE LIMITED.\nPackaging: 10x10 Tablets (98 x 43 x 68 mm box).\nSCHEDULE H PRESCRIPTION DRUG - CAUTION.",
                'indications' => 'Post-operative edema, traumatic inflammation, sports injuries, acute tendonitis, bursitis, osteoarthritis flare-ups, dental surgical pain, and pelvic inflammatory swelling.',
                'directions' => 'As directed by the Physician. Tablet should be swallowed whole and not to be chewed or crushed.',
                'precautions' => 'SCHEDULE H PRESCRIPTION DRUG - CAUTION: Not to be sold by retail without the prescription of a Registered Medical Practitioner. Warning: Not for veterinary use. Keep all medicines out of reach of children.',
                'storage' => 'Store protected from light & moisture, at a temperature not exceeding 30°C.',
                'prescription_type' => 'Schedule H Prescription Drug',
                'is_featured' => true,
                'image_path' => '/images/diclotryp_fort.png',
                'compositions' => [
                    ['ingredient_name' => 'Trypsin BP', 'strength' => '48', 'unit' => 'mg'],
                    ['ingredient_name' => 'Bromelain USP', 'strength' => '90', 'unit' => 'mg'],
                    ['ingredient_name' => 'Rutoside Trihydrate BP', 'strength' => '100', 'unit' => 'mg'],
                    ['ingredient_name' => 'Diclofenac Sodium IP', 'strength' => '50', 'unit' => 'mg'],
                ],
            ],

            // 3. CIPLON-D
            [
                'category_id' => $gastroCat->id,
                'brand_name' => 'CIPLON-D',
                'generic_name' => 'Esomeprazole & Sustained Release Domperidone Capsules',
                'product_code' => 'CIP-CIP-D',
                'dosage_form' => 'Hard Gelatin Capsule',
                'strength' => '40mg + 30mg SR',
                'short_description' => 'Dual-action PPI & prokinetic regimen for 24-hour acid suppression and gastrointestinal motility restoration.',
                'description' => "CIPLON-D provides high-potency acid suppression through enteric-coated Esomeprazole Magnesium Trihydrate pellets combined with sustained release Domperidone pellets to prevent acid reflux, nausea, and delayed gastric emptying.\n\nManufactured by: Pure & Cure Healthcare Pvt. Ltd. (A subsidiary of Akums Drugs & Pharmaceuticals Ltd.), Vill. Manakpur, P.O. Lodhimajra, Baddi-173 205, Distt.-Solan, (H.P.).\nMarketed by: CIPLON PHARMA PVT. LTD.\nPackaging: 10x10 Capsules.\nSCHEDULE H PRESCRIPTION DRUG - CAUTION.",
                'indications' => 'Gastroesophageal Reflux Disease (GERD) refractory to monotherapy, erosive esophagitis, non-ulcer dyspepsia, hyperacidity associated with nausea, gastroparesis, and duodenal/gastric ulcer healing.',
                'directions' => 'As directed by the Physician. Capsule should be swallowed whole and not opened, chewed or crushed. Preferably taken 30-60 minutes before breakfast.',
                'precautions' => 'SCHEDULE H PRESCRIPTION DRUG - CAUTION: Not to be sold by retail without the prescription of a Registered Medical Practitioner. Keep out of reach of children.',
                'storage' => 'Store protected from light & moisture, at a temperature not exceeding 30°C.',
                'prescription_type' => 'Schedule H Prescription Drug',
                'is_featured' => true,
                'image_path' => '/images/ciplon_d.png',
                'compositions' => [
                    ['ingredient_name' => 'Esomeprazole Magnesium Trihydrate IP (Eq. to Esomeprazole, as enteric coated pellets)', 'strength' => '40', 'unit' => 'mg'],
                    ['ingredient_name' => 'Domperidone IP (as sustained release pellets)', 'strength' => '30', 'unit' => 'mg'],
                ],
            ],
        ];

        foreach ($productsData as $prodData) {
            $slug = Str::slug($prodData['brand_name']);

            $product = Product::updateOrCreate(
                ['product_code' => $prodData['product_code']],
                [
                    'category_id' => $prodData['category_id'],
                    'brand_name' => $prodData['brand_name'],
                    'generic_name' => $prodData['generic_name'],
                    'slug' => $slug,
                    'dosage_form' => $prodData['dosage_form'],
                    'strength' => $prodData['strength'],
                    'short_description' => $prodData['short_description'],
                    'description' => $prodData['description'],
                    'indications' => $prodData['indications'],
                    'directions' => $prodData['directions'],
                    'precautions' => $prodData['precautions'],
                    'storage' => $prodData['storage'],
                    'prescription_type' => $prodData['prescription_type'],
                    'status' => ProductStatus::ACTIVE,
                    'is_featured' => $prodData['is_featured'],
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ]
            );

            // Seed active compositions
            $product->compositions()->delete();
            foreach ($prodData['compositions'] as $composition) {
                $product->compositions()->create($composition);
            }

            // Seed primary packaging image
            $product->images()->delete();
            $product->images()->create([
                'collection' => 'product-image',
                'file_name' => basename($prodData['image_path']),
                'file_path' => $prodData['image_path'],
                'mime_type' => str_ends_with($prodData['image_path'], '.png') ? 'image/png' : 'image/jpeg',
                'disk' => 'public',
                'size' => 150000,
                'alt_text' => $prodData['brand_name'].' 3D Pack Packaging',
                'sort_order' => 0,
            ]);
        }
    }
}
