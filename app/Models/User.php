<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    // @use HasFactory<UserFactory>
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    // Get the attributes that should be cast.
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Ensure name is always capitalized in Title Case
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? ucwords($value) : '',
            set: fn (?string $value) => $value ? ucwords(trim($value)) : '',
        );
    }

    // Helper to check if user is the Super Admin
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin' || $this->hasRole('super_admin');
    }

    // Helper to check if user has admin privileges
    public function isAdmin(): bool
    {
        return $this->isSuperAdmin()
            || $this->hasRole('admin')
            || $this->role === 'admin';
    }

    public function doctors(): HasMany
    {
        return $this->hasMany(Doctor::class, 'user_id');
    }

    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class, 'user_id');
    }

    public function mrSchedules(): HasMany
    {
        return $this->hasMany(MRSchedule::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(MRLocation::class);
    }

    public function latestLocation(): HasOne
    {
        return $this->hasOne(MRLocation::class)->latestOfMany('last_synced_at');
    }

    public function tourPlans(): HasMany
    {
        return $this->hasMany(TourPlan::class);
    }
}
