<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone', 30)->nullable()->after('email');
            $table->enum('role', ['super_admin', 'admin', 'editor', 'viewer'])->default('editor')->after('password');
            $table->enum('locale', ['en', 'ar'])->default('en')->after('role');
            $table->boolean('is_active')->default(true)->after('locale');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            $table->index(['role', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex(['role', 'is_active']);
            $table->dropColumn(['phone', 'role', 'locale', 'is_active', 'last_login_at']);
        });
    }
};
