<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('public_inquiries', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 40);
            $table->string('status', 40)->default('new');
            $table->string('locale', 8)->default('en');
            $table->string('organization')->nullable();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 80)->nullable();
            $table->string('sector')->nullable();
            $table->string('service_interest')->nullable();
            $table->string('subject')->nullable();
            $table->string('timeline')->nullable();
            $table->text('message');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('public_inquiries');
    }
};
