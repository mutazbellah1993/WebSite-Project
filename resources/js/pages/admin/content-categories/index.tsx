import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { formatDateTime } from '@/components/admin/admin-format';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { EmptyState } from '@/components/admin/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentCategoryListItem, LocaleCode, Paginated } from '@/types';

type Props = {
    categories: Paginated<ContentCategoryListItem>;
    filters: {
        search: string;
        sort: string;
        direction: string;
    };
    canManageContent: boolean;
    locale: {
        current: LocaleCode;
    };
};

export default function ContentCategoryIndex({ categories, filters, canManageContent, locale }: Props) {
    const currentLocale = locale.current;
    const [search, setSearch] = useState(filters.search);
    const [sort, setSort] = useState(filters.sort);
    const [direction, setDirection] = useState(filters.direction);
    const [loading, setLoading] = useState(false);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            '/admin/content-categories',
            { search, sort, direction },
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
        setSort('name');
        setDirection('asc');
        router.get('/admin/content-categories', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Content Categories" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase text-[#0AA6B5]">
                            {currentLocale === 'ar' ? 'إدارة المحتوى' : 'Content management'}
                        </p>
                        <h1 className="text-3xl font-extrabold text-[#0F172A]">
                            {currentLocale === 'ar' ? 'تصنيفات المحتوى' : 'Content Categories'}
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-medium text-[#475569]">
                            {categories.from ?? 0}-{categories.to ?? 0} / {categories.total}
                        </p>
                        {canManageContent ? (
                            <Button asChild className="bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                                <Link href="/admin/content-categories/create">
                                    <Plus className="size-4" />
                                    {currentLocale === 'ar' ? 'تصنيف جديد' : 'New category'}
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
                        <form onSubmit={submit} className="grid gap-3 lg:grid-cols-[1fr_180px_140px_auto_auto]">
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'بحث' : 'Search'}</span>
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                    placeholder={currentLocale === 'ar' ? 'الاسم أو الرابط' : 'Name or slug'}
                                />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'ترتيب حسب' : 'Sort by'}</span>
                                <select
                                    value={sort}
                                    onChange={(event) => setSort(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                >
                                    <option value="name">{currentLocale === 'ar' ? 'الاسم' : 'Name'}</option>
                                    <option value="slug">{currentLocale === 'ar' ? 'الرابط' : 'Slug'}</option>
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
                        {categories.data.length === 0 ? (
                            <EmptyState
                                title={currentLocale === 'ar' ? 'لا توجد تصنيفات' : 'No categories found'}
                                description={
                                    currentLocale === 'ar'
                                        ? 'جرّب تغيير البحث أو أنشئ تصنيفا جديدا.'
                                        : 'Try adjusting search, or create a new category.'
                                }
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[860px] text-sm">
                                    <thead>
                                        <tr className="border-b border-[#D8E2EC] text-left text-xs uppercase text-[#475569]">
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'التصنيف' : 'Category'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الرابط' : 'Slug'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'المحتوى المرتبط' : 'Linked content'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'آخر تحديث' : 'Updated'}</th>
                                            <th className="py-3 text-right font-bold">{currentLocale === 'ar' ? 'إجراء' : 'Action'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D8E2EC]">
                                        {categories.data.map((category) => (
                                            <tr key={category.id}>
                                                <td className="py-4 pe-4">
                                                    <p className="font-bold text-[#0F172A]">{currentLocale === 'ar' ? category.name_ar : category.name_en}</p>
                                                    <p className="line-clamp-2 max-w-md text-[#475569]">
                                                        {currentLocale === 'ar' ? category.description_ar : category.description_en}
                                                    </p>
                                                </td>
                                                <td className="py-4 pe-4 font-mono text-xs text-[#475569]">{category.slug}</td>
                                                <td className="py-4 pe-4 text-[#475569]">{category.insights_count}</td>
                                                <td className="py-4 pe-4 text-[#475569]">{formatDateTime(category.updated_at, currentLocale)}</td>
                                                <td className="py-4 text-right">
                                                    <Link href={`/admin/content-categories/${category.id}/edit`} className="font-bold text-[#0AA6B5] hover:text-[#082D67]">
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

                <AdminPagination links={categories.links} />
            </div>
        </>
    );
}
