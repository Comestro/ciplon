<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mr_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctors')->nullOnDelete();
            $table->string('custom_contact_name')->nullable();
            $table->string('contact_type', 30)->default('doctor'); // doctor, chemist, hospital, stockist
            $table->string('action_type', 20)->default('visit'); // visit, call
            $table->date('scheduled_date');
            $table->string('scheduled_time', 50)->nullable(); // e.g. "10:30 AM", "Morning OPD", "Evening Clinic"
            $table->string('priority', 20)->default('normal'); // high, normal, low
            $table->string('purpose'); // e.g. "Follow-up on AcecloPlus SP sample", "Routine Clinic Detailing"
            $table->text('notes')->nullable();
            $table->string('status', 20)->default('pending'); // pending, completed, missed, rescheduled
            $table->timestamp('completed_at')->nullable();
            $table->text('outcome_note')->nullable(); // feedback/notes recorded when visited or called
            $table->foreignId('visit_id')->nullable()->constrained('visits')->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'scheduled_date']);
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'action_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mr_schedules');
    }
};
