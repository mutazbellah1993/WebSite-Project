import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays, LineChart } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { PageHero } from '@/components/public/page-hero';
import { SeoHead } from '@/components/public/seo-head';
import type { LocaleCode, SharedPageProps } from '@/types';

type Localized = Record<LocaleCode, string>;

type ProjectListItem = {
    slug: string;
    title: Localized;
    summary: Localized;
    cover_image_url: string | null;
    completion_date: string | null;
    is_featured: boolean;
    has_live_url: boolean;
};

type Props = {
    projects: ProjectListItem[];
    seo: {
        canonicalUrl?: string;
        alternateUrls?: Partial<Record<LocaleCode, string>>;
        title?: string;
        description?: string;
    };
};

function localized(value: Localized, locale: LocaleCode): string {
    return value[locale] ?? value.en;
}

function formatDate(value: string | null, locale: LocaleCode): string | null {
    if (!value) {
        return null;
    }

    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'long' }).format(new Date(value));
}

export default function Projects({ projects, seo }: Props) {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: seo.title ?? 'Analytical Projects', ar: seo.title ?? 'المشاريع التحليلية' }}
                description={{
                    en: seo.description ?? 'Analytical projects by EliteData.',
                    ar: seo.description ?? 'مشاريع تحليلية من EliteData.',
                }}
                canonicalUrl={seo.canonicalUrl}
                alternateUrls={seo.alternateUrls}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Analytical projects', ar: 'المشاريع التحليلية' }}
                title={{ en: 'Data work you can explore, not just read.', ar: 'عمل على البيانات يمكنك استكشافه لا قراءته فقط.' }}
                description={{
                    en: 'Interactive dashboards and studies built on documented data, with the method, the limits and the findings stated openly.',
                    ar: 'لوحات معلومات ودراسات تفاعلية مبنية على بيانات موثقة، مع بيان المنهجية والحدود والنتائج بوضوح.',
                }}
                primaryAction={{ href: '/request-a-study', label: { en: 'Request a study', ar: 'اطلب دراسة' } }}
            />

            <section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {projects.length === 0 ? (
                        <p className="rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-8 text-center text-[#475569]">
                            {currentLocale === 'ar' ? 'لا توجد مشاريع منشورة حاليًا.' : 'No projects are published yet.'}
                        </p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {projects.map((project) => {
                                const date = formatDate(project.completion_date, currentLocale);

                                return (
                                    <Link
                                        key={project.slug}
                                        href={`/projects/${project.slug}`}
                                        className="group flex flex-col overflow-hidden rounded-lg border border-[#D8E2EC] bg-white transition hover:border-[#0AA6B5] hover:shadow-lg hover:shadow-[#061B3A]/10"
                                    >
                                        {project.cover_image_url ? (
                                            <img
                                                src={project.cover_image_url}
                                                alt=""
                                                loading="lazy"
                                                className="aspect-[16/9] w-full border-b border-[#D8E2EC] object-cover object-top"
                                            />
                                        ) : null}
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                                                {project.has_live_url ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E7F8FA] px-2 py-1 text-[#0AA6B5]">
                                                        <LineChart className="size-3.5" aria-hidden="true" />
                                                        {currentLocale === 'ar' ? 'لوحة تفاعلية' : 'Live dashboard'}
                                                    </span>
                                                ) : null}
                                                {date ? (
                                                    <span className="inline-flex items-center gap-1.5 text-[#475569]">
                                                        <CalendarDays className="size-3.5" aria-hidden="true" />
                                                        {date}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <h2 className="mt-4 text-2xl font-extrabold text-[#0F172A]">{localized(project.title, currentLocale)}</h2>
                                            <p className="mt-3 flex-1 leading-7 text-[#475569]">{localized(project.summary, currentLocale)}</p>
                                            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#082D67] group-hover:text-[#0AA6B5]">
                                                {currentLocale === 'ar' ? 'عرض المشروع' : 'View project'}
                                                <ArrowRight className={locale.direction === 'rtl' ? 'size-4 rotate-180' : 'size-4'} aria-hidden="true" />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Need an analysis like this for your data?', ar: 'هل تحتاج تحليلًا كهذا لبياناتك؟' }}
                description={{
                    en: 'Tell us the decision you need to make and the data you hold, and we will propose the right analytical approach.',
                    ar: 'أخبرنا بالقرار الذي تريد اتخاذه وبالبيانات التي لديك، وسنقترح النهج التحليلي المناسب.',
                }}
                action={{ href: '/request-a-study', label: { en: 'Request a study', ar: 'اطلب دراسة' } }}
            />
        </>
    );
}
