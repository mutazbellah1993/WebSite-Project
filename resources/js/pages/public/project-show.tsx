import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { SeoHead } from '@/components/public/seo-head';
import type { LocaleCode, SharedPageProps } from '@/types';

type Localized = Record<LocaleCode, string>;

type Project = {
    slug: string;
    title: Localized;
    summary: Localized;
    cover_image_url: string | null;
    completion_date: string | null;
    live_url: string | null;
    challenge: Localized;
    methodology: Localized;
    solution: Localized;
    results: Localized;
};

type Props = {
    project: Project;
    seo: {
        canonicalUrl?: string;
        alternateUrls?: Partial<Record<LocaleCode, string>>;
        title?: string;
        description?: string;
        imageUrl?: string | null;
        ogType?: 'website' | 'article';
        publishedTime?: string | null;
        structuredData?: Record<string, unknown> | null;
    };
};

function localized(value: Localized, locale: LocaleCode): string {
    return value[locale] ?? value.en;
}

/** Opens the dashboard in the language the visitor is reading the site in. */
function dashboardHref(url: string, locale: LocaleCode): string {
    try {
        const target = new URL(url);
        target.searchParams.set('lang', locale);

        return target.toString();
    } catch {
        return url;
    }
}

const sectionTitles: Record<'challenge' | 'methodology' | 'solution' | 'results', Localized> = {
    challenge: { en: 'The challenge', ar: 'التحدي' },
    methodology: { en: 'Method', ar: 'المنهجية' },
    solution: { en: 'What we built', ar: 'ما أنجزناه' },
    results: { en: 'Findings and results', ar: 'النتائج' },
};

export default function ProjectShow({ project, seo }: Props) {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;
    const date = project.completion_date
        ? new Intl.DateTimeFormat(currentLocale === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'long' }).format(new Date(project.completion_date))
        : null;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: seo.title ?? project.title.en, ar: seo.title ?? project.title.ar }}
                description={{ en: seo.description ?? project.summary.en, ar: seo.description ?? project.summary.ar }}
                canonicalUrl={seo.canonicalUrl}
                alternateUrls={seo.alternateUrls}
                imageUrl={seo.imageUrl ?? project.cover_image_url}
                ogType={seo.ogType}
                publishedTime={seo.publishedTime}
                structuredData={seo.structuredData}
            />

            <article className="bg-white">
                <header className="bg-[#061B3A] px-5 py-16 text-white sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#22C7CF] hover:text-white">
                            <ArrowLeft className={locale.direction === 'rtl' ? 'size-4 rotate-180' : 'size-4'} />
                            {currentLocale === 'ar' ? 'العودة إلى المشاريع' : 'Back to projects'}
                        </Link>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-md bg-[#22C7CF] px-2 py-1 text-xs font-extrabold text-[#061B3A]">
                                {currentLocale === 'ar' ? 'مشروع تحليلي' : 'Analytical project'}
                            </span>
                            {date ? (
                                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#D7E4F2]">
                                    <CalendarDays className="size-4" aria-hidden="true" />
                                    {date}
                                </span>
                            ) : null}
                        </div>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-normal md:text-5xl">{localized(project.title, currentLocale)}</h1>
                        <p className="mt-6 text-lg leading-8 text-[#D7E4F2]">{localized(project.summary, currentLocale)}</p>
                        {project.live_url ? (
                            <div className="mt-8">
                                <a
                                    href={dashboardHref(project.live_url, currentLocale)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#22C7CF] px-5 py-3 text-sm font-bold text-[#061B3A] transition hover:bg-white focus:outline-none focus:ring-3 focus:ring-[#22C7CF]/40"
                                >
                                    {currentLocale === 'ar' ? 'افتح اللوحة التفاعلية' : 'Open the live dashboard'}
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </a>
                            </div>
                        ) : null}
                    </div>
                </header>

                <div className="px-5 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        {project.cover_image_url ? (
                            <figure className="mb-12">
                                <img
                                    src={project.cover_image_url}
                                    alt={currentLocale === 'ar' ? 'لقطة من اللوحة التفاعلية' : 'Screenshot of the interactive dashboard'}
                                    className="w-full rounded-lg border border-[#D8E2EC] shadow-lg shadow-[#061B3A]/10"
                                />
                            </figure>
                        ) : null}

                        {(['challenge', 'methodology', 'solution', 'results'] as const).map((key) =>
                            project[key].en || project[key].ar ? (
                                <section key={key} className="mb-12">
                                    <h2 className="mb-4 text-3xl font-extrabold text-[#0F172A]">{localized(sectionTitles[key], currentLocale)}</h2>
                                    <div
                                        className="prose prose-slate max-w-none prose-p:leading-8 prose-li:leading-8 prose-a:font-bold prose-a:text-[#0AA6B5]"
                                        dangerouslySetInnerHTML={{ __html: localized(project[key], currentLocale) }}
                                    />
                                </section>
                            ) : null,
                        )}

                        {project.live_url ? (
                            <div className="rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-6 text-center">
                                <p className="text-lg font-extrabold text-[#0F172A]">
                                    {currentLocale === 'ar' ? 'استكشف البيانات بنفسك' : 'Explore the data yourself'}
                                </p>
                                <p className="mx-auto mt-2 max-w-xl text-[#475569]">
                                    {currentLocale === 'ar'
                                        ? 'غيّر المحافظة أو القطاع أو السنة وشاهد كل الرسوم تتفاعل.'
                                        : 'Change the governorate, sector or year and watch every chart respond.'}
                                </p>
                                <div className="mt-5 flex justify-center">
                                    <a
                                        href={dashboardHref(project.live_url, currentLocale)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-md bg-[#082D67] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0AA6B5]"
                                    >
                                        {currentLocale === 'ar' ? 'افتح اللوحة التفاعلية' : 'Open the live dashboard'}
                                        <ArrowUpRight className="size-4" aria-hidden="true" />
                                    </a>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </article>

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
