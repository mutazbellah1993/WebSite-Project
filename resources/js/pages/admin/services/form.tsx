import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, RotateCcw, Save, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentStatus, LocaleCode, ServiceDetail } from '@/types';

type Props = {
    service: ServiceDetail | null;
    statuses: ContentStatus[];
    mode: 'create' | 'edit';
    canManageContent?: boolean;
    locale: {
        current: LocaleCode;
    };
};

type ServiceFormData = {
    title_en: string;
    title_ar: string;
    slug: string;
    short_description_en: string;
    short_description_ar: string;
    description_en: string;
    description_ar: string;
    icon: string;
    image_path: string;
    status: ContentStatus;
    is_featured: boolean;
    sort_order: number;
    seo_title_en: string;
    seo_title_ar: string;
    seo_description_en: string;
    seo_description_ar: string;
};

function FieldError({ message }: { message?: string }) {
    return message ? <span className="text-sm font-medium text-red-700">{message}</span> : null;
}

export default function ServiceForm({ service, statuses, mode, canManageContent = true, locale }: Props) {
    const currentLocale = locale.current;
    const isDeleted = Boolean(service?.deleted_at);
    const canEdit = canManageContent && !isDeleted;
    const form = useForm<ServiceFormData>({
        title_en: service?.title_en ?? '',
        title_ar: service?.title_ar ?? '',
        slug: service?.slug ?? '',
        short_description_en: service?.short_description_en ?? '',
        short_description_ar: service?.short_description_ar ?? '',
        description_en: service?.description_en ?? '',
        description_ar: service?.description_ar ?? '',
        icon: service?.icon ?? '',
        image_path: service?.image_path ?? '',
        status: service?.status ?? 'draft',
        is_featured: service?.is_featured ?? false,
        sort_order: service?.sort_order ?? 0,
        seo_title_en: service?.seo_title_en ?? '',
        seo_title_ar: service?.seo_title_ar ?? '',
        seo_description_en: service?.seo_description_en ?? '',
        seo_description_ar: service?.seo_description_ar ?? '',
    });
    const hasErrors = Object.keys(form.errors).length > 0;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post('/admin/services', { preserveScroll: true });
            return;
        }

        if (service) {
            form.patch(`/admin/services/${service.id}`, { preserveScroll: true });
        }
    }

    function destroy() {
        if (service && confirm(currentLocale === 'ar' ? 'هل تريد حذف هذه الخدمة؟' : 'Delete this service?')) {
            router.delete(`/admin/services/${service.id}`, { preserveScroll: true });
        }
    }

    function restore() {
        if (service) {
            router.patch(`/admin/services/${service.id}/restore`, {}, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={mode === 'create' ? 'Create Service' : `Edit Service - ${service?.title_en ?? ''}`} />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5]">
                            <ArrowLeft className="size-4" />
                            {currentLocale === 'ar' ? 'العودة إلى الخدمات' : 'Back to services'}
                        </Link>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-[#0F172A]">
                                {mode === 'create'
                                    ? currentLocale === 'ar'
                                        ? 'خدمة جديدة'
                                        : 'New service'
                                    : currentLocale === 'ar'
                                      ? service?.title_ar
                                      : service?.title_en}
                            </h1>
                            {service ? <StatusBadge status={service.status} /> : null}
                            {isDeleted ? <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Deleted</span> : null}
                        </div>
                    </div>
                    {mode === 'edit' && canManageContent ? (
                        <div className="flex flex-wrap gap-2">
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

                <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_380px]">
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
                                        placeholder={currentLocale === 'ar' ? 'يُنشأ تلقائياً عند تركه فارغاً' : 'Generated from English title when left blank'}
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 font-mono text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    <FieldError message={form.errors.slug} />
                                </label>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الوصف المختصر بالإنجليزية' : 'English short description'}</span>
                                        <textarea
                                            value={form.data.short_description_en}
                                            onChange={(event) => form.setData('short_description_en', event.target.value)}
                                            disabled={!canEdit}
                                            rows={4}
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.short_description_en} />
                                    </label>
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الوصف المختصر بالعربية' : 'Arabic short description'}</span>
                                        <textarea
                                            value={form.data.short_description_ar}
                                            onChange={(event) => form.setData('short_description_ar', event.target.value)}
                                            disabled={!canEdit}
                                            rows={4}
                                            dir="rtl"
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.short_description_ar} />
                                    </label>
                                </div>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الوصف الكامل بالإنجليزية' : 'English description'}</span>
                                        <textarea
                                            value={form.data.description_en}
                                            onChange={(event) => form.setData('description_en', event.target.value)}
                                            disabled={!canEdit}
                                            rows={8}
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.description_en} />
                                    </label>
                                    <label className="grid gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الوصف الكامل بالعربية' : 'Arabic description'}</span>
                                        <textarea
                                            value={form.data.description_ar}
                                            onChange={(event) => form.setData('description_ar', event.target.value)}
                                            disabled={!canEdit}
                                            rows={8}
                                            dir="rtl"
                                            className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                        />
                                        <FieldError message={form.errors.description_ar} />
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
                                {currentLocale === 'ar' ? 'النشر والعرض' : 'Publishing and display'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
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
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الترتيب' : 'Sort order'}</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.data.sort_order}
                                    onChange={(event) => form.setData('sort_order', Number(event.target.value || 0))}
                                    disabled={!canEdit}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                />
                                <FieldError message={form.errors.sort_order} />
                            </label>
                            <label className="flex items-center gap-3 rounded-md border border-[#D8E2EC] bg-[#F4F7FA] p-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_featured}
                                    onChange={(event) => form.setData('is_featured', event.target.checked)}
                                    disabled={!canEdit}
                                    className="size-4 accent-[#0AA6B5]"
                                />
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'خدمة مميزة في الصفحة الرئيسية' : 'Featured on homepage'}</span>
                            </label>
                            <FieldError message={form.errors.is_featured} />
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الأيقونة' : 'Icon key'}</span>
                                <input
                                    value={form.data.icon}
                                    onChange={(event) => form.setData('icon', event.target.value)}
                                    disabled={!canEdit}
                                    placeholder="statistical-consulting"
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 font-mono text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                />
                                <FieldError message={form.errors.icon} />
                            </label>
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'مسار الصورة' : 'Image path'}</span>
                                <input
                                    value={form.data.image_path}
                                    onChange={(event) => form.setData('image_path', event.target.value)}
                                    disabled={!canEdit}
                                    placeholder="images/services/example.jpg"
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 font-mono text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                />
                                <FieldError message={form.errors.image_path} />
                            </label>
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
                                          ? 'حفظ الخدمة'
                                          : 'Save service'}
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}
