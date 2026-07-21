import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { DataAssuranceVisual } from '@/components/public/data-assurance-visual';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { ServiceCard } from '@/components/public/service-card';
import { industries as staticIndustries, methodology, services as staticServices, text } from '@/lib/public-content';
import type { IndustryItem, ServiceItem } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

type Props = {
    services: ServiceItem[];
    industries: IndustryItem[];
    hasPublishedServices: boolean;
    hasPublishedIndustries: boolean;
};

export default function Home({ services, industries, hasPublishedServices, hasPublishedIndustries }: Props) {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;
    const displayedServices = hasPublishedServices ? services : staticServices.slice(0, 6);
    const displayedIndustries = hasPublishedIndustries ? industries : staticIndustries;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Research, Statistics & Data Analytics', ar: 'البحوث والإحصاء وتحليل البيانات' }}
                description={{
                    en: 'EliteData provides statistical studies, survey design, data analysis, market research, monitoring and evaluation, impact assessment, and dashboards for organizations in Syria.',
                    ar: 'تقدم إيليت داتا الدراسات الإحصائية، وتصميم الاستبيانات، وتحليل البيانات، وأبحاث السوق، والمتابعة والتقييم، وتقييم الأثر، ولوحات البيانات للمنظمات والمؤسسات في سوريا.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'ELITEDATA', ar: 'إيليت داتا' }}
                title={{
                    en: 'Research and analytics for clearer institutional decisions.',
                    ar: 'بحوث وتحليلات تساعد المؤسسات على اتخاذ قرارات أوضح.',
                }}
                description={{
                    en: 'EliteData supports organizations, businesses, NGOs, researchers, universities, and institutions with rigorous statistical research and decision-ready data products.',
                    ar: 'تدعم إيليت داتا المنظمات والشركات والباحثين والجامعات والمؤسسات ببحوث إحصائية دقيقة ومخرجات بيانات جاهزة لدعم القرار.',
                }}
                primaryAction={{ href: '/request-a-study', label: { en: 'Request a Study', ar: 'طلب دراسة' } }}
                secondaryAction={{ href: '/services', label: { en: 'Explore Services', ar: 'استعراض الخدمات' } }}
                visual={<DataAssuranceVisual locale={currentLocale} />}
            />

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Core services', ar: 'الخدمات الرئيسية' }}
                        title={{ en: 'From field data to decision-ready insight', ar: 'من البيانات الميدانية إلى رؤى جاهزة للقرار' }}
                        description={{
                            en: 'A focused service portfolio for research, evaluation, market understanding, and reporting needs.',
                            ar: 'محفظة خدمات مركزة لاحتياجات البحث والتقييم وفهم السوق وإعداد التقارير.',
                        }}
                    />
                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {displayedServices.map((service) => (
                            <ServiceCard key={service.key} service={service} locale={currentLocale} />
                        ))}
                    </div>
                    <Link
                        href="/services"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5] transition hover:text-[#082D67]"
                    >
                        {currentLocale === 'ar' ? 'عرض جميع الخدمات' : 'View all services'}
                        <ArrowRight className={locale.direction === 'rtl' ? 'size-4 rotate-180' : 'size-4'} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <section className="bg-[#F4F7FA] px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Methodology', ar: 'المنهجية' }}
                        title={{ en: 'A disciplined research workflow', ar: 'سير عمل بحثي منضبط' }}
                        description={{
                            en: 'Every engagement is structured around the question being answered, the quality of the data, and the decisions the findings need to support.',
                            ar: 'يتم تنظيم كل مشروع حول السؤال المطلوب إجابته، وجودة البيانات، والقرارات التي يجب أن تدعمها النتائج.',
                        }}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        {methodology.map((step) => (
                            <article key={step.title.en} className="rounded-lg border border-[#D8E2EC] bg-white p-6">
                                <CheckCircle2 className="mb-4 size-6 text-[#0AA6B5]" aria-hidden="true" />
                                <h3 className="font-bold text-[#0F172A]">{text(step.title, currentLocale)}</h3>
                                <p className="mt-3 text-sm font-normal leading-6 text-[#475569]">{text(step.description, currentLocale)}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading
                        locale={currentLocale}
                        align="center"
                        eyebrow={{ en: 'Sectors served', ar: 'القطاعات التي نخدمها' }}
                        title={{ en: 'Built for organizations working in Syria', ar: 'مصمم للمؤسسات العاملة في سوريا' }}
                        description={{
                            en: 'EliteData supports research and analytical work across development, business, academic, institutional, education, health, and social programs.',
                            ar: 'تدعم إيليت داتا العمل البحثي والتحليلي في البرامج التنموية والتجارية والأكاديمية والمؤسسية والتعليمية والصحية والاجتماعية.',
                        }}
                    />
                    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {displayedIndustries.map((industry) => (
                            <article key={industry.title.en} className="rounded-lg bg-[#F4F7FA] p-6 ring-1 ring-[#D8E2EC]">
                                <h3 className="font-bold text-[#0F172A]">{text(industry.title, currentLocale)}</h3>
                                <p className="mt-3 text-sm font-normal leading-6 text-[#475569]">{text(industry.description, currentLocale)}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Need a study, evaluation, dashboard, or analysis plan?', ar: 'هل تحتاج إلى دراسة أو تقييم أو لوحة بيانات أو خطة تحليل؟' }}
                description={{
                    en: 'Share the decision you need to support, the audience, and the data you already have. EliteData will help frame the next research step.',
                    ar: 'شاركنا القرار الذي تحتاج إلى دعمه، والجمهور المستهدف، والبيانات المتوفرة لديك. ستساعدك إيليت داتا في تحديد الخطوة البحثية التالية.',
                }}
                action={{ href: '/request-a-study', label: { en: 'Start the request', ar: 'ابدأ الطلب' } }}
            />
        </>
    );
}
