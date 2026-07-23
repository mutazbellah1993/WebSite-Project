<?php

return [
    'brand' => [
        'name' => 'ELITEDATA',
        'service_line' => 'Research, Statistics & Data Analytics',
        'tagline' => [
            'en' => 'Research, Statistics & Data Analytics',
            'ar' => 'البحوث والإحصاء وتحليل البيانات',
        ],
    ],

    'locales' => [
        'default' => env('APP_LOCALE', 'en'),
        'fallback' => env('APP_FALLBACK_LOCALE', 'en'),
        'supported' => [
            'en' => [
                'name' => 'English',
                'native' => 'English',
                'direction' => 'ltr',
            ],
            'ar' => [
                'name' => 'Arabic',
                'native' => 'العربية',
                'direction' => 'rtl',
            ],
        ],
    ],

    'notifications' => [
        'leads_to' => env('ELITEDATA_LEADS_NOTIFICATION_EMAIL'),
    ],

    'contact' => [
        'website' => 'https://elitedata.pro',
        'email' => 'info@elitedata.pro',
        'email_href' => 'mailto:info@elitedata.pro',
        'phone' => '+963 940 588 079',
        'phone_href' => 'tel:+963940588079',
        'whatsapp_url' => 'https://wa.me/963940588079',
        'linkedin_url' => 'https://linkedin.com/company/elitedata-pro',
    ],

    'services' => [
        'statistical_studies',
        'survey_design',
        'field_data_collection',
        'data_cleaning_analysis',
        'market_research',
        'feasibility_studies',
        'monitoring_evaluation',
        'impact_assessment',
        'power_bi_dashboards',
        'scientific_research_support',
    ],
];
