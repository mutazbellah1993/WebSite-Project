import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { formatDateTime, humanizeStatus } from '@/components/admin/admin-format';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { EmptyState } from '@/components/admin/empty-state';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentCategoryOption, ContentStatus, InsightListItem, InsightType, LocaleCode, Paginated } from '@/types';

type Props = {
    insights: Paginated<InsightListItem>;
    filters: {
        search: string;
        type: string;
        status: string;
        category: string;
        featured: string;
        trashed: string;
        sort: string;
        direction: string;
    };
    types: InsightType[];
    statuses: ContentStatus[];
    categories: ContentCategoryOption[];
    canManageContent: boolean;
    locale: {
        current: LocaleCode;
    };
};

function typeClass(type: string): string {
    const classes: Record<string, string> = {
        article: 'bg-[#EAF6FF] text-[#082D67]',
        report: 'bg-[#E9FBFC] text-[#087A86]',
        insight: 'bg-[#F1F5F9] text-[#334155]',
        news: 'bg-[#FFF7ED] text-[#9A3412]',
    };

    return classes[type] ?? 'bg-[#F1F5F9] text-[#334155]';
}

export default function InsightIndex({ insights, filters, types, statuses, categories, canManageContent, locale }: Props) {
    const currentLocale = locale.current;
    const [search, setSearch] = useState(filters.search);
    const [type, setType] = useState(filters.type);
    const [status, setStatus] = useState(filters.status);
    const [category, setCategory] = useState(filters.category);
    const [featured, setFeatured] = useState(filters.featured);
    const [trashed, setTrashed] = useState(filters.trashed);
    const [sort, setSort] = useState(filters.sort);
    const [direction, setDirection] = useState(filters.direction);
    const [loading, setLoading] = useState(false);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            '/admin/insights',
            { search, type, status, category, featured, trashed, sort, direction },
            {
                preserveState: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    }

    function resetFilters() {
        setSearch('');
        setType('');
        setStatus('');
        setCategory('');
        setFeatured('');
        setTrashed('');
        setSort('published_at');
        setDirection('desc');
        router.get('/admin/insights', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Insights" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase text-[#0AA6B5]">
                            {currentLocale === 'ar' ? 'إدارة المحتوى' : 'Content management'}
                        </p>
                        <h1 className="text-3xl font-extrabold text-[#0F172A]">
                            {currentLocale === 'ar' ? 'الأبحاث والرؤى' : 'Research & Insights'}
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-medium text-[#475569]">
                            {insights.from ?? 0}-{insights.to ?? 0} / {insights.total}
                        </p>
                        {canManageContent ? (
                            <Button asChild className="bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                                <Link href="/admin/insights/create">
                                    <Plus className="size-4" />
                                    {currentLocale === 'ar' ? 'محتوى جديد' : 'New content'}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <Card className="rounded-lg border-[#D8E2EC] bg-white">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-[#0F172A]">
                            {currentLocale === 'ar' ? 'بحث وتصفية' : 'Search and filters'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-3 xl:grid-cols-[1fr_145px_150px_190px_150px_155px_165px_135px_auto_auto]">
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'بحث' : 'Search'}</span>
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                    placeholder={currentLocale === 'ar' ? 'العنوان أو الرابط' : 'Title or slug'}
                                />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'النوع' : 'Type'}</span>
                                <select value={type} onChange={(event) => setType(event.target.value)} className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm">
                                    <option value="">{currentLocale === 'ar' ? 'كل الأنواع' : 'All types'}</option>
                                    {types.map((item) => (
                                        <option key={item} value={item}>
                                            {humanizeStatus(item)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الحالة' : 'Status'}</span>
                                <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm">
                                    <option value="">{currentLocale === 'ar' ? 'كل الحالات' : 'All statuses'}</option>
                                    {statuses.map((item) => (
                                        <option key={item} value={item}>
                                            {humanizeStatus(item)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'التصنيف' : 'Category'}</span>
                                <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm">
                                    <option value="">{currentLocale === 'ar' ? 'كل التصنيفات' : 'All categories'}</option>
                                    {categories.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {currentLocale === 'ar' ? item.name_ar : item.name_en}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'مميز' : 'Featured'}</span>
                                <select value={featured} onChange={(event) => setFeatured(event.target.value)} className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm">
                                    <option value="">{currentLocale === 'ar' ? 'الكل' : 'All'}</option>
                                    <option value="yes">{currentLocale === 'ar' ? 'مميز فقط' : 'Featured only'}</option>
                                    <option value="no">{currentLocale === 'ar' ? 'غير مميز' : 'Not featured'}</option>
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الحذف' : 'Deleted'}</span>
                                <select value={trashed} onChange={(event) => setTrashed(event.target.value)} className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm">
                                    <option value="">{currentLocale === 'ar' ? 'النشطة فقط' : 'Active only'}</option>
                                    <option value="with">{currentLocale === 'ar' ? 'مع المحذوفة' : 'With deleted'}</option>
                                    <option value="only">{currentLocale === 'ar' ? 'المحذوفة فقط' : 'Deleted only'}</option>
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'ترتيب حسب' : 'Sort by'}</span>
                                <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm">
                                    <option value="published_at">{currentLocale === 'ar' ? 'تاريخ النشر' : 'Publication date'}</option>
                                    <option value="created_at">{currentLocale === 'ar' ? 'تاريخ الإنشاء' : 'Created date'}</option>
                                    <option value="title">{currentLocale === 'ar' ? 'العنوان' : 'Title'}</option>
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الاتجاه' : 'Direction'}</span>
                                <select value={direction} onChange={(event) => setDirection(event.target.value)} className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm">
                                    <option value="desc">{currentLocale === 'ar' ? 'تنازلي' : 'Descending'}</option>
                                    <option value="asc">{currentLocale === 'ar' ? 'تصاعدي' : 'Ascending'}</option>
                                </select>
                            </label>
                            <Button type="submit" className="self-end bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                                <Search className="size-4" />
                                {loading ? (currentLocale === 'ar' ? 'جار البحث' : 'Searching') : currentLocale === 'ar' ? 'تطبيق' : 'Apply'}
                            </Button>
                            <Button type="button" variant="outline" className="self-end font-bold" onClick={resetFilters}>
                                {currentLocale === 'ar' ? 'إعادة ضبط' : 'Reset'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="rounded-lg border-[#D8E2EC] bg-white">
                    <CardContent className="pt-6">
                        {insights.data.length === 0 ? (
                            <EmptyState
                                title={currentLocale === 'ar' ? 'لا يوجد محتوى' : 'No content found'}
                                description={
                                    currentLocale === 'ar'
                                        ? 'جرّب تغيير البحث أو المرشحات، أو أنشئ محتوى جديدا.'
                                        : 'Try adjusting search or filters, or create new content.'
                                }
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1100px] text-sm">
                                    <thead>
                                        <tr className="border-b border-[#D8E2EC] text-left text-xs uppercase text-[#475569]">
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'المحتوى' : 'Content'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'النوع' : 'Type'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الحالة' : 'Status'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'التصنيفات' : 'Categories'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'النشر' : 'Published'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'آخر تحديث' : 'Updated'}</th>
                                            <th className="py-3 text-right font-bold">{currentLocale === 'ar' ? 'إجراء' : 'Action'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D8E2EC]">
                                        {insights.data.map((insight) => (
                                            <tr key={insight.id} className={insight.deleted_at ? 'bg-red-50/60' : undefined}>
                                                <td className="py-4 pe-4">
                                                    <p className="font-bold text-[#0F172A]">{currentLocale === 'ar' ? insight.title_ar : insight.title_en}</p>
                                                    <p className="font-mono text-xs text-[#475569]">{insight.slug}</p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {insight.is_featured ? (
                                                            <span className="rounded-md bg-[#E9FBFC] px-2 py-1 text-xs font-bold text-[#087A86]">
                                                                {currentLocale === 'ar' ? 'مميز' : 'Featured'}
                                                            </span>
                                                        ) : null}
                                                        {insight.has_report_attachment ? (
                                                            <span className="rounded-md bg-[#F1F5F9] px-2 py-1 text-xs font-bold text-[#334155]">PDF</span>
                                                        ) : null}
                                                        {insight.deleted_at ? <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Deleted</span> : null}
                                                    </div>
                                                </td>
                                                <td className="py-4 pe-4">
                                                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${typeClass(insight.type)}`}>
                                                        {humanizeStatus(insight.type)}
                                                    </span>
                                                </td>
                                                <td className="py-4 pe-4">
                                                    <StatusBadge status={insight.status} />
                                                </td>
                                                <td className="py-4 pe-4 text-[#475569]">
                                                    {insight.categories.length
                                                        ? insight.categories.map((item) => (currentLocale === 'ar' ? item.name_ar : item.name_en)).join(', ')
                                                        : currentLocale === 'ar'
                                                          ? 'غير مصنف'
                                                          : 'Uncategorized'}
                                                </td>
                                                <td className="py-4 pe-4 text-[#475569]">{formatDateTime(insight.published_at, currentLocale)}</td>
                                                <td className="py-4 pe-4 text-[#475569]">{formatDateTime(insight.updated_at, currentLocale)}</td>
                                                <td className="py-4 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <Link href={`/admin/insights/${insight.slug}/preview`} className="inline-flex items-center gap-1 font-bold text-[#475569] hover:text-[#082D67]">
                                                            <Eye className="size-4" />
                                                            {currentLocale === 'ar' ? 'معاينة' : 'Preview'}
                                                        </Link>
                                                        <Link href={`/admin/insights/${insight.slug}/edit`} className="font-bold text-[#0AA6B5] hover:text-[#082D67]">
                                                            {currentLocale === 'ar' ? 'تحرير' : 'Edit'}
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <AdminPagination links={insights.links} />
            </div>
        </>
    );
}
