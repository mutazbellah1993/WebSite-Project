import { usePage } from '@inertiajs/react';
import { BookOpenCheck, FileSearch, Lightbulb } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { insights, text } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

const icons = [BookOpenCheck, FileSearch, Lightbulb];

export default function Insights() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Research and Insights', ar: 'الأبحاث والرؤى' }}
                description={{
                    en: 'EliteData research and insights page for methodology notes, market and sector briefs, and monitoring and evaluation guidance.',
                    ar: 'صفحة الأبحاث والرؤى من إيليت داتا للملاحظات المنهجية وموجزات السوق والقطاعات وإرشادات المتابعة والتقييم.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Research and insights', ar: 'الأبحاث والرؤى' }}
                title={{ en: 'Practical thinking for better data work.', ar: 'أفكار عملية لتحسين العمل بالبيانات.' }}
                description={{
                    en: 'This section is prepared for future research notes and guidance. It is structured now without inventing publications, client stories, or unsupported claims.',
                    ar: 'تم إعداد هذا القسم لاستضافة ملاحظات وإرشادات بحثية مستقبلية، مع تجنب اختراع منشورات أو قصص عملاء أو ادعاءات غير مدعومة.',
                }}
                primaryAction={{ href: '/contact-us', label: { en: 'Suggest a topic', ar: 'اقترح موضوعا' } }}
            />

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Insight themes', ar: 'محاور الرؤى' }}
                        title={{ en: 'Useful knowledge areas for organizations', ar: 'مجالات معرفية مفيدة للمؤسسات' }}
                        description={{
                            en: 'Future updates can publish original material under these themes once research content is approved.',
                            ar: 'يمكن نشر مواد أصلية ضمن هذه المحاور مستقبلا بعد اعتماد المحتوى البحثي.',
                        }}
                    />
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {insights.map((insight, index) => {
                            const Icon = icons[index] ?? BookOpenCheck;

                            return (
                                <article key={insight.title.en} className="rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-6">
                                    <Icon className="mb-5 size-7 text-[#0AA6B5]" aria-hidden="true" />
                                    <h3 className="text-lg font-bold text-[#0F172A]">{text(insight.title, currentLocale)}</h3>
                                    <p className="mt-3 text-sm font-normal leading-6 text-[#475569]">{text(insight.description, currentLocale)}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#F4F7FA] px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Editorial standard', ar: 'معيار النشر' }}
                        title={{ en: 'No unsupported claims', ar: 'لا ادعاءات غير مدعومة' }}
                        description={{
                            en: 'Research content should identify its scope, source context, methodology, limitations, and intended use before publication.',
                            ar: 'يجب أن يوضح المحتوى البحثي نطاقه وسياق مصادره ومنهجيته وقيوده والاستخدام المقصود قبل النشر.',
                        }}
                    />
                    <div className="rounded-lg border border-[#D8E2EC] bg-white p-6">
                        <ul className="grid gap-4 text-sm font-normal leading-6 text-[#475569]">
                            {(currentLocale === 'ar'
                                ? ['توضيح نطاق التحليل ومصدر البيانات.', 'فصل النتائج عن التوصيات بوضوح.', 'ذكر القيود والتحفظات عند الحاجة.', 'تجنب الأرقام أو الادعاءات غير الموثقة.']
                                : ['State the analysis scope and data source context.', 'Separate findings from recommendations clearly.', 'Name limitations and caveats when needed.', 'Avoid undocumented figures or unsupported claims.']
                            ).map((item) => (
                                <li key={item} className="rounded-md bg-[#F4F7FA] p-4 font-medium">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Need a brief, note, or evidence summary?', ar: 'هل تحتاج إلى موجز أو مذكرة أو ملخص أدلة؟' }}
                description={{
                    en: 'EliteData can help structure a research note or evidence brief for internal teams, donors, management, or academic audiences.',
                    ar: 'يمكن لإيليت داتا مساعدتك في بناء مذكرة بحثية أو موجز أدلة للفرق الداخلية أو الجهات المانحة أو الإدارة أو الجمهور الأكاديمي.',
                }}
                action={{ href: '/request-a-study', label: { en: 'Request support', ar: 'اطلب الدعم' } }}
            />
        </>
    );
}
