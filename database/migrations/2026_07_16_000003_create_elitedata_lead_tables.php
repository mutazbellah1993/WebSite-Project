<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 30)->nullable();
            $table->string('organization')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->enum('preferred_language', ['en', 'ar'])->default('ar');
            $table->enum('status', ['new', 'in_progress', 'resolved', 'spam'])->default('new');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->text('internal_notes')->nullable();
            $table->string('source')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 1000)->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'created_at']);
            $table->index(['assigned_to', 'status']);
        });

        Schema::create('study_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('request_number')->unique();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 30)->nullable();
            $table->string('organization')->nullable();
            $table->string('job_title')->nullable();
            $table->enum('client_type', ['business','ngo','government','university','researcher','individual','other'])->nullable();
            $table->string('service_type')->nullable();
            $table->string('study_title')->nullable();
            $table->longText('project_description');
            $table->longText('objectives')->nullable();
            $table->longText('target_population')->nullable();
            $table->longText('geographic_scope')->nullable();
            $table->unsignedInteger('estimated_sample_size')->nullable();
            $table->date('desired_start_date')->nullable();
            $table->date('desired_end_date')->nullable();
            $table->decimal('estimated_budget', 14, 2)->nullable();
            $table->char('budget_currency', 3)->nullable();
            $table->string('attachment_path')->nullable();
            $table->enum('preferred_language', ['en', 'ar'])->default('ar');
            $table->enum('status', ['new','reviewing','clarification_needed','proposal_sent','accepted','rejected','closed'])->default('new');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->text('internal_notes')->nullable();
            $table->timestamp('proposal_sent_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'created_at']);
            $table->index(['client_type', 'status']);
            $table->index(['assigned_to', 'status']);
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table): void {
            $table->id();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->enum('preferred_language', ['en', 'ar'])->default('ar');
            $table->boolean('is_active')->default(true);
            $table->timestamp('subscribed_at')->useCurrent();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->string('verification_token', 100)->nullable()->unique();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            $table->index(['is_active', 'verified_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('study_requests');
        Schema::dropIfExists('inquiries');
    }
};
