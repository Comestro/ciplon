<?php

use App\Enums\CategoryStatus;
use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Image;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use App\Services\R2StorageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin product image upload stores on r2 disk and product deletion removes it from r2', function () {
    Storage::fake('r2');

    $admin = User::factory()->admin()->create();
    $category = Category::create([
        'name' => 'Test Category',
        'slug' => 'test-category',
        'status' => CategoryStatus::ACTIVE,
    ]);

    $file = UploadedFile::fake()->create('packshot.png', 120, 'image/png');

    $response = $this->actingAs($admin)->post('/admin/products', [
        'brand_name' => 'Ciplon R2 Test',
        'generic_name' => 'Test Molecule 500mg',
        'category_id' => $category->id,
        'status' => ProductStatus::ACTIVE->value,
        'images' => [$file],
    ]);

    $response->assertRedirect('/admin/products');

    $product = Product::where('brand_name', 'Ciplon R2 Test')->with('images')->first();
    expect($product)->not->toBeNull();
    expect($product->images)->toHaveCount(1);

    $image = $product->images->first();
    expect($image->disk)->toBe('r2');
    expect($image->file_path)->toStartWith('products/');
    expect($image->url)->toContain($image->file_path);

    Storage::disk('r2')->assertExists($image->file_path);

    // Deleting the product should delete the R2 object as well
    $deleteResponse = $this->actingAs($admin)->delete("/admin/products/{$product->id}");
    $deleteResponse->assertRedirect('/admin/products');

    Storage::disk('r2')->assertMissing($image->file_path);
    $this->assertDatabaseMissing('images', ['id' => $image->id]);
});

test('r2 upload failure during product create and edit returns validation errors cleanly', function () {
    Storage::fake('r2');

    $admin = User::factory()->admin()->create();
    $category = Category::create([
        'name' => 'Failure Category',
        'slug' => 'failure-category',
        'status' => CategoryStatus::ACTIVE,
    ]);

    $mock = Mockery::mock(R2StorageService::class);
    $mock->shouldReceive('upload')->twice()->andThrow(new RuntimeException('Missing R2 credentials'));
    app()->instance(R2StorageService::class, $mock);

    $file = UploadedFile::fake()->create('packshot.png', 120, 'image/png');

    // Create failure rolls back product and exposes error under images
    $createResponse = $this->actingAs($admin)->post('/admin/products', [
        'brand_name' => 'Failed Upload Product',
        'category_id' => $category->id,
        'status' => ProductStatus::ACTIVE->value,
        'images' => [$file],
    ]);

    $createResponse->assertSessionHasErrors(['images']);
    $this->assertDatabaseMissing('products', ['brand_name' => 'Failed Upload Product']);

    // Create a valid product first, then fail an edit upload
    $product = Product::create([
        'category_id' => $category->id,
        'brand_name' => 'Existing Product',
        'slug' => 'existing-product',
        'status' => ProductStatus::ACTIVE,
    ]);
    $existingImg = $product->images()->create([
        'collection' => 'product-image',
        'file_name' => 'existing.png',
        'file_path' => 'products/existing.png',
        'mime_type' => 'image/png',
        'disk' => 'r2',
        'size' => 1000,
        'alt_text' => 'Existing',
        'sort_order' => 0,
    ]);
    Storage::disk('r2')->put('products/existing.png', 'dummy');

    $editResponse = $this->actingAs($admin)->put("/admin/products/{$product->id}", [
        'brand_name' => 'Updated Product Name',
        'category_id' => $category->id,
        'status' => ProductStatus::ACTIVE->value,
        'removed_image_ids' => [$existingImg->id],
        'images' => [$file],
    ]);

    $editResponse->assertSessionHasErrors(['images']);
    expect($product->fresh()->brand_name)->toBe('Existing Product');
    $this->assertDatabaseHas('images', ['id' => $existingImg->id]);
    Storage::disk('r2')->assertExists('products/existing.png');
});

test('product validation returns errors for incomplete composition variations', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::create([
        'name' => 'Validation Category',
        'slug' => 'validation-category',
        'status' => CategoryStatus::ACTIVE,
    ]);

    $response = $this->actingAs($admin)->post('/admin/products', [
        'brand_name' => 'Incomplete Variation Product',
        'category_id' => $category->id,
        'status' => ProductStatus::ACTIVE->value,
        'compositions' => json_encode([
            ['ingredient_name' => 'Paracetamol', 'strength' => '', 'unit' => 'mg'],
        ]),
    ]);

    $response->assertSessionHasErrors(['compositions.0.strength']);
});

test('image url accessor preserves static public images and resolves r2 keys', function () {
    Storage::fake('r2');

    $seededImage = new Image([
        'file_path' => '/images/diplomax_cd3.jpg',
        'disk' => 'public',
    ]);
    expect($seededImage->url)->toBe('/images/diplomax_cd3.jpg');

    $r2Image = new Image([
        'file_path' => 'products/custom_pack.png',
        'disk' => 'r2',
    ]);
    expect($r2Image->url)->toEndWith('/products/custom_pack.png');
});

test('admin settings logo upload stores on r2 and replaces previous r2 logo', function () {
    Storage::fake('r2');

    $admin = User::factory()->admin()->create();

    $firstLogo = UploadedFile::fake()->create('logo_v1.png', 80, 'image/png');
    $this->actingAs($admin)
        ->post('/admin/settings', ['logo' => $firstLogo])
        ->assertRedirect();

    $firstImage = Image::where('model_type', Setting::class)->where('collection', 'logo')->first();
    expect($firstImage)->not->toBeNull();
    expect($firstImage->disk)->toBe('r2');
    expect($firstImage->file_path)->toStartWith('branding/');
    Storage::disk('r2')->assertExists($firstImage->file_path);

    $secondLogo = UploadedFile::fake()->create('logo_v2.png', 80, 'image/png');
    $this->actingAs($admin)
        ->post('/admin/settings', ['logo' => $secondLogo])
        ->assertRedirect();

    $secondImage = Image::where('model_type', Setting::class)->where('collection', 'logo')->first();
    expect($secondImage)->not->toBeNull();
    expect($secondImage->id)->not->toBe($firstImage->id);

    Storage::disk('r2')->assertMissing($firstImage->file_path);
    Storage::disk('r2')->assertExists($secondImage->file_path);
});
