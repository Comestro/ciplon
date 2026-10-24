<?php

namespace App\Models;

use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'brand_name',
        'generic_name',
        'product_code',
        'slug',
        'dosage_form',
        'strength',
        'short_description',
        'description',
        'indications',
        'directions',
        'precautions',
        'storage',
        'prescription_type',
        'status',
        'is_featured',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'status' => ProductStatus::class,
        'is_featured' => 'boolean',
    ];

    // Category that this product belongs to.
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Product compositions / active ingredients.

    public function compositions(): HasMany
    {
        return $this->hasMany(ProductComposition::class);
    }

    // Polymorphic product images.
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'model')
            ->where('collection', 'product-image')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    // Primary / first display image.
    public function primaryImage(): MorphOne
    {
        return $this->morphOne(Image::class, 'model')
            ->where('collection', 'product-image')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    // User who created the product record.
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // User who last updated the product record.
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Generate a unique slug for the product.
    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
