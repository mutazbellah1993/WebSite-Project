<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('excerpt_en')->nullable();
            $table->text('excerpt_ar')->nullable();
            $table->longText('body_en')->nullable();
            $table->longText('body_ar')->nullable();
            $table->string('template')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_ar')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_ar')->nullable();
            $table->string('og_image_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'published_at']);
        });

        Schema::create('services', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('short_description_en')->nullable();
            $table->text('short_description_ar')->nullable();
            $table->longText('description_en')->nullable();
            $table->longText('description_ar')->nullable();
            $table->string('icon')->nullable();
            $table->string('image_path')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_ar')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_ar')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'is_featured', 'sort_order']);
        });

        Schema::create('industries', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->string('icon')->nullable();
            $table->string('image_path')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'sort_order']);
        });

        Schema::create('case_studies', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('industry_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('client_name')->nullable();
            $table->boolean('is_client_public')->default(false);
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('summary_en')->nullable();
            $table->text('summary_ar')->nullable();
            $table->longText('challenge_en')->nullable();
            $table->longText('challenge_ar')->nullable();
            $table->longText('methodology_en')->nullable();
            $table->longText('methodology_ar')->nullable();
            $table->longText('solution_en')->nullable();
            $table->longText('solution_ar')->nullable();
            $table->longText('results_en')->nullable();
            $table->longText('results_ar')->nullable();
            $table->string('featured_image_path')->nullable();
            $table->date('completion_date')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_ar')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_ar')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'is_featured', 'published_at']);
        });

        Schema::create('content_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_en');
            $table->string('name_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->timestamps();
        });

        Schema::create('insights', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', ['article', 'report', 'insight', 'news'])->default('article');
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('excerpt_en')->nullable();
            $table->text('excerpt_ar')->nullable();
            $table->longText('body_en')->nullable();
            $table->longText('body_ar')->nullable();
            $table->string('cover_image_path')->nullable();
            $table->string('attachment_path')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_ar')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_ar')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['type', 'status', 'published_at']);
            $table->index(['is_featured', 'status']);
        });

        Schema::create('content_category_insight', function (Blueprint $table): void {
            $table->foreignId('content_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('insight_id')->constrained()->cascadeOnDelete();
            $table->primary(['content_category_id', 'insight_id']);
        });

        Schema::create('methodology_steps', function (Blueprint $table): void {
            $table->id();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('team_members', function (Blueprint $table): void {
            $table->id();
            $table->string('name_en');
            $table->string('name_ar');
            $table->string('position_en');
            $table->string('position_ar');
            $table->text('bio_en')->nullable();
            $table->text('bio_ar')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('email')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('testimonials', function (Blueprint $table): void {
            $table->id();
            $table->string('client_name');
            $table->string('client_position')->nullable();
            $table->string('organization')->nullable();
            $table->text('quote_en');
            $table->text('quote_ar');
            $table->string('photo_path')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['is_approved', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('methodology_steps');
        Schema::dropIfExists('content_category_insight');
        Schema::dropIfExists('insights');
        Schema::dropIfExists('content_categories');
        Schema::dropIfExists('case_studies');
        Schema::dropIfExists('industries');
        Schema::dropIfExists('services');
        Schema::dropIfExists('pages');
    }
};
