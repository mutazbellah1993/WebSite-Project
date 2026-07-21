import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, RotateCcw, Save, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';
import { formatDateTime, humanizeStatus } from '@/components/admin/admin-format';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdminAssignee, InquiryDetail, InquiryStatus, LocaleCode } from '@/types';

type Props = {
    inquiry: InquiryDetail;
    statuses: InquiryStatus[];
    assignees: AdminAssignee[];
    canManageLeads: boolean;
    locale: {
        current: LocaleCode;
    };
};

function DetailField({ label, value }: { label: string; value: string | null }) {
    return (
        <div>
            <dt className="text-xs font-bold uppercase text-[#475569]">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium text-[#0F172A]">{value || '-'}</dd>
        </div>
    );
}

export default function InquiryShow({ inquiry, statuses, assignees, canManageLeads, locale }: Props) {
    const currentLocale = locale.current;
    const form = useForm({
        status: inquiry.status,
        assigned_to: inquiry.assigned_to ? String(inquiry.assigned_to) : '',
        internal_notes: inquiry.internal_notes ?? '',
    });
    const isDeleted = Boolean(inquiry.deleted_at);
    const canEdit = canManageLeads && !isDeleted;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.patch(`/admin/inquiries/${inquiry.id}`, { preserveScroll: true });
    }

    function destroy() {
        if (confirm(currentLocale === 'ar' ? 'هل تريد حذف هذا الاستفسار؟' : 'Delete this inquiry?')) {
            router.delete(`/admin/inquiries/${inquiry.id}`, { preserveScroll: true });
        }
    }

    function restore() {
        router.patch(`/admin/inquiries/${inquiry.id}/restore`, {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title={`Inquiry - ${inquiry.name}`} />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href="/admin/inquiries" className="inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5]">
                            <ArrowLeft className="size-4" />
                            {currentLocale === 'ar' ? 'العودة للاستفسارات' : 'Back to inquiries'}
                        </Link>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-[#0F172A]">{inquiry.name}</h1>
                            <StatusBadge status={inquiry.status} />
                            {isDeleted ? <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Deleted</span> : null}
                        </div>
                        <p className="mt-2 text-sm text-[#475569]">{inquiry.email}</p>
                    </div>
                    {canManageLeads ? (
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

                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                    <Card className="rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'تفاصيل الاستفسار' : 'Inquiry details'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <dl className="grid gap-5 md:grid-cols-2">
                                <DetailField label={currentLocale === 'ar' ? 'الاسم' : 'Name'} value={inquiry.name} />
                                <DetailField label={currentLocale === 'ar' ? 'البريد الإلكتروني' : 'Email'} value={inquiry.email} />
                                <DetailField label={currentLocale === 'ar' ? 'الهاتف' : 'Phone'} value={inquiry.phone} />
                                <DetailField label={currentLocale === 'ar' ? 'المؤسسة' : 'Organization'} value={inquiry.organization} />
                                <DetailField label={currentLocale === 'ar' ? 'الموضوع' : 'Subject'} value={inquiry.subject} />
                                <DetailField label={currentLocale === 'ar' ? 'اللغة' : 'Preferred language'} value={inquiry.preferred_language} />
                                <DetailField label={currentLocale === 'ar' ? 'المصدر' : 'Source'} value={inquiry.source} />
                                <DetailField label={currentLocale === 'ar' ? 'تاريخ الوصول' : 'Received'} value={formatDateTime(inquiry.created_at, currentLocale)} />
                                <DetailField label={currentLocale === 'ar' ? 'آخر تحديث' : 'Last updated'} value={formatDateTime(inquiry.updated_at, currentLocale)} />
                                <DetailField label={currentLocale === 'ar' ? 'تاريخ الرد' : 'Responded at'} value={formatDateTime(inquiry.responded_at, currentLocale)} />
                            </dl>
                            <div>
                                <h2 className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الرسالة' : 'Message'}</h2>
                                <p className="mt-3 whitespace-pre-wrap rounded-md bg-[#F4F7FA] p-4 text-sm leading-6 text-[#0F172A]">
                                    {inquiry.message}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'إدارة داخلية' : 'Internal management'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!canManageLeads ? (
                                <p className="rounded-md bg-[#F4F7FA] p-4 text-sm font-medium text-[#475569]">
                                    {currentLocale === 'ar' ? 'لديك صلاحية قراءة فقط.' : 'You have read-only access.'}
                                </p>
                            ) : null}
                            <form onSubmit={submit} className="mt-4 space-y-5">
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'الحالة' : 'Status'}</span>
                                    <select
                                        value={form.data.status}
                                        onChange={(event) => form.setData('status', event.target.value as InquiryStatus)}
                                        disabled={!canEdit}
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {humanizeStatus(status)}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.status ? <span className="text-sm text-red-700">{form.errors.status}</span> : null}
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'المسؤول' : 'Assignee'}</span>
                                    <select
                                        value={form.data.assigned_to}
                                        onChange={(event) => form.setData('assigned_to', event.target.value)}
                                        disabled={!canEdit}
                                        className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    >
                                        <option value="">{currentLocale === 'ar' ? 'بدون تعيين' : 'Unassigned'}</option>
                                        {assignees.map((assignee) => (
                                            <option key={assignee.id} value={assignee.id}>
                                                {assignee.name} ({assignee.role})
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.assigned_to ? <span className="text-sm text-red-700">{form.errors.assigned_to}</span> : null}
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-bold text-[#0F172A]">
                                        {currentLocale === 'ar' ? 'ملاحظات داخلية' : 'Internal notes'}
                                    </span>
                                    <textarea
                                        value={form.data.internal_notes}
                                        onChange={(event) => form.setData('internal_notes', event.target.value)}
                                        disabled={!canEdit}
                                        rows={8}
                                        className="rounded-md border border-[#D8E2EC] bg-white px-3 py-2 text-sm outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25 disabled:opacity-70"
                                    />
                                    {form.errors.internal_notes ? <span className="text-sm text-red-700">{form.errors.internal_notes}</span> : null}
                                </label>
                                {canEdit ? (
                                    <Button type="submit" disabled={form.processing} className="bg-[#082D67] font-bold text-white hover:bg-[#0AA6B5]">
                                        <Save className="size-4" />
                                        {form.processing
                                            ? currentLocale === 'ar'
                                                ? 'جار الحفظ'
                                                : 'Saving'
                                            : currentLocale === 'ar'
                                              ? 'حفظ التغييرات'
                                              : 'Save changes'}
                                    </Button>
                                ) : null}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
