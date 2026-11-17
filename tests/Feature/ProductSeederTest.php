<?php

use App\Models\Product;
use App\Models\User;
use Database\Seeders\ProductSeeder;

test('product seeder successfully seeds throtox gargle and all active compositions', function () {
    User::factory()->create(['role' => 'super_admin']);

    $this->seed(ProductSeeder::class);

    $this->assertDatabaseHas('categories', [
        'slug' => 'dental-and-oral-care',
        'name' => 'Dental & Oral Care',
    ]);

    $this->assertDatabaseHas('products', [
        'brand_name' => 'THROTOX GARGLE',
        'product_code' => 'CIP-THR-GAR',
        'dosage_form' => 'Mouth Wash',
        'strength' => '0.20% w/v + 0.05% w/v + 0.09% w/v',
    ]);

    $product = Product::where('product_code', 'CIP-THR-GAR')
        ->with(['category', 'compositions', 'images'])
        ->first();

    expect($product)->not->toBeNull();
    expect($product->category->name)->toBe('Dental & Oral Care');
    expect($product->compositions)->toHaveCount(3);

    $chlorhexidine = $product->compositions()->where('ingredient_name', 'like', '%Chlorhexidine%')->first();
    expect($chlorhexidine)->not->toBeNull();
    expect($chlorhexidine->strength)->toBe('0.20');
    expect($chlorhexidine->unit)->toBe('% w/v');

    $fluoride = $product->compositions()->where('ingredient_name', 'like', '%Sodium Fluoride%')->first();
    expect($fluoride)->not->toBeNull();
    expect($fluoride->strength)->toBe('0.05');

    $zinc = $product->compositions()->where('ingredient_name', 'like', '%Zinc Chloride%')->first();
    expect($zinc)->not->toBeNull();
    expect($zinc->strength)->toBe('0.09');

    expect($product->images)->toHaveCount(1);
    expect($product->images->first()->file_path)->toBe('/images/throtox_gargle.png');
});

test('product seeder successfully seeds vitos gold with full multivitamin and antioxidant matrix', function () {
    User::factory()->create(['role' => 'super_admin']);

    $this->seed(ProductSeeder::class);

    $this->assertDatabaseHas('products', [
        'brand_name' => 'VITOS GOLD',
        'product_code' => 'CIP-VIT-GLD',
        'dosage_form' => 'Softgel Capsule',
    ]);

    $vitos = Product::where('product_code', 'CIP-VIT-GLD')
        ->with(['category', 'compositions', 'images'])
        ->first();

    expect($vitos)->not->toBeNull();
    expect($vitos->category->slug)->toBe('nutraceuticals-and-multivitamins');
    expect($vitos->compositions)->toHaveCount(19);

    $lycopene = $vitos->compositions()->where('ingredient_name', 'like', '%Lycopene%')->first();
    expect($lycopene)->not->toBeNull();
    expect($lycopene->strength)->toBe('5000');
    expect($lycopene->unit)->toBe('mcg');

    $lysine = $vitos->compositions()->where('ingredient_name', 'like', '%Lysine%')->first();
    expect($lysine)->not->toBeNull();
    expect($lysine->strength)->toBe('50');
    expect($lysine->unit)->toBe('mg');

    $b12 = $vitos->compositions()->where('ingredient_name', 'like', '%Vitamin B12%')->first();
    expect($b12)->not->toBeNull();
    expect($b12->strength)->toBe('5');
    expect($b12->unit)->toBe('mcg');

    expect($vitos->images)->toHaveCount(1);
    expect($vitos->images->first()->file_path)->toBe('/images/vitos_gold.png');
});
