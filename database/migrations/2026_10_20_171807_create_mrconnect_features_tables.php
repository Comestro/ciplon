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
        // 1. Field Expenses Table
        Schema::create('field_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('expense_type', 40); // daily_allowance, travel_fuel, lodging, meal, miscellaneous
            $table->decimal('amount', 10, 2);
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('receipt_url')->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 20)->default('pending'); // pending, approved, rejected
            $table->text('admin_feedback')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date']);
            $table->index(['status', 'date']);
        });

        // 2. Leave Management Table
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('leave_type', 30); // casual, sick, earned, compensatory
            $table->date('from_date');
            $table->date('to_date');
            $table->unsignedSmallInteger('days_count')->default(1);
            $table->text('reason');
            $table->string('status', 20)->default('pending'); // pending, approved, rejected
            $table->text('admin_feedback')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        // 3. POB Orders Table (Personal Order Booking)
        Schema::create('pob_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctors')->nullOnDelete();
            $table->string('order_no', 40)->unique();
            $table->string('chemist_name', 150);
            $table->decimal('total_amount', 12, 2);
            $table->unsignedInteger('items_count')->default(1);
            $table->json('items_json')->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 20)->default('submitted'); // submitted, verified, dispatched, delivered
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        // 4. Primary Sales Table
        Schema::create('primary_sales', function (Blueprint $table) {
            $table->id();
            $table->string('stockist_name', 150);
            $table->string('invoice_no', 50)->unique();
            $table->date('invoice_date');
            $table->string('territory', 100);
            $table->decimal('amount', 12, 2);
            $table->string('status', 20)->default('paid'); // paid, pending, overdue
            $table->timestamps();

            $table->index(['territory', 'invoice_date']);
        });

        // 5. Sales Targets Table
        Schema::create('sales_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('month', 20); // July 2026
            $table->unsignedSmallInteger('year')->default(2026);
            $table->decimal('target_amount', 12, 2);
            $table->decimal('achieved_amount', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'month', 'year']);
        });

        // 6. Notices and Announcements Table
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('content');
            $table->string('category', 40)->default('general'); // scheme, general, circular, price_revision
            $table->string('priority', 20)->default('normal'); // normal, high, urgent
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->useCurrent();
            $table->timestamps();
        });

        // 7. Commercial Schemes Table
        Schema::create('schemes', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('product_name', 150);
            $table->string('offer_detail', 255);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->date('valid_from');
            $table->date('valid_until');
            $table->string('status', 20)->default('active'); // active, expired
            $table->timestamps();
        });

        // 8. Doctor Sponsorships Table
        Schema::create('sponsorships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctors')->nullOnDelete();
            $table->string('title', 200);
            $table->string('type', 40)->default('cme'); // cme, conference, medical_camp, clinic_branding
            $table->decimal('amount', 10, 2);
            $table->date('event_date')->nullable();
            $table->string('status', 20)->default('proposed'); // proposed, approved, disbursed
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsorships');
        Schema::dropIfExists('schemes');
        Schema::dropIfExists('notices');
        Schema::dropIfExists('sales_targets');
        Schema::dropIfExists('primary_sales');
        Schema::dropIfExists('pob_orders');
        Schema::dropIfExists('leaves');
        Schema::dropIfExists('field_expenses');
    }
};
