<?php

namespace Database\Seeders;

use App\Models\ContentCategory;
use Illuminate\Database\Seeder;

class ResearchContentSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            return;
        }

        $categories = [
            [
                'slug' => 'statistical-research',
                'name_en' => 'Statistical Research',
                'name_ar' => 'البحث الإحصائي',
                'description_en' => 'Methodology, sampling, statistical planning, and analysis notes.',
                'description_ar' => 'ملاحظات حول المنهجية والعينات والتخطيط الإحصائي والتحليل.',
            ],
            [
                'slug' => 'market-research',
                'name_en' => 'Market Research',
                'name_ar' => 'أبحاث السوق',
                'description_en' => 'Market, customer, competitor, and demand research topics.',
                'description_ar' => 'موضوعات أبحاث السوق والعملاء والمنافسين والطلب.',
            ],
            [
                'slug' => 'data-analytics',
                'name_en' => 'Data Analytics',
                'name_ar' => 'تحليل البيانات',
                'description_en' => 'Data cleaning, analysis, visualization, and dashboard guidance.',
                'description_ar' => 'إرشادات تنظيف البيانات والتحليل والتصور ولوحات المعلومات.',
            ],
            [
                'slug' => 'monitoring-and-evaluation',
                'name_en' => 'Monitoring and Evaluation',
                'name_ar' => 'المتابعة والتقييم',
                'description_en' => 'Indicators, evaluation design, learning systems, and reporting.',
                'description_ar' => 'المؤشرات وتصميم التقييم وأنظمة التعلم وإعداد التقارير.',
            ],
            [
                'slug' => 'impact-assessment',
                'name_en' => 'Impact Assessment',
                'name_ar' => 'تقييم الأثر',
                'description_en' => 'Outcome measurement, attribution-aware analysis, and evidence use.',
                'description_ar' => 'قياس النتائج والتحليل المراعي للإسناد واستخدام الأدلة.',
            ],
            [
                'slug' => 'reports-and-publications',
                'name_en' => 'Reports and Publications',
                'name_ar' => 'التقارير والمنشورات',
                'description_en' => 'Approved reports, publications, and evidence briefs.',
                'description_ar' => 'التقارير والمنشورات وموجزات الأدلة المعتمدة.',
            ],
        ];

        foreach ($categories as $category) {
            ContentCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );
        }
    }
}
