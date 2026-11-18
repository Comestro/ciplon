<?php

use App\Enums\CategoryStatus;
use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Image;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin product image upload stores on r2 disk and product deletion removes it from r2', function () {
    Storage::fake('local');
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
    expect(Storage::disk('local')->files('temp-uploads'))->toBeEmpty();

    // Deleting the product should delete the R2 object as well
    $deleteResponse = $this->actingAs($admin)->delete("/admin/products/{$product->id}");
    $deleteResponse->assertRedirect('/admin/products');

    Storage::disk('r2')->assertMissing($image->file_path);
    $this->assertDatabaseMissing('images', ['id' => $image->id]);
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
