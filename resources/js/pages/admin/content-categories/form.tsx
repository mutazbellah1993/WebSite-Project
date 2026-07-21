import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentCategoryListItem, LocaleCode } from '@/types';

type Props = {
    category: ContentCategoryListItem | null;
    mode: 'create' | 'edit';
    canManageContent?: boolean;
    locale: {
        current: LocaleCode;
    };
    errors?: Record<string, string>;
};

type CategoryFormData = {
    name_en: string;
    name_ar: string;
    slug: string;
    description_en: string;
    description_ar: string;
};

function FieldError({ message }: { message?: string }) {
    return message ? <span className="text-sm font-medium text-red-700">{message}</span> : null;
}

export default function ContentCategoryForm({ category, mode, canManageContent = true, locale, errors = {} }: Props) {
    const currentLocale = locale.current;
    const form = useForm<CategoryFormData>({
        name_en: category?.name_en ?? '',
        name_ar: category?.name_ar ?? '',
        slug: category?.slug ?? '',
        description_en: category?.description_en ?? '',
        description_ar: category?.description_ar ?? '',
    });
    const canEdit = canManageContent;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post('/admin/content-categories', { preserveScroll: true });
            return;
        }

        if (category) {
            form.patch(`/admin/content-categories/${category.id}`, { preserveScroll: true });
        }
    }

    function destroy() {
        if (category && confirm(currentLocale === 'ar' ? 'هل تريد حذف هذا التصنيف؟' : 'Delete this category?')) {
            router.delete(`/admin/content-categories/${category.id}`, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={mode === 'create' ? 'Create Content Category' : `Edit Content Category - ${category?.name_en ?? ''}`} />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/content-categories" className="inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5]">
                            <ArrowLeft className="size-4" />
                            {currentLocale === 'ar' ? 'العودة إلى التصنيفات' : 'Back to categories'}
                        </Link>
                        <h1 className="mt-4 text-3xl font-extrabold text-[#0F172A]">
                            {mode === 'create'
                                ? currentLocale === 'ar'
                                    ? 'تصنيف جديد'
                                    : 'New category'
                                : currentLocale === 'ar'
                                  ? category?.name_ar
                                  : category?.name_en}
                        </h1>
                    </div>
                    {mode === 'edit' && canManageContent ? (
                        <Button type="button" variant="destructive" className="font-bold" onClick={destroy} disabled={(category?.insights_count ?? 0) > 0}>
                            <Trash2 className="size-4" />
                            {currentLocale === 'ar' ? 'حذف' : 'Delete'}
                        </Button>
                    ) : null}
                </div>

                {!canManageContent ? (
                    <p className="rounded-md border border-[#D8E2EC] bg-white p-4 text-sm font-medium text-[#475569]">
                        {currentLocale === 'ar' ? 'لديك صلاحية قراءة فقط.' : 'You have read-only access.'}
                    </p>
                ) : null}

                {errors.content_category ? (
                    <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{errors.content_category}</p>
                ) : null}

                {category && category.insights_count > 0 ? (
                    <p className="rounded-md border border-[#D8E2EC] bg-[#F4F7FA] p-4 text-sm font-medium text-[#475569]">
                        {currentLocale === 'ar'
                            ? 'لا يمكن حذف هذا التصنيف قبل إزالة أو نقل المحتوى المرتبط به.'
                            : 'This category cannot be deleted until linked insights are removed or reassigned.'}
                    </p>
                ) : null}

                <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <Card className="rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'محتوى التصنيف' : 'Category content'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الاسم بالإنجليزية' : 'English name'}</span>
                                    <input
                                        value={form.data.name_en}
                                        onChange={(event) => form.setData('name_en', event.target.value)}
                                        disabled={!canEdit}
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.name_en} />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الاسم بالعربية' : 'Arabic name'}</span>
                                    <input
                                        value={form.data.name_ar}
                                        onChange={(event) => form.setData('name_ar', event.target.value)}
                                        disabled={!canEdit}
                                        dir="rtl"
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.name_ar} />
                                </label>
                            </div>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الرابط المختصر' : 'Slug'}</span>
                                <input
                                    value={form.data.slug}
                                    onChange={(event) => form.setData('slug', event.target.value)}
                                    disabled={!canEdit}
                                    placeholder={currentLocale === 'ar' ? 'ينشأ تلقائيا عند تركه فارغا' : 'Generated from English name when left blank'}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 font-mono text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                />
                                <FieldError message={form.errors.slug} />
                            </label>
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">
                                        {currentLocale === 'ar' ? 'الوصف بالإنجليزية' : 'English description'}
                                    </span>
                                    <textarea
                                        value={form.data.description_en}
                                        onChange={(event) => form.setData('description_en', event.target.value)}
                                        disabled={!canEdit}
                                        rows={6}
                                        className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.description_en} />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الوصف بالعربية' : 'Arabic description'}</span>
                                    <textarea
                                        value={form.data.description_ar}
                                        onChange={(event) => form.setData('description_ar', event.target.value)}
                                        disabled={!canEdit}
                                        rows={6}
                                        dir="rtl"
                                        className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.description_ar} />
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="h-fit rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'الحفظ' : 'Save'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <p className="text-sm leading-6 text-[#475569]">
                                {currentLocale === 'ar'
                                    ? 'استخدم التصنيفات لتنظيم المقالات والتقارير والرؤى دون إنشاء ادعاءات أو منشورات وهمية.'
                                    : 'Use categories to organize articles, reports, insights, and news without inventing publications.'}
                            </p>
                            {canEdit ? (
                                <Button type="submit" disabled={form.processing} className="w-full bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                                    <Save className="size-4" />
                                    {form.processing
                                        ? currentLocale === 'ar'
                                            ? 'جار الحفظ'
                                            : 'Saving'
                                        : currentLocale === 'ar'
                                          ? 'حفظ التصنيف'
                                          : 'Save category'}
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}
