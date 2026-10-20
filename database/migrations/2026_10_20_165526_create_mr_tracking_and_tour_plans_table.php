<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add coordinates to doctors table
        Schema::table('doctors', function (Blueprint $table) {
            if (! Schema::hasColumn('doctors', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('city');
            }
            if (! Schema::hasColumn('doctors', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
        });

        // 2. Create MR live locations tracking table
        Schema::create('mr_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->float('accuracy')->nullable();
            $table->float('speed')->nullable();
            $table->unsignedTinyInteger('battery_level')->nullable();
            $table->string('battery_status', 30)->nullable(); // charging, discharging, full
            $table->boolean('is_online')->default(true);
            $table->string('current_activity', 100)->nullable(); // travelling, in_clinic, idle, completed_tour
            $table->timestamp('last_synced_at')->useCurrent();
            $table->timestamps();

            $table->index(['user_id', 'last_synced_at']);
        });

        // 3. Create Tour Plans table
        Schema::create('tour_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 30)->default('doctor'); // doctor, distributor
            $table->string('month', 20); // e.g. "July 2026", "June 2026"
            $table->unsignedSmallInteger('year')->default(2026);
            $table->unsignedInteger('days_count')->default(26);
            $table->unsignedInteger('planned_visits')->default(0);
            $table->unsignedInteger('visited_count')->default(0);
            $table->string('status', 30)->default('pending'); // pending, approved, rejected
            $table->text('notes')->nullable();
            $table->text('admin_feedback')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_plans');
        Schema::dropIfExists('mr_locations');

        Schema::table('doctors', function (Blueprint $table) {
            if (Schema::hasColumn('doctors', 'latitude')) {
                $table->dropColumn(['latitude', 'longitude']);
            }
        });
    }
};
