<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MRSchedule extends Model
{
    use HasFactory;

    protected $table = 'mr_schedules';

    protected $fillable = [
        'user_id',
        'doctor_id',
        'custom_contact_name',
        'contact_type',
        'action_type',
        'scheduled_date',
        'priority',
        'purpose',
        'notes',
        'status',
        'completed_at',
        'outcome_note',
        'visit_id',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * Get display name of target contact.
     */
    public function getContactDisplayNameAttribute(): string
    {
        if ($this->doctor) {
            return 'Dr. '.$this->doctor->name;
        }

        return $this->custom_contact_name ?: 'Contact';
    }
}
