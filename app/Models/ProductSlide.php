<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSlide extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'title',
        'subtitle',
        'badge',
        'headline',
        'content',
        'layout_type',
        'cards',
        'image_path',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'cards' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
