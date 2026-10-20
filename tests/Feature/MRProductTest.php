<?php

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mr']);
    Role::firstOrCreate(['name' => 'super_admin']);
});

test('unauthenticated users are redirected from mr products page', function () {
    $response = $this->get('/mr/products');

    $response->assertRedirect('/login');
});

test('unauthenticated users receive 401 from mr products api', function () {
    $response = $this->getJson('/api/v1/mr/products');

    $response->assertStatus(401);
});

test('unauthorized users without mr role receive 403 from mr products page and api', function () {
    $regularUser = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($regularUser)->get('/mr/products');
    $response->assertStatus(403);

    $apiResponse = $this->actingAs($regularUser)->getJson('/api/v1/mr/products');
    $apiResponse->assertStatus(403);
});

test('mr user can access mr products page', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $response = $this->actingAs($mrUser)->get('/mr/products');

    $response->assertStatus(200);
});

test('mr user can list active products via api with compositions and metadata', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $category = Category::firstOrCreate(
        ['slug' => 'cardiology-care'],
        ['name' => 'Cardiology Care']
    );

    $product = Product::create([
        'category_id' => $category->id,
        'brand_name' => 'Cardiovast 20',
        'generic_name' => 'Atorvastatin Calcium Tablets IP',
        'product_code' => 'CP-CV-020',
        'slug' => 'cardiovast-20',
        'dosage_form' => 'Tablet',
        'strength' => '20 mg',
        'short_description' => 'Lipid-lowering HMG-CoA reductase inhibitor',
        'description' => 'Cardiovast lowers LDL cholesterol and triglycerides.',
        'indications' => 'Hypercholesterolemia and primary dyslipidemia',
        'directions' => '1 tablet daily at bedtime',
        'precautions' => 'Contraindicated in active liver disease',
        'storage' => 'Store below 25 deg C',
        'prescription_type' => 'Rx Only',
        'status' => ProductStatus::ACTIVE,
        'is_featured' => true,
    ]);

    $product->compositions()->create([
        'ingredient_name' => 'Atorvastatin Calcium IP',
        'strength' => '20',
        'unit' => 'mg',
    ]);

    $response = $this->actingAs($mrUser)->getJson('/api/v1/mr/products');

    $response->assertStatus(200)
        ->assertJsonPath('success', true);

    expect($response->json('data'))->not->toBeEmpty();
    expect($response->json('meta.total'))->toBeGreaterThanOrEqual(1);

    $found = collect($response->json('data'))->firstWhere('brand_name', 'Cardiovast 20');
    expect($found)->not->toBeNull();
    expect($found['category']['name'])->toBe('Cardiology Care');
    expect($found['compositions'])->toHaveCount(1);
});

test('mr user can search products by brand name and composition', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $category = Category::firstOrCreate(
        ['slug' => 'antibiotics'],
        ['name' => 'Antibiotics']
    );

    $product = Product::create([
        'category_id' => $category->id,
        'brand_name' => 'CiplonMox 500',
        'generic_name' => 'Amoxicillin Capsules IP',
        'product_code' => 'CP-AB-500',
        'slug' => 'ciplonmox-500',
        'dosage_form' => 'Capsule',
        'strength' => '500 mg',
        'indications' => 'Bacterial infections of the respiratory tract',
        'status' => ProductStatus::ACTIVE,
    ]);

    $product->compositions()->create([
        'ingredient_name' => 'Amoxicillin Trihydrate IP',
        'strength' => '500',
        'unit' => 'mg',
    ]);

    // Search by brand name
    $searchRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/products?search=CiplonMox');
    $searchRes->assertStatus(200);
    expect($searchRes->json('data'))->toHaveCount(1);
    expect($searchRes->json('data.0.brand_name'))->toBe('CiplonMox 500');

    // Search by composition ingredient
    $compRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/products?search=Amoxicillin');
    $compRes->assertStatus(200);
    expect($compRes->json('data'))->not->toBeEmpty();
});

