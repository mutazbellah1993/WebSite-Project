<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_library', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 150)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('alt_text_en')->nullable();
            $table->string('alt_text_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->string('title_ar')->nullable();
            $table->timestamps();
            $table->unique(['disk', 'path']);
            $table->index(['mime_type', 'created_at']);
        });

        Schema::create('site_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('group')->default('general');
            $table->string('key')->unique();
            $table->enum('type', ['string', 'text', 'boolean', 'integer', 'json'])->default('string');
            $table->longText('value')->nullable();
            $table->boolean('is_public')->default(false);
            $table->timestamps();
            $table->index(['group', 'is_public']);
        });

        Schema::create('audit_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event');
            $table->string('auditable_type')->nullable();
            $table->unsignedBigInteger('auditable_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('url', 1000)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 1000)->nullable();
            $table->timestamps();
            $table->index(['auditable_type', 'auditable_id']);
            $table->index(['user_id', 'created_at']);
            $table->index(['event', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('media_library');
    }
};
