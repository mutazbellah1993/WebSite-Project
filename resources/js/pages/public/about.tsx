import { usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { methodology, text } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

const principles = [
    {
        title: { en: 'Methodological clarity', ar: 'وضوح منهجي' },
        description: {
            en: 'Research questions, sampling choices, assumptions, and limitations are made explicit from the start.',
            ar: 'يتم توضيح أسئلة البحث وخيارات العينة والافتراضات والقيود منذ البداية.',
        },
    },
    {
        title: { en: 'Data quality and ethics', ar: 'جودة البيانات والأخلاقيات' },
        description: {
            en: 'Data handling is designed around accuracy, privacy, responsible collection, and transparent documentation.',
            ar: 'يتم تصميم التعامل مع البيانات حول الدقة والخصوصية والجمع المسؤول والتوثيق الشفاف.',
        },
    },
    {
        title: { en: 'Decision-ready reporting', ar: 'تقارير جاهزة للقرار' },
        description: {
            en: 'Outputs are written for the people who need to act on the findings, not only for technical review.',
            ar: 'تكتب المخرجات للأشخاص الذين يحتاجون إلى العمل بناء على النتائج، وليس للمراجعة الفنية فقط.',
        },
    },
];

export default function About() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'About Us', ar: 'من نحن' }}
                description={{
                    en: 'Learn about EliteData, a statistical research and data analytics company serving organizations, businesses, NGOs, researchers, universities, and institutions in Syria.',
                    ar: 'تعرف على إيليت داتا، شركة بحث إحصائي وتحليل بيانات تخدم المنظمات والشركات والباحثين والجامعات والمؤسسات في سوريا.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'About ELITEDATA', ar: 'عن إيليت داتا' }}
                title={{ en: 'Statistical research with practical institutional value.', ar: 'بحث إحصائي بقيمة مؤسسية عملية.' }}
                description={{
                    en: 'EliteData helps teams ask better research questions, collect stronger evidence, analyze it responsibly, and communicate findings clearly.',
                    ar: 'تساعد إيليت داتا الفرق على طرح أسئلة بحثية أفضل، وجمع أدلة أقوى، وتحليلها بمسؤولية، وتوصيل النتائج بوضوح.',
                }}
                primaryAction={{ href: '/request-a-study', label: { en: 'Request a Study', ar: 'طلب دراسة' } }}
            />

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Who we serve', ar: 'من نخدم' }}
                        title={{ en: 'Research support for complex local questions', ar: 'دعم بحثي للأسئلة المحلية المعقدة' }}
                        description={{
                            en: 'The company primarily serves organizations, businesses, NGOs, researchers, universities, and institutions in Syria that need reliable evidence for programs, markets, operations, and policy-facing work.',
                            ar: 'تخدم الشركة بشكل رئيسي المنظمات والشركات والمنظمات غير الحكومية والباحثين والجامعات والمؤسسات في سوريا ممن يحتاجون إلى أدلة موثوقة للبرامج والأسواق والعمليات والعمل المؤسسي.',
                        }}
                    />
                    <div className="grid gap-4">
                        {principles.map((principle) => (
                            <article key={principle.title.en} className="rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-6">
                                <CheckCircle2 className="mb-4 size-6 text-[#0AA6B5]" aria-hidden="true" />
                                <h3 className="font-bold text-[#0F172A]">{text(principle.title, currentLocale)}</h3>
                                <p className="mt-3 text-sm font-normal leading-6 text-[#475569]">{text(principle.description, currentLocale)}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#F4F7FA] px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading
                        locale={currentLocale}
                        align="center"
                        eyebrow={{ en: 'Working approach', ar: 'طريقة العمل' }}
                        title={{ en: 'A clear path from question to finding', ar: 'مسار واضح من السؤال إلى النتيجة' }}
                    />
                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {methodology.map((step) => (
                            <article key={step.title.en} className="rounded-lg bg-white p-6 ring-1 ring-[#D8E2EC]">
                                <h3 className="font-bold text-[#0F172A]">{text(step.title, currentLocale)}</h3>
                                <p className="mt-3 text-sm font-normal leading-6 text-[#475569]">{text(step.description, currentLocale)}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Have a research question to clarify?', ar: 'هل لديك سؤال بحثي يحتاج إلى توضيح؟' }}
                description={{
                    en: 'EliteData can help translate the question into an appropriate study design, data plan, and reporting approach.',
                    ar: 'يمكن لإيليت داتا مساعدتك في تحويل السؤال إلى تصميم دراسة وخطة بيانات ونهج تقارير مناسب.',
                }}
                action={{ href: '/contact-us', label: { en: 'Contact the team', ar: 'تواصل مع الفريق' } }}
            />
        </>
    );
}
