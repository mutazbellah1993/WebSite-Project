import { usePage } from '@inertiajs/react';
import { Building2, GraduationCap, HeartPulse, Landmark, LineChart, UsersRound } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { industries, text } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

const icons = [UsersRound, Building2, GraduationCap, Landmark, LineChart, HeartPulse];

export default function Industries() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Industries', ar: 'القطاعات' }}
                description={{
                    en: 'EliteData serves NGOs, businesses, universities, researchers, public programs, education initiatives, health programs, and social research teams in Syria.',
                    ar: 'تخدم إيليت داتا المنظمات والشركات والجامعات والباحثين والبرامج العامة ومبادرات التعليم والبرامج الصحية وفرق البحث الاجتماعي في سوريا.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Industries', ar: 'القطاعات' }}
                title={{ en: 'Evidence support across organizational contexts.', ar: 'دعم الأدلة عبر سياقات مؤسسية متعددة.' }}
                description={{
                    en: 'Different sectors need different evidence. EliteData adapts the study design, data collection, analysis, and reporting format to the operating context.',
                    ar: 'تحتاج القطاعات المختلفة إلى أدلة مختلفة. تكيف إيليت داتا تصميم الدراسة وجمع البيانات والتحليل وشكل التقارير مع سياق العمل.',
                }}
                primaryAction={{ href: '/contact-us', label: { en: 'Discuss your sector', ar: 'ناقش قطاعك' } }}
            />

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Sectors', ar: 'القطاعات' }}
                        title={{ en: 'Research for programs, markets, and institutions', ar: 'بحث للبرامج والأسواق والمؤسسات' }}
                    />
                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {industries.map((industry, index) => {
                            const Icon = icons[index] ?? Building2;

                            return (
                                <article key={industry.title.en} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                                    <div className="mb-5 flex size-12 items-center justify-center rounded-md bg-white text-teal-700 ring-1 ring-slate-200">
                                        <Icon className="size-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-950">{text(industry.title, currentLocale)}</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{text(industry.description, currentLocale)}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading
                        locale={currentLocale}
                        align="center"
                        eyebrow={{ en: 'Evidence needs', ar: 'احتياجات الأدلة' }}
                        title={{ en: 'Common questions EliteData helps answer', ar: 'أسئلة شائعة تساعد إيليت داتا في الإجابة عنها' }}
                    />
                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {[
                            {
                                en: 'What data is needed to make this decision responsibly?',
                                ar: 'ما البيانات المطلوبة لاتخاذ هذا القرار بمسؤولية؟',
                            },
                            {
                                en: 'How should we measure progress, outcomes, or market response?',
                                ar: 'كيف نقيس التقدم أو النتائج أو استجابة السوق؟',
                            },
                            {
                                en: 'How can findings be communicated clearly to decision-makers?',
                                ar: 'كيف يمكن إيصال النتائج بوضوح لصناع القرار؟',
                            },
                        ].map((question) => (
                            <article key={question.en} className="rounded-lg bg-white p-6 text-base font-semibold leading-7 text-slate-800 ring-1 ring-slate-200">
                                {text(question, currentLocale)}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Bring sector context into the study design.', ar: 'اجعل سياق القطاع جزءا من تصميم الدراسة.' }}
                description={{
                    en: 'The strongest research plans reflect the realities of the sector, field access, audience, and intended decision.',
                    ar: 'تعكس أقوى خطط البحث واقع القطاع والوصول الميداني والجمهور والقرار المقصود.',
                }}
                action={{ href: '/request-a-study', label: { en: 'Plan a study', ar: 'خطط لدراسة' } }}
            />
        </>
    );
}
