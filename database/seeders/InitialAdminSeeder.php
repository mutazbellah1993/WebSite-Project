<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class InitialAdminSeeder extends Seeder
{
    public function run(): void
    {
        $name = env('ELITEDATA_ADMIN_NAME');
        $email = env('ELITEDATA_ADMIN_EMAIL');
        $password = env('ELITEDATA_ADMIN_PASSWORD');

        if (! $name || ! $email || ! $password) {
            throw new RuntimeException('Set ELITEDATA_ADMIN_NAME, ELITEDATA_ADMIN_EMAIL, and ELITEDATA_ADMIN_PASSWORD first.');
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => 'super_admin',
                'locale' => env('ELITEDATA_ADMIN_LOCALE', 'en'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
