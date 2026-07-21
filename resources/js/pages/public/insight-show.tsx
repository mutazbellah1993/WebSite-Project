import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Download } from 'lucide-react';
import { CtaBand } from '@/components/public/cta-band';
import { SeoHead } from '@/components/public/seo-head';
import type { InsightType, LocaleCode, SharedPageProps } from '@/types';

type Localized = Record<LocaleCode, string>;

type PublicInsightItem = {
    type: InsightType;
    slug: string;
    title: Localized;
    excerpt: Localized;
    body?: Localized;
    categories: {
        slug: string;
        name: Localized;
    }[];
    published_at: string | null;
    cover_image_url: string | null;
    download_url: string | null;
};

type Props = {
    insight: PublicInsightItem;
    relatedInsights: PublicInsightItem[];
    isPreview: boolean;
    seo: {
        canonicalUrl?: string;
        alternateUrls?: Partial<Record<LocaleCode, string>>;
        title?: string;
        description?: string;
        imageUrl?: string | null;
        ogType?: 'website' | 'article';
        publishedTime?: string | null;
        structuredData?: Record<string, unknown> | null;
        noindex?: boolean;
    };
};

const typeLabels: Record<InsightType, Localized> = {
    article: { en: 'Article', ar: 'مقال' },
    report: { en: 'Report', ar: 'تقرير' },
    insight: { en: 'Insight', ar: 'رؤية' },
    news: { en: 'News', ar: 'خبر' },
};

function localized(value: Localized, locale: LocaleCode): string {
    return value[locale] ?? value.en;
}

function formatDate(value: string | null, locale: LocaleCode): string {
    if (!value) {
        return locale === 'ar' ? 'منشور' : 'Published';
    }

    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', { dateStyle: 'long' }).format(new Date(value));
}

export default function InsightShow({ insight, relatedInsights, isPreview, seo }: Props) {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;
    const body = localized(insight.body ?? { en: '', ar: '' }, currentLocale);

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: seo.title ?? insight.title.en, ar: seo.title ?? insight.title.ar }}
                description={{
                    en: seo.description ?? insight.excerpt.en,
                    ar: seo.description ?? insight.excerpt.ar,
                }}
                canonicalUrl={seo.canonicalUrl}
                alternateUrls={seo.alternateUrls}
                imageUrl={seo.imageUrl ?? insight.cover_image_url}
                ogType={seo.ogType}
                publishedTime={seo.publishedTime}
                structuredData={seo.structuredData}
                noindex={seo.noindex ?? isPreview}
            />

            <article className="bg-white">
                <header className="bg-[#061B3A] px-5 py-16 text-white sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <Link href="/research-and-insights" className="inline-flex items-center gap-2 text-sm font-bold text-[#22C7CF] hover:text-white">
                            <ArrowLeft className={locale.direction === 'rtl' ? 'size-4 rotate-180' : 'size-4'} />
                            {currentLocale === 'ar' ? 'العودة إلى الأبحاث والرؤى' : 'Back to Research & Insights'}
                        </Link>
                        {isPreview ? (
                            <p className="mt-6 inline-flex rounded-md border border-[#22C7CF]/50 bg-[#22C7CF]/10 px-3 py-1 text-sm font-bold text-[#22C7CF]">
                                {currentLocale === 'ar' ? 'معاينة إدارية' : 'Admin preview'}
                            </p>
                        ) : null}
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-md bg-[#22C7CF] px-2 py-1 text-xs font-extrabold text-[#061B3A]">
                                {localized(typeLabels[insight.type], currentLocale)}
                            </span>
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#D7E4F2]">
                                <CalendarDays className="size-4" />
                                {formatDate(insight.published_at, currentLocale)}
                            </span>
                        </div>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-normal md:text-6xl">{localized(insight.title, currentLocale)}</h1>
                        <p className="mt-6 text-lg leading-8 text-[#D7E4F2]">{localized(insight.excerpt, currentLocale)}</p>
                        {insight.categories.length ? (
                            <div className="mt-8 flex flex-wrap gap-2">
                                {insight.categories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        href={`/research-and-insights?category=${category.slug}`}
                                        className="rounded-md border border-white/20 px-3 py-1.5 text-sm font-bold text-white hover:border-[#22C7CF] hover:text-[#22C7CF]"
                                    >
                                        {localized(category.name, currentLocale)}
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </header>

                <div className="px-5 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div>
                            {insight.cover_image_url ? (
                                <img
                                    src={insight.cover_image_url}
                                    alt=""
                                    className="mb-10 aspect-[16/8] w-full rounded-lg object-cover"
                                />
                            ) : null}
                            <div
                                className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-[#0F172A] prose-a:font-bold prose-a:text-[#0AA6B5] prose-p:leading-8"
                                dangerouslySetInnerHTML={{ __html: body }}
                            />
                        </div>

                        <aside className="space-y-5">
                            {insight.download_url ? (
                                <a
                                    href={insight.download_url}
                                    className="flex items-center justify-center gap-2 rounded-md bg-[#082D67] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0AA6B5]"
                                >
                                    <Download className="size-4" />
                                    {currentLocale === 'ar' ? 'تحميل التقرير PDF' : 'Download report PDF'}
                                </a>
                            ) : null}
                            <div className="rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-5">
                                <h2 className="text-lg font-extrabold text-[#0F172A]">
                                    {currentLocale === 'ar' ? 'تصنيفات المحتوى' : 'Content Categories'}
                                </h2>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {insight.categories.length ? (
                                        insight.categories.map((category) => (
                                            <Link
                                                key={category.slug}
                                                href={`/research-and-insights?category=${category.slug}`}
                                                className="rounded-md bg-white px-3 py-1.5 text-sm font-bold text-[#475569] hover:text-[#0AA6B5]"
                                            >
                                                {localized(category.name, currentLocale)}
                                            </Link>
                                        ))
                                    ) : (
                                        <span className="text-sm text-[#475569]">{currentLocale === 'ar' ? 'غير مصنف' : 'Uncategorized'}</span>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            {relatedInsights.length ? (
                <section className="bg-[#F4F7FA] px-5 py-14 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="text-3xl font-extrabold text-[#0F172A]">{currentLocale === 'ar' ? 'محتوى مرتبط' : 'Related content'}</h2>
                        <div className="mt-8 grid gap-5 md:grid-cols-3">
                            {relatedInsights.map((item) => (
                                <Link key={item.slug} href={`/research-and-insights/${item.slug}`} className="rounded-lg border border-[#D8E2EC] bg-white p-5 hover:border-[#0AA6B5]">
                                    <span className="text-xs font-bold uppercase text-[#0AA6B5]">{localized(typeLabels[item.type], currentLocale)}</span>
                                    <h3 className="mt-3 text-lg font-extrabold text-[#0F172A]">{localized(item.title, currentLocale)}</h3>
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#475569]">{localized(item.excerpt, currentLocale)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Have a research question to clarify?', ar: 'هل لديك سؤال بحثي يحتاج إلى توضيح؟' }}
                description={{
                    en: 'Share the decision, audience, and available data so EliteData can recommend the right research approach.',
                    ar: 'شارك القرار والجمهور والبيانات المتاحة ليقترح فريق EliteData النهج البحثي المناسب.',
                }}
                action={{ href: '/request-a-study', label: { en: 'Request a study', ar: 'اطلب دراسة' } }}
            />
        </>
    );
}
