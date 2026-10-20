<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'qualification',
        'specialization',
        'clinic_hospital_name',
        'address',
        'territory',
        'city',
        'phone',
        'email',
        'visiting_hours',
        'visiting_days',
        'tier',
        'target_frequency_per_month',
        'notes',
        'status',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'target_frequency_per_month' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function representative(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $term = trim($term);

        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('clinic_hospital_name', 'like', "%{$term}%")
                ->orWhere('specialization', 'like', "%{$term}%")
                ->orWhere('territory', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%");
        });
    }

    public function scopeBySpecialization(Builder $query, ?string $specialization): Builder
    {
        if (blank($specialization) || $specialization === 'all') {
            return $query;
        }

        return $query->where('specialization', $specialization);
    }

    public function scopeByTier(Builder $query, ?string $tier): Builder
    {
        if (blank($tier) || $tier === 'all') {
            return $query;
        }

        return $query->where('tier', $tier);
    }

    public function scopeByTerritory(Builder $query, ?string $territory): Builder
    {
        if (blank($territory) || $territory === 'all') {
            return $query;
        }

        return $query->where('territory', $territory);
    }

    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class, 'doctor_id');
    }
}
