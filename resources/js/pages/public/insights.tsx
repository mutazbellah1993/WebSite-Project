import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Download, FileText, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { CtaBand } from '@/components/public/cta-band';
import { PageHero } from '@/components/public/page-hero';
import { SeoHead } from '@/components/public/seo-head';
import { Button } from '@/components/ui/button';
import type { InsightType, LocaleCode, Paginated, SharedPageProps } from '@/types';

type Localized = Record<LocaleCode, string>;

type PublicInsightItem = {
    type: InsightType;
    slug: string;
    title: Localized;
    excerpt: Localized;
    categories: {
        slug: string;
        name: Localized;
    }[];
    published_at: string | null;
    cover_image_url: string | null;
    download_url: string | null;
};

type PublicCategory = {
    slug: string;
    name: Localized;
    description: Localized;
    published_insights_count: number;
};

type Props = {
    insights: Paginated<PublicInsightItem>;
    categories: PublicCategory[];
    types: InsightType[];
    filters: {
        type: string;
        category: string;
    };
    seo: {
        canonicalUrl?: string;
        alternateUrls?: Partial<Record<LocaleCode, string>>;
        title?: string;
        description?: string;
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

    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', { dateStyle: 'medium' }).format(new Date(value));
}

export default function Insights({ insights, categories, types, filters, seo }: Props) {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;
    const [type, setType] = useState(filters.type);
    const [category, setCategory] = useState(filters.category);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get('/research-and-insights', { type, category }, { preserveState: true, replace: true });
    }

    function resetFilters() {
        setType('');
        setCategory('');
        router.get('/research-and-insights', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: seo.title ?? 'Research and Insights', ar: seo.title ?? 'الأبحاث والرؤى' }}
                description={{
                    en: seo.description ?? 'Published EliteData research, insights, reports, and notes.',
                    ar: seo.description ?? 'أبحاث ورؤى وتقارير EliteData المنشورة.',
                }}
                canonicalUrl={seo.canonicalUrl}
                alternateUrls={seo.alternateUrls}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Research and insights', ar: 'الأبحاث والرؤى' }}
                title={{ en: 'Published thinking for better data work.', ar: 'معرفة منشورة لتحسين العمل بالبيانات.' }}
                description={{
                    en: 'Browse approved articles, reports, insight notes, and news from EliteData without unsupported claims or invented publications.',
                    ar: 'تصفح المقالات والتقارير والرؤى والأخبار المعتمدة من EliteData دون ادعاءات غير مدعومة أو منشورات مخترعة.',
                }}
                primaryAction={{ href: '/request-a-study', label: { en: 'Request support', ar: 'اطلب الدعم' } }}
            />

            <section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <form onSubmit={submit} className="grid gap-3 rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-4 md:grid-cols-[1fr_1fr_auto_auto]">
                        <label className="grid gap-2">
                            <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'نوع المحتوى' : 'Content type'}</span>
                            <select
                                value={type}
                                onChange={(event) => setType(event.target.value)}
                                className="h-11 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                            >
                                <option value="">{currentLocale === 'ar' ? 'كل الأنواع' : 'All types'}</option>
                                {types.map((item) => (
                                    <option key={item} value={item}>
                                        {localized(typeLabels[item], currentLocale)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="grid gap-2">
                            <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'التصنيف' : 'Category'}</span>
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="h-11 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                            >
                                <option value="">{currentLocale === 'ar' ? 'كل التصنيفات' : 'All categories'}</option>
                                {categories.map((item) => (
                                    <option key={item.slug} value={item.slug}>
                                        {localized(item.name, currentLocale)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Button type="submit" className="self-end bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                            <Search className="size-4" />
                            {currentLocale === 'ar' ? 'تطبيق' : 'Apply'}
                        </Button>
                        <Button type="button" variant="outline" className="self-end font-bold" onClick={resetFilters}>
                            {currentLocale === 'ar' ? 'إعادة ضبط' : 'Reset'}
                        </Button>
                    </form>

                    {insights.data.length === 0 ? (
                        <div className="mt-10 rounded-lg border border-[#D8E2EC] bg-white p-8 text-center">
                            <FileText className="mx-auto size-10 text-[#0AA6B5]" aria-hidden="true" />
                            <h2 className="mt-4 text-2xl font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'لا توجد منشورات متاحة' : 'No published content available'}
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#475569]">
                                {currentLocale === 'ar'
                                    ? 'سيظهر المحتوى هنا بعد اعتماده ونشره من لوحة الإدارة.'
                                    : 'Approved content will appear here after it is published from the admin dashboard.'}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 lg:grid-cols-3">
                            {insights.data.map((insight) => (
                                <article key={insight.slug} className="flex h-full flex-col rounded-lg border border-[#D8E2EC] bg-white shadow-sm shadow-[#061B3A]/5">
                                    {insight.cover_image_url ? (
                                        <img
                                            src={insight.cover_image_url}
                                            alt=""
                                            className="h-48 w-full rounded-t-lg object-cover"
                                            loading="lazy"
                                        />
                                    ) : null}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-md bg-[#E9FBFC] px-2 py-1 text-xs font-bold text-[#087A86]">
                                                {localized(typeLabels[insight.type], currentLocale)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#475569]">
                                                <CalendarDays className="size-3.5" />
                                                {formatDate(insight.published_at, currentLocale)}
                                            </span>
                                        </div>
                                        <h2 className="mt-4 text-xl font-extrabold leading-7 text-[#0F172A]">
                                            <Link href={`/research-and-insights/${insight.slug}`} className="hover:text-[#0AA6B5]">
                                                {localized(insight.title, currentLocale)}
                                            </Link>
                                        </h2>
                                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#475569]">{localized(insight.excerpt, currentLocale)}</p>
                                        {insight.categories.length ? (
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                {insight.categories.map((item) => (
                                                    <Link
                                                        key={item.slug}
                                                        href={`/research-and-insights?category=${item.slug}`}
                                                        className="rounded-md border border-[#D8E2EC] px-2 py-1 text-xs font-bold text-[#475569] hover:border-[#0AA6B5] hover:text-[#0AA6B5]"
                                                    >
                                                        {localized(item.name, currentLocale)}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                        <div className="mt-6 flex flex-wrap items-center gap-3">
                                            <Link
                                                href={`/research-and-insights/${insight.slug}`}
                                                className="inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5] hover:text-[#082D67]"
                                            >
                                                {currentLocale === 'ar' ? 'قراءة المزيد' : 'Read more'}
                                                <ArrowRight className={locale.direction === 'rtl' ? 'size-4 rotate-180' : 'size-4'} />
                                            </Link>
                                            {insight.download_url ? (
                                                <a href={insight.download_url} className="inline-flex items-center gap-2 text-sm font-bold text-[#082D67] hover:text-[#0AA6B5]">
                                                    <Download className="size-4" />
                                                    PDF
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="mt-10">
                        <AdminPagination links={insights.links} />
                    </div>
                </div>
            </section>

            <CtaBand
                locale={currentLocale}
                direction={locale.direction}
                title={{ en: 'Need a brief, note, or evidence summary?', ar: 'هل تحتاج إلى موجز أو مذكرة أو ملخص أدلة؟' }}
                description={{
                    en: 'EliteData can help structure a research note or evidence brief for internal teams, donors, management, or academic audiences.',
                    ar: 'يمكن لـ EliteData مساعدتك في بناء مذكرة بحثية أو موجز أدلة للفرق الداخلية أو الجهات المانحة أو الإدارة أو الجمهور الأكاديمي.',
                }}
                action={{ href: '/request-a-study', label: { en: 'Request support', ar: 'اطلب الدعم' } }}
            />
        </>
    );
}
