import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { EmptyState } from '@/components/admin/empty-state';
import { formatDateTime, humanizeStatus } from '@/components/admin/admin-format';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentStatus, LocaleCode, Paginated, ServiceListItem } from '@/types';

type Props = {
    services: Paginated<ServiceListItem>;
    filters: {
        search: string;
        status: string;
        featured: string;
        trashed: string;
        sort: string;
        direction: string;
    };
    statuses: ContentStatus[];
    canManageContent: boolean;
    locale: {
        current: LocaleCode;
    };
};

export default function ServiceIndex({ services, filters, statuses, canManageContent, locale }: Props) {
    const currentLocale = locale.current;
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [featured, setFeatured] = useState(filters.featured);
    const [trashed, setTrashed] = useState(filters.trashed);
    const [sort, setSort] = useState(filters.sort);
    const [direction, setDirection] = useState(filters.direction);
    const [loading, setLoading] = useState(false);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            '/admin/services',
            { search, status, featured, trashed, sort, direction },
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
        setStatus('');
        setFeatured('');
        setTrashed('');
        setSort('sort_order');
        setDirection('asc');
        router.get('/admin/services', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Services" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase text-[#0AA6B5]">
                            {currentLocale === 'ar' ? 'إدارة المحتوى' : 'Content management'}
                        </p>
                        <h1 className="text-3xl font-extrabold text-[#0F172A]">{currentLocale === 'ar' ? 'الخدمات' : 'Services'}</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-medium text-[#475569]">
                            {services.from ?? 0}-{services.to ?? 0} / {services.total}
                        </p>
                        {canManageContent ? (
                            <Button asChild className="bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                                <Link href="/admin/services/create">
                                    <Plus className="size-4" />
                                    {currentLocale === 'ar' ? 'خدمة جديدة' : 'New service'}
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
                        <form onSubmit={submit} className="grid gap-3 xl:grid-cols-[1fr_180px_170px_170px_170px_140px_auto_auto]">
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
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الحالة' : 'Status'}</span>
                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                >
                                    <option value="">{currentLocale === 'ar' ? 'كل الحالات' : 'All statuses'}</option>
                                    {statuses.map((item) => (
                                        <option key={item} value={item}>
                                            {humanizeStatus(item)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'مميزة' : 'Featured'}</span>
                                <select
                                    value={featured}
                                    onChange={(event) => setFeatured(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                >
                                    <option value="">{currentLocale === 'ar' ? 'الكل' : 'All'}</option>
                                    <option value="yes">{currentLocale === 'ar' ? 'مميزة فقط' : 'Featured only'}</option>
                                    <option value="no">{currentLocale === 'ar' ? 'غير مميزة' : 'Not featured'}</option>
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الحذف' : 'Deleted'}</span>
                                <select
                                    value={trashed}
                                    onChange={(event) => setTrashed(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                >
                                    <option value="">{currentLocale === 'ar' ? 'النشطة فقط' : 'Active only'}</option>
                                    <option value="with">{currentLocale === 'ar' ? 'مع المحذوفة' : 'With deleted'}</option>
                                    <option value="only">{currentLocale === 'ar' ? 'المحذوفة فقط' : 'Deleted only'}</option>
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'ترتيب حسب' : 'Sort by'}</span>
                                <select
                                    value={sort}
                                    onChange={(event) => setSort(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                >
                                    <option value="sort_order">{currentLocale === 'ar' ? 'الترتيب' : 'Sort order'}</option>
                                    <option value="title">{currentLocale === 'ar' ? 'العنوان' : 'Title'}</option>
                                    <option value="created_at">{currentLocale === 'ar' ? 'تاريخ الإنشاء' : 'Created date'}</option>
                                </select>
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الاتجاه' : 'Direction'}</span>
                                <select
                                    value={direction}
                                    onChange={(event) => setDirection(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                >
                                    <option value="asc">{currentLocale === 'ar' ? 'تصاعدي' : 'Ascending'}</option>
                                    <option value="desc">{currentLocale === 'ar' ? 'تنازلي' : 'Descending'}</option>
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
                        {services.data.length === 0 ? (
                            <EmptyState
                                title={currentLocale === 'ar' ? 'لا توجد خدمات' : 'No services found'}
                                description={
                                    currentLocale === 'ar'
                                        ? 'جرّب تغيير البحث أو المرشحات، أو أنشئ خدمة جديدة.'
                                        : 'Try adjusting search or filters, or create a new service.'
                                }
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[980px] text-sm">
                                    <thead>
                                        <tr className="border-b border-[#D8E2EC] text-left text-xs uppercase text-[#475569]">
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الخدمة' : 'Service'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الرابط' : 'Slug'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الحالة' : 'Status'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'مميزة' : 'Featured'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الترتيب' : 'Order'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'آخر تحديث' : 'Updated'}</th>
                                            <th className="py-3 text-right font-bold">{currentLocale === 'ar' ? 'إجراء' : 'Action'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D8E2EC]">
                                        {services.data.map((service) => (
                                            <tr key={service.id} className={service.deleted_at ? 'bg-red-50/60' : undefined}>
                                                <td className="py-4 pe-4">
                                                    <p className="font-bold text-[#0F172A]">{currentLocale === 'ar' ? service.title_ar : service.title_en}</p>
                                                    <p className="line-clamp-2 max-w-md text-[#475569]">
                                                        {currentLocale === 'ar' ? service.short_description_ar : service.short_description_en}
                                                    </p>
                                                </td>
                                                <td className="py-4 pe-4 font-mono text-xs text-[#475569]">{service.slug}</td>
                                                <td className="py-4 pe-4">
                                                    <StatusBadge status={service.status} />
                                                    {service.deleted_at ? <p className="mt-2 text-xs font-bold text-red-700">Deleted</p> : null}
                                                </td>
                                                <td className="py-4 pe-4 text-[#475569]">
                                                    {service.is_featured ? (currentLocale === 'ar' ? 'نعم' : 'Yes') : currentLocale === 'ar' ? 'لا' : 'No'}
                                                </td>
                                                <td className="py-4 pe-4 text-[#475569]">{service.sort_order}</td>
                                                <td className="py-4 pe-4 text-[#475569]">{formatDateTime(service.updated_at, currentLocale)}</td>
                                                <td className="py-4 text-right">
                                                    <Link href={`/admin/services/${service.id}/edit`} className="font-bold text-[#0AA6B5] hover:text-[#082D67]">
                                                        {currentLocale === 'ar' ? 'تحرير' : 'Edit'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <AdminPagination links={services.links} />
            </div>
        </>
    );
}
