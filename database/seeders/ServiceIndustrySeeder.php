<?php

namespace Database\Seeders;

use App\Models\Industry;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceIndustrySeeder extends Seeder
{
    public function run(): void
    {
        $this->seedServices();
        $this->seedIndustries();
    }

    private function seedServices(): void
    {
        $services = [
            [
                'slug' => 'statistical-consulting',
                'title_en' => 'Statistical Studies and Consulting',
                'title_ar' => 'الدراسات والاستشارات الإحصائية',
                'short_description_en' => 'Study design, sampling guidance, statistical planning, and interpretation support for institutional decisions.',
                'short_description_ar' => 'تصميم الدراسات، وتوجيه العينات، والتخطيط الإحصائي، ودعم تفسير النتائج للقرارات المؤسسية.',
                'description_en' => 'EliteData supports organizations with structured statistical study design, sampling plans, analysis frameworks, and interpretation support.',
                'description_ar' => 'تدعم إيليت داتا المؤسسات في تصميم الدراسات الإحصائية، وخطط العينات، وأطر التحليل، وتفسير النتائج.',
                'icon' => 'statistical-consulting',
                'is_featured' => true,
                'sort_order' => 10,
            ],
            [
                'slug' => 'survey-fieldwork',
                'title_en' => 'Survey Design and Field Data Collection',
                'title_ar' => 'تصميم الاستبيانات وجمع البيانات الميدانية',
                'short_description_en' => 'Questionnaire structure, field protocols, enumerator guidance, and quality checks for reliable primary data.',
                'short_description_ar' => 'بناء الاستبيانات، وبروتوكولات العمل الميداني، وتوجيه الباحثين، وضوابط الجودة لبيانات أولية موثوقة.',
                'description_en' => 'Services cover survey instrument design, fieldwork planning, enumerator guidance, and quality-control procedures.',
                'description_ar' => 'تشمل الخدمات تصميم أدوات المسح، وتخطيط العمل الميداني، وتوجيه الباحثين، وإجراءات ضبط الجودة.',
                'icon' => 'survey-fieldwork',
                'is_featured' => true,
                'sort_order' => 20,
            ],
            [
                'slug' => 'data-analysis',
                'title_en' => 'Data Cleaning and Statistical Analysis',
                'title_ar' => 'تنظيف البيانات والتحليل الإحصائي',
                'short_description_en' => 'Data validation, coding, transformation, descriptive analysis, modeling, and clear analytical reporting.',
                'short_description_ar' => 'التحقق من البيانات، والترميز، والتحويل، والتحليل الوصفي، والنمذجة، وإعداد تقارير تحليلية واضحة.',
                'description_en' => 'EliteData prepares datasets for analysis and applies suitable statistical methods to produce decision-ready outputs.',
                'description_ar' => 'تجهز إيليت داتا مجموعات البيانات للتحليل وتطبق الأساليب الإحصائية المناسبة لإنتاج مخرجات داعمة للقرار.',
                'icon' => 'data-analysis',
                'is_featured' => true,
                'sort_order' => 30,
            ],
            [
                'slug' => 'market-research',
                'title_en' => 'Market Research',
                'title_ar' => 'أبحاث السوق',
                'short_description_en' => 'Customer, competitor, demand, and pricing research for organizations planning products, programs, or expansion.',
                'short_description_ar' => 'أبحاث العملاء والمنافسين والطلب والتسعير للجهات التي تخطط لمنتجات أو برامج أو توسع.',
                'description_en' => 'Market research services help organizations understand demand, positioning, customer needs, and operating conditions.',
                'description_ar' => 'تساعد خدمات أبحاث السوق المؤسسات على فهم الطلب، والتموضع، واحتياجات العملاء، وظروف العمل.',
                'icon' => 'market-research',
                'is_featured' => true,
                'sort_order' => 40,
            ],
            [
                'slug' => 'feasibility',
                'title_en' => 'Feasibility Studies',
                'title_ar' => 'دراسات الجدوى',
                'short_description_en' => 'Evidence-led feasibility analysis covering market, operational, financial, and implementation considerations.',
                'short_description_ar' => 'تحليل جدوى قائم على الأدلة يغطي السوق والتشغيل والجوانب المالية ومتطلبات التنفيذ.',
                'description_en' => 'Feasibility studies combine research evidence with practical implementation and financial considerations.',
                'description_ar' => 'تجمع دراسات الجدوى بين الأدلة البحثية والاعتبارات العملية والتنفيذية والمالية.',
                'icon' => 'feasibility',
                'is_featured' => true,
                'sort_order' => 50,
            ],
            [
                'slug' => 'monitoring-evaluation',
                'title_en' => 'Monitoring and Evaluation',
                'title_ar' => 'المتابعة والتقييم',
                'short_description_en' => 'Results frameworks, indicators, data collection plans, evaluation tools, and practical learning loops.',
                'short_description_ar' => 'أطر النتائج، والمؤشرات، وخطط جمع البيانات، وأدوات التقييم، وحلقات تعلم عملية.',
                'description_en' => 'Monitoring and evaluation support includes indicator frameworks, evaluation questions, tools, and learning-oriented reporting.',
                'description_ar' => 'يشمل دعم المتابعة والتقييم أطر المؤشرات، وأسئلة التقييم، والأدوات، والتقارير الموجهة للتعلم.',
                'icon' => 'monitoring-evaluation',
                'is_featured' => true,
                'sort_order' => 60,
            ],
            [
                'slug' => 'impact',
                'title_en' => 'Impact Assessment',
                'title_ar' => 'تقييم الأثر',
                'short_description_en' => 'Outcome measurement, attribution-aware analysis, beneficiary feedback, and lessons for future programming.',
                'short_description_ar' => 'قياس النتائج، وتحليل يراعي الإسناد، وتغذية راجعة من المستفيدين، ودروس للبرامج المستقبلية.',
                'description_en' => 'Impact assessment services help teams understand outcomes, contribution, beneficiary experience, and program learning.',
                'description_ar' => 'تساعد خدمات تقييم الأثر الفرق على فهم النتائج، والمساهمة، وتجربة المستفيدين، والتعلم البرامجي.',
                'icon' => 'impact',
                'is_featured' => false,
                'sort_order' => 70,
            ],
            [
                'slug' => 'power-bi',
                'title_en' => 'Power BI Dashboards and Reporting',
                'title_ar' => 'لوحات Power BI والتقارير',
                'short_description_en' => 'Interactive dashboards, metric definitions, reporting workflows, and executive-ready data views.',
                'short_description_ar' => 'لوحات تفاعلية، وتعريفات للمؤشرات، وسير عمل للتقارير، وعروض بيانات جاهزة للإدارة.',
                'description_en' => 'Dashboard and reporting services turn reviewed data into clear views for monitoring, management, and communication.',
                'description_ar' => 'تحول خدمات اللوحات والتقارير البيانات المراجعة إلى عروض واضحة للمتابعة والإدارة والتواصل.',
                'icon' => 'power-bi',
                'is_featured' => false,
                'sort_order' => 80,
            ],
            [
                'slug' => 'research-support',
                'title_en' => 'Scientific Research Support',
                'title_ar' => 'دعم البحث العلمي',
                'short_description_en' => 'Methodology review, instrument design, analysis plans, statistical testing, and publication-oriented outputs.',
                'short_description_ar' => 'مراجعة المنهجية، وتصميم الأدوات، وخطط التحليل، والاختبارات الإحصائية، ومخرجات موجهة للنشر.',
                'description_en' => 'Scientific research support helps researchers strengthen methodology, analysis plans, statistical testing, and reporting.',
                'description_ar' => 'يساعد دعم البحث العلمي الباحثين على تقوية المنهجية وخطط التحليل والاختبارات الإحصائية والتقارير.',
                'icon' => 'research-support',
                'is_featured' => false,
                'sort_order' => 90,
            ],
        ];

        foreach ($services as $service) {
            $this->updateOrCreateService($service);
        }
    }

    private function seedIndustries(): void
    {
        $industries = [
            [
                'slug' => 'businesses-private-sector',
                'title_en' => 'Businesses and Private Sector',
                'title_ar' => 'الشركات والقطاع الخاص',
                'description_en' => 'Market research, customer analysis, feasibility studies, and decision dashboards for business teams.',
                'description_ar' => 'أبحاث السوق، وتحليل العملاء، ودراسات الجدوى، ولوحات دعم القرار لفرق الأعمال.',
                'icon' => 'building',
                'sort_order' => 10,
            ],
            [
                'slug' => 'ngos-development-organizations',
                'title_en' => 'NGOs and Development Organizations',
                'title_ar' => 'المنظمات غير الحكومية والمنظمات التنموية',
                'description_en' => 'Monitoring, evaluation, needs assessment, beneficiary studies, and impact-focused research.',
                'description_ar' => 'المتابعة والتقييم، وتقييم الاحتياجات، ودراسات المستفيدين، والأبحاث الموجهة للأثر.',
                'icon' => 'users',
                'sort_order' => 20,
            ],
            [
                'slug' => 'universities-researchers',
                'title_en' => 'Universities and Researchers',
                'title_ar' => 'الجامعات والباحثون',
                'description_en' => 'Research design, statistical analysis, data cleaning, and academic reporting support.',
                'description_ar' => 'تصميم البحث، والتحليل الإحصائي، وتنظيف البيانات، ودعم التقارير الأكاديمية.',
                'icon' => 'graduation-cap',
                'sort_order' => 30,
            ],
            [
                'slug' => 'healthcare',
                'title_en' => 'Healthcare',
                'title_ar' => 'الرعاية الصحية',
                'description_en' => 'Structured studies, ethical data practices, field instruments, and careful analysis of sensitive topics.',
                'description_ar' => 'دراسات منظمة، وممارسات بيانات أخلاقية، وأدوات ميدانية، وتحليل دقيق للموضوعات الحساسة.',
                'icon' => 'heart-pulse',
                'sort_order' => 40,
            ],
            [
                'slug' => 'education',
                'title_en' => 'Education',
                'title_ar' => 'التعليم',
                'description_en' => 'Learning outcomes, participant feedback, program quality, and evaluation tools.',
                'description_ar' => 'مخرجات التعلم، وآراء المشاركين، وجودة البرامج، وأدوات التقييم.',
                'icon' => 'book-open',
                'sort_order' => 50,
            ],
            [
                'slug' => 'government-public-institutions',
                'title_en' => 'Government and Public Institutions',
                'title_ar' => 'الحكومة والمؤسسات العامة',
                'description_en' => 'Evidence systems, indicator frameworks, survey operations, and implementation learning.',
                'description_ar' => 'أنظمة الأدلة، وأطر المؤشرات، وعمليات المسح، والتعلم من التنفيذ.',
                'icon' => 'landmark',
                'sort_order' => 60,
            ],
            [
                'slug' => 'real-estate',
                'title_en' => 'Real Estate',
                'title_ar' => 'العقارات',
                'description_en' => 'Demand analysis, market studies, pricing research, and feasibility support for real estate decisions.',
                'description_ar' => 'تحليل الطلب، ودراسات السوق، وأبحاث التسعير، ودعم الجدوى لقرارات العقارات.',
                'icon' => 'home',
                'sort_order' => 70,
            ],
            [
                'slug' => 'humanitarian-development-programs',
                'title_en' => 'Humanitarian and Development Programs',
                'title_ar' => 'البرامج الإنسانية والتنموية',
                'description_en' => 'Needs assessments, response monitoring, beneficiary feedback, and program evaluation.',
                'description_ar' => 'تقييم الاحتياجات، ومتابعة الاستجابة، وتغذية راجعة من المستفيدين، وتقييم البرامج.',
                'icon' => 'line-chart',
                'sort_order' => 80,
            ],
        ];

        foreach ($industries as $industry) {
            $this->updateOrCreateIndustry($industry);
        }
    }

    /**
     * In production, existing content is intentionally preserved so manually
     * edited records are not overwritten by a later seed run.
     *
     * @param  array<string, mixed>  $service
     */
    private function updateOrCreateService(array $service): void
    {
        if (app()->isProduction() && Service::query()->where('slug', $service['slug'])->exists()) {
            return;
        }

        Service::updateOrCreate(
            ['slug' => $service['slug']],
            [
                ...$service,
                'image_path' => null,
                'status' => 'published',
                'seo_title_en' => $service['title_en'],
                'seo_title_ar' => $service['title_ar'],
                'seo_description_en' => $service['short_description_en'],
                'seo_description_ar' => $service['short_description_ar'],
            ],
        );
    }

    /**
     * In production, existing content is intentionally preserved so manually
     * edited records are not overwritten by a later seed run.
     *
     * @param  array<string, mixed>  $industry
     */
    private function updateOrCreateIndustry(array $industry): void
    {
        if (app()->isProduction() && Industry::query()->where('slug', $industry['slug'])->exists()) {
            return;
        }

        Industry::updateOrCreate(
            ['slug' => $industry['slug']],
            [
                ...$industry,
                'image_path' => null,
                'status' => 'published',
            ],
        );
    }
}