test('mr user can filter products by category and dosage form', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $catRespiratory = Category::firstOrCreate(
        ['slug' => 'respiratory-care'],
        ['name' => 'Respiratory Care']
    );

    $inhaler = Product::create([
        'category_id' => $catRespiratory->id,
        'brand_name' => 'BudeCiplon Inhaler',
        'generic_name' => 'Budesonide Inhalation Aerosol',
        'product_code' => 'CP-RS-200',
        'slug' => 'budeciplon-inhaler',
        'dosage_form' => 'Inhaler',
        'strength' => '200 mcg',
        'status' => ProductStatus::ACTIVE,
    ]);

    // Filter by category slug
    $catRes = $this->actingAs($mrUser)->getJson("/api/v1/mr/products?category={$catRespiratory->slug}");
    $catRes->assertStatus(200);
    expect(collect($catRes->json('data'))->pluck('brand_name'))->toContain('BudeCiplon Inhaler');

    // Filter by dosage form
    $doseRes = $this->actingAs($mrUser)->getJson('/api/v1/mr/products?dosage_form=Inhaler');
    $doseRes->assertStatus(200);
    expect(collect($doseRes->json('data'))->pluck('brand_name'))->toContain('BudeCiplon Inhaler');
});

test('mr user can view single product detailing guide and pre-structured visual aid slides', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $category = Category::firstOrCreate(
        ['slug' => 'gastroenterology'],
        ['name' => 'Gastroenterology']
    );

    $product = Product::create([
        'category_id' => $category->id,
        'brand_name' => 'PantoCiplon DSR',
        'generic_name' => 'Pantoprazole & Domperidone Sustained Release Capsules',
        'product_code' => 'CP-GS-040',
        'slug' => 'pantociplon-dsr',
        'dosage_form' => 'Capsule',
        'strength' => '40 mg / 30 mg',
        'short_description' => 'Fast-acting dual action PPI with prokinetic',
        'indications' => 'GERD, reflux esophagitis, non-ulcer dyspepsia',
        'directions' => '1 capsule daily before breakfast',
        'precautions' => 'Do not crush or chew sustained release beads',
        'status' => ProductStatus::ACTIVE,
    ]);

    $product->compositions()->create([
        'ingredient_name' => 'Pantoprazole Sodium IP',
        'strength' => '40',
        'unit' => 'mg',
    ]);

    $response = $this->actingAs($mrUser)->getJson("/api/v1/mr/products/{$product->id}");

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.brand_name', 'PantoCiplon DSR')
        ->assertJsonPath('visual_aid_slides.0.title', 'Molecule Introduction & Composition')
        ->assertJsonPath('visual_aid_slides.1.title', 'Clinical Indications & Pharmacology')
        ->assertJsonPath('visual_aid_slides.2.title', 'Dosage Guidelines & Safety Profile')
        ->assertJsonPath('visual_aid_slides.3.title', 'The Ciplon Competitive Edge');

    expect($response->json('visual_aid_slides'))->toHaveCount(4);
});

test('draft or inactive products are excluded from mr detailing directory', function () {
    $mrUser = User::factory()->create(['role' => 'mr']);
    $mrUser->assignRole('mr');

    $category = Category::firstOrCreate(
        ['slug' => 'unreleased-category'],
        ['name' => 'Unreleased Category']
    );

    $draftProd = Product::create([
        'category_id' => $category->id,
        'brand_name' => 'Draft Unreleased Molecule',
        'generic_name' => 'Under clinical trial',
        'product_code' => 'CP-DF-001',
        'slug' => 'draft-unreleased-molecule',
        'dosage_form' => 'Tablet',
        'strength' => '10 mg',
        'status' => ProductStatus::DRAFT,
    ]);

    $response = $this->actingAs($mrUser)->getJson('/api/v1/mr/products');
    $response->assertStatus(200);

    $names = collect($response->json('data'))->pluck('brand_name');
    expect($names)->not->toContain('Draft Unreleased Molecule');
});
