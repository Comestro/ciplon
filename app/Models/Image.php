<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_type',
        'model_id',
        'collection',
        'file_name',
        'file_path',
        'mime_type',
        'disk',
        'size',
        'alt_text',
        'sort_order',
    ];

    protected $appends = [
        'url',
    ];

    // Polymorphic relation to the parent model (Product, Category, etc.).
    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    // Accessor for full public image URL.
    public function getUrlAttribute(): ?string
    {
        if (empty($this->file_path)) {
            return null;
        }

        // If file_path is already a full URL (such as CDN or external URL)
        if (str_starts_with($this->file_path, 'http://') || str_starts_with($this->file_path, 'https://')) {
            return $this->file_path;
        }

        return Storage::disk($this->disk ?? 'r2')->url($this->file_path);
    }
}
