<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['group' => 'general', 'key' => 'company_name', 'type' => 'string', 'value' => 'ELITEDATA', 'is_public' => true],
            ['group' => 'general', 'key' => 'company_descriptor', 'type' => 'string', 'value' => 'Research, Statistics & Data Analytics', 'is_public' => true],
            ['group' => 'general', 'key' => 'company_descriptor_ar', 'type' => 'string', 'value' => 'البحوث والإحصاء وتحليل البيانات', 'is_public' => true],
            ['group' => 'general', 'key' => 'default_locale', 'type' => 'string', 'value' => 'en', 'is_public' => true],
            ['group' => 'contact', 'key' => 'website_url', 'type' => 'string', 'value' => 'https://elitedata.pro', 'is_public' => true],
            ['group' => 'contact', 'key' => 'primary_email', 'type' => 'string', 'value' => 'info@elitedata.pro', 'is_public' => true],
            ['group' => 'contact', 'key' => 'phone', 'type' => 'string', 'value' => '+963 940 588 079', 'is_public' => true],
            ['group' => 'contact', 'key' => 'whatsapp_url', 'type' => 'string', 'value' => 'https://wa.me/963940588079', 'is_public' => true],
            ['group' => 'contact', 'key' => 'address_en', 'type' => 'text', 'value' => null, 'is_public' => true],
            ['group' => 'contact', 'key' => 'address_ar', 'type' => 'text', 'value' => null, 'is_public' => true],
            ['group' => 'social', 'key' => 'linkedin_url', 'type' => 'string', 'value' => 'https://linkedin.com/company/elitedata-pro', 'is_public' => true],
            ['group' => 'social', 'key' => 'facebook_url', 'type' => 'string', 'value' => null, 'is_public' => true],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
