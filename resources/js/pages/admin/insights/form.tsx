import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, RotateCcw, Save, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentCategoryOption, ContentStatus, InsightDetail, InsightType, LocaleCode } from '@/types';

type Props = {
    insight: InsightDetail | null;
    types: InsightType[];
    statuses: ContentStatus[];
    categories: ContentCategoryOption[];
    mode: 'create' | 'edit';
    canManageContent?: boolean;
    locale: {
        current: LocaleCode;
    };
};

type InsightFormData = {
    [key: string]: string | boolean | number[] | File | null;
    type: InsightType;
    title_en: string;
    title_ar: string;
    slug: string;
    excerpt_en: string;
    excerpt_ar: string;
    body_en: string;
    body_ar: string;
    categories: number[];
    cover_image: File | null;
    report_attachment: File | null;
    remove_cover_image: boolean;
    remove_report_attachment: boolean;
    is_featured: boolean;
    status: ContentStatus;
    published_at: string;
    seo_title_en: string;
    seo_title_ar: string;
    seo_description_en: string;
    seo_description_ar: string;
};

function FieldError({ message }: { message?: string }) {
    return message ? <span className="text-sm font-medium text-red-700">{message}</span> : null;
}

function toDateTimeLocal(value?: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const pad = (part: number) => String(part).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function InsightForm({ insight, types, statuses, categories, mode, canManageContent = true, locale }: Props) {
    const currentLocale = locale.current;
    const isDeleted = Boolean(insight?.deleted_at);
    const canEdit = canManageContent && !isDeleted;
    const form = useForm<InsightFormData>({
        type: insight?.type ?? 'article',
        title_en: insight?.title_en ?? '',
        title_ar: insight?.title_ar ?? '',
        slug: insight?.slug ?? '',
        excerpt_en: insight?.excerpt_en ?? '',
        excerpt_ar: insight?.excerpt_ar ?? '',
        body_en: insight?.body_en ?? '',
        body_ar: insight?.body_ar ?? '',
        categories: insight?.category_ids ?? [],
        cover_image: null,
        report_attachment: null,
        remove_cover_image: false,
        remove_report_attachment: false,
        is_featured: insight?.is_featured ?? false,
        status: insight?.status ?? 'draft',
        published_at: toDateTimeLocal(insight?.published_at),
        seo_title_en: insight?.seo_title_en ?? '',
        seo_title_ar: insight?.seo_title_ar ?? '',
        seo_description_en: insight?.seo_description_en ?? '',
        seo_description_ar: insight?.seo_description_ar ?? '',
    });
    const hasErrors = Object.keys(form.errors).length > 0;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post('/admin/insights', { preserveScroll: true, forceFormData: true });
            return;
        }

        if (insight) {
            form.transform((data) => ({ ...data, _method: 'patch' })).post(`/admin/insights/${insight.slug}`, {
                preserveScroll: true,
                forceFormData: true,
            });
        }
    }

    function destroy() {
        if (insight && confirm(currentLocale === 'ar' ? 'هل تريد حذف هذا المحتوى؟' : 'Delete this content?')) {
            router.delete(`/admin/insights/${insight.slug}`, { preserveScroll: true });
        }
    }

    function restore() {
        if (insight) {
            router.patch(`/admin/insights/${insight.slug}/restore`, {}, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={mode === 'create' ? 'Create Insight' : `Edit Insight - ${insight?.title_en ?? ''}`} />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/insights" className="inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5]">
                            <ArrowLeft className="size-4" />
                            {currentLocale === 'ar' ? 'العودة إلى الأبحاث والرؤى' : 'Back to insights'}
                        </Link>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-[#0F172A]">
                                {mode === 'create'
                                    ? currentLocale === 'ar'
                                        ? 'محتوى جديد'
                                        : 'New content'
                                    : currentLocale === 'ar'
                                      ? insight?.title_ar
                                      : insight?.title_en}
                            </h1>
                            {insight ? <StatusBadge status={insight.status} /> : null}
                            {isDeleted ? <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Deleted</span> : null}
                        </div>
                    </div>
                    {mode === 'edit' && canManageContent ? (
                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline" className="font-bold">
                                <Link href={`/admin/insights/${insight?.slug}/preview`}>
                                    <Eye className="size-4" />
                                    {currentLocale === 'ar' ? 'معاينة' : 'Preview'}
                                </Link>
                            </Button>
                            {isDeleted ? (
                                <Button type="button" className="bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]" onClick={restore}>
                                    <RotateCcw className="size-4" />
                                    {currentLocale === 'ar' ? 'استعادة' : 'Restore'}
                                </Button>
                            ) : (
                                <Button type="button" variant="destructive" className="font-bold" onClick={destroy}>
                                    <Trash2 className="size-4" />
                                    {currentLocale === 'ar' ? 'حذف' : 'Delete'}
                                </Button>
                            )}
                        </div>
                    ) : null}
                </div>

                {!canManageContent ? (
                    <p className="rounded-md border border-[#D8E2EC] bg-white p-4 text-sm font-medium text-[#475569]">
                        {currentLocale === 'ar' ? 'لديك صلاحية قراءة فقط.' : 'You have read-only access.'}
                    </p>
                ) : null}

                <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_390px]">
                    <div className="space-y-6">
                        <Card className="rounded-lg border-[#D8E2EC] bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                    {currentLocale === 'ar' ? 'المحتوى الأساسي' : 'Core content'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'العنوان بالإنجليزية' : 'English title'}</span>
                                        <input
                                            value={form.data.title_en}
                                            onChange={(event) => form.setData('title_en', event.target.value)}
                                            disabled={!canEdit}
                                            className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.title_en} />
                                    </label>
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'العنوان بالعربية' : 'Arabic title'}</span>
                                        <input
                                            value={form.data.title_ar}
                                            onChange={(event) => form.setData('title_ar', event.target.value)}
                                            disabled={!canEdit}
                                            dir="rtl"
                                            className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.title_ar} />
                                    </label>
                                </div>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الرابط المختصر' : 'Slug'}</span>
                                    <input
                                        value={form.data.slug}
                                        onChange={(event) => form.setData('slug', event.target.value)}
                                        disabled={!canEdit}
                                        placeholder={currentLocale === 'ar' ? 'ينشأ تلقائيا عند تركه فارغا' : 'Generated from English title when left blank'}
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 font-mono text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.slug} />
                                </label>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الموجز بالإنجليزية' : 'English excerpt'}</span>
                                        <textarea
                                            value={form.data.excerpt_en}
                                            onChange={(event) => form.setData('excerpt_en', event.target.value)}
                                            disabled={!canEdit}
                                            rows={4}
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.excerpt_en} />
                                    </label>
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الموجز بالعربية' : 'Arabic excerpt'}</span>
                                        <textarea
                                            value={form.data.excerpt_ar}
                                            onChange={(event) => form.setData('excerpt_ar', event.target.value)}
                                            disabled={!canEdit}
                                            rows={4}
                                            dir="rtl"
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.excerpt_ar} />
                                    </label>
                                </div>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'النص بالإنجليزية' : 'English body'}</span>
                                        <textarea
                                            value={form.data.body_en}
                                            onChange={(event) => form.setData('body_en', event.target.value)}
                                            disabled={!canEdit}
                                            rows={14}
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 font-mono text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.body_en} />
                                    </label>
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'النص بالعربية' : 'Arabic body'}</span>
                                        <textarea
                                            value={form.data.body_ar}
                                            onChange={(event) => form.setData('body_ar', event.target.value)}
                                            disabled={!canEdit}
                                            rows={14}
                                            dir="rtl"
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 font-mono text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.body_ar} />
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-lg border-[#D8E2EC] bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-extrabold text-[#0F172A]">SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-5 md:grid-cols-2">
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'عنوان SEO بالإنجليزية' : 'English SEO title'}</span>
                                    <input
                                        value={form.data.seo_title_en}
                                        onChange={(event) => form.setData('seo_title_en', event.target.value)}
                                        disabled={!canEdit}
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.seo_title_en} />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'عنوان SEO بالعربية' : 'Arabic SEO title'}</span>
                                    <input
                                        value={form.data.seo_title_ar}
                                        onChange={(event) => form.setData('seo_title_ar', event.target.value)}
                                        disabled={!canEdit}
                                        dir="rtl"
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.seo_title_ar} />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'وصف SEO بالإنجليزية' : 'English SEO description'}</span>
                                    <textarea
                                        value={form.data.seo_description_en}
                                        onChange={(event) => form.setData('seo_description_en', event.target.value)}
                                        disabled={!canEdit}
                                        rows={4}
                                        className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.seo_description_en} />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'وصف SEO بالعربية' : 'Arabic SEO description'}</span>
                                    <textarea
                                        value={form.data.seo_description_ar}
                                        onChange={(event) => form.setData('seo_description_ar', event.target.value)}
                                        disabled={!canEdit}
                                        rows={4}
                                        dir="rtl"
                                        className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.seo_description_ar} />
                                </label>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-fit rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'النشر والملفات' : 'Publishing and files'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'النوع' : 'Type'}</span>
                                <select
                                    value={form.data.type}
                                    onChange={(event) => form.setData('type', event.target.value as InsightType)}
                                    disabled={!canEdit}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                >
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <FieldError message={form.errors.type} />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الحالة' : 'Status'}</span>
                                <select
                                    value={form.data.status}
                                    onChange={(event) => form.setData('status', event.target.value as ContentStatus)}
                                    disabled={!canEdit}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <FieldError message={form.errors.status} />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'تاريخ النشر' : 'Publication date'}</span>
                                <input
                                    type="datetime-local"
                                    value={form.data.published_at}
                                    onChange={(event) => form.setData('published_at', event.target.value)}
                                    disabled={!canEdit}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                />
                                <FieldError message={form.errors.published_at} />
                            </label>
                            <label className="flex items-center gap-3 rounded-md border border-[#D8E2EC] bg-[#F4F7FA] p-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_featured}
                                    onChange={(event) => form.setData('is_featured', event.target.checked)}
                                    disabled={!canEdit}
                                    className="size-4 accent-[#0AA6B5]"
                                />
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'محتوى مميز' : 'Featured content'}</span>
                            </label>
                            <FieldError message={form.errors.is_featured} />
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'التصنيفات' : 'Categories'}</span>
                                <select
                                    multiple
                                    value={form.data.categories.map(String)}
                                    onChange={(event) =>
                                        form.setData(
                                            'categories',
                                            Array.from(event.currentTarget.selectedOptions).map((option) => Number(option.value)),
                                        )
                                    }
                                    disabled={!canEdit}
                                    className="min-h-36 rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {currentLocale === 'ar' ? category.name_ar : category.name_en}
                                        </option>
                                    ))}
                                </select>
                                <FieldError message={form.errors.categories} />
                            </label>
                            <div className="grid gap-3">
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'صورة الغلاف' : 'Cover image'}</span>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                        onChange={(event) => form.setData('cover_image', event.currentTarget.files?.[0] ?? null)}
                                        disabled={!canEdit}
                                        className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm"
                                    />
                                    <FieldError message={form.errors.cover_image} />
                                </label>
                                {insight?.cover_image_url ? (
                                    <div className="rounded-md border border-[#D8E2EC] bg-[#F4F7FA] p-3">
                                        <img src={insight.cover_image_url} alt="" className="h-28 w-full rounded-md object-cover" />
                                        <label className="mt-3 flex items-center gap-3 text-sm font-bold text-[#0F172A]">
                                            <input
                                                type="checkbox"
                                                checked={form.data.remove_cover_image}
                                                onChange={(event) => form.setData('remove_cover_image', event.target.checked)}
                                                disabled={!canEdit}
                                                className="size-4 accent-[#0AA6B5]"
                                            />
                                            {currentLocale === 'ar' ? 'إزالة الصورة الحالية' : 'Remove current image'}
                                        </label>
                                    </div>
                                ) : null}
                            </div>
                            <div className="grid gap-3">
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'ملف التقرير PDF' : 'Report PDF'}</span>
                                    <input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={(event) => form.setData('report_attachment', event.currentTarget.files?.[0] ?? null)}
                                        disabled={!canEdit}
                                        className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm"
                                    />
                                    <FieldError message={form.errors.report_attachment} />
                                </label>
                                {insight?.has_report_attachment ? (
                                    <label className="flex items-center gap-3 rounded-md border border-[#D8E2EC] bg-[#F4F7FA] p-3 text-sm font-bold text-[#0F172A]">
                                        <input
                                            type="checkbox"
                                            checked={form.data.remove_report_attachment}
                                            onChange={(event) => form.setData('remove_report_attachment', event.target.checked)}
                                            disabled={!canEdit}
                                            className="size-4 accent-[#0AA6B5]"
                                        />
                                        {currentLocale === 'ar' ? 'إزالة ملف PDF الحالي' : 'Remove current PDF'}
                                    </label>
                                ) : null}
                            </div>
                            {hasErrors ? (
                                <Button type="button" variant="outline" className="font-bold" onClick={() => form.clearErrors()}>
                                    {currentLocale === 'ar' ? 'مسح رسائل التحقق' : 'Clear validation messages'}
                                </Button>
                            ) : null}
                            {canEdit ? (
                                <Button type="submit" disabled={form.processing} className="w-full bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                                    <Save className="size-4" />
                                    {form.processing
                                        ? currentLocale === 'ar'
                                            ? 'جار الحفظ'
                                            : 'Saving'
                                        : currentLocale === 'ar'
                                          ? 'حفظ المحتوى'
                                          : 'Save content'}
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}
