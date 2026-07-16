import { usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { ServiceCard } from '@/components/public/service-card';
import { services, text } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

const delivery = [
    { en: 'Research scope and method selection', ar: 'تحديد نطاق البحث واختيار المنهجية' },
    { en: 'Data collection and quality assurance plan', ar: 'خطة جمع البيانات وضمان الجودة' },
    { en: 'Statistical analysis and interpretation', ar: 'التحليل الإحصائي وتفسير النتائج' },
    { en: 'Reports, dashboards, and presentation materials', ar: 'تقارير ولوحات بيانات ومواد عرض' },
];

export default function Services() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Services', ar: 'الخدمات' }}
                description={{
                    en: 'Explore EliteData services: statistical consulting, surveys, data analysis, market research, feasibility studies, M&E, impact assessment, Power BI dashboards, and scientific research support.',
                    ar: 'استعرض خدمات إيليت داتا: الاستشارات الإحصائية، المسوح، تحليل البيانات، أبحاث السوق، دراسات الجدوى، المتابعة والتقييم، تقييم الأثر، لوحات Power BI، ودعم البحث العلمي.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Services', ar: 'الخدمات' }}
                title={{ en: 'Research services for the full evidence cycle.', ar: 'خدمات بحثية تغطي دورة الأدلة كاملة.' }}
                description={{
                    en: 'From survey instruments and fieldwork to statistical analysis and dashboards, EliteData structures each service around the decision the evidence must support.',
                    ar: 'من أدوات المسح والعمل الميداني إلى التحليل الإحصائي ولوحات البيانات، تنظم إيليت داتا كل خدمة حول القرار الذي يجب أن تدعمه الأدلة.',
                }}
                primaryAction={{ href: '/request-a-study', label: { en: 'Request a Study', ar: 'طلب دراسة' } }}
            />

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'What we do', ar: 'ما نقدمه' }}
                        title={{ en: 'Specialized research and analytics services', ar: 'خدمات متخصصة في البحث والتحليل' }}
                    />
                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <ServiceCard key={service.key} service={service} locale={currentLocale} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#F4F7FA] px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Delivery model', ar: 'نموذج التنفيذ' }}
                        title={{ en: 'Structured around your decision context', ar: 'مصمم حول سياق قرارك' }}
                        description={{
                            en: 'Each engagement can be narrow and technical or end-to-end, depending on the internal capacity, available data, and reporting needs of the organization.',
                            ar: 'يمكن أن يكون كل مشروع محدودا وفنيا أو شاملا من البداية إلى النهاية، حسب قدرات المؤسسة وبياناتها المتاحة واحتياجات التقارير.',
                        }}
                    />
                    <div className="rounded-lg border border-[#D8E2EC] bg-white p-6">
                        <ul className="grid gap-4">
                            {delivery.map((item) => (
                                <li key={item.en} className="flex gap-3">
                                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#0AA6B5]" aria-hidden="true" />
                                    <span className="text-sm font-medium text-[#475569]">{text(item, currentLocale)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Not sure which service fits?', ar: 'لست متأكدا من الخدمة المناسبة؟' }}
                description={{
                    en: 'Describe your question, timeline, available data, and intended audience. The first step is choosing the right research shape.',
                    ar: 'صف سؤالك والجدول الزمني والبيانات المتاحة والجمهور المستهدف. الخطوة الأولى هي اختيار الشكل البحثي المناسب.',
                }}
                action={{ href: '/request-a-study', label: { en: 'Request guidance', ar: 'اطلب التوجيه' } }}
            />
        </>
    );
}
