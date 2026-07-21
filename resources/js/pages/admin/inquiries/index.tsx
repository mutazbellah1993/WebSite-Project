import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { EmptyState } from '@/components/admin/empty-state';
import { formatDateTime, humanizeStatus } from '@/components/admin/admin-format';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InquiryListItem, InquiryStatus, LocaleCode, Paginated } from '@/types';

type Props = {
    inquiries: Paginated<InquiryListItem>;
    filters: {
        search: string;
        status: string;
        trashed: string;
    };
    statuses: InquiryStatus[];
    canManageLeads: boolean;
    locale: {
        current: LocaleCode;
    };
};

export default function InquiryIndex({ inquiries, filters, statuses, locale }: Props) {
    const currentLocale = locale.current;
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [trashed, setTrashed] = useState(filters.trashed);
    const [loading, setLoading] = useState(false);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            '/admin/inquiries',
            { search, status, trashed },
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
        setTrashed('');
        router.get('/admin/inquiries', {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Contact Inquiries" />
            <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase text-[#0AA6B5]">
                            {currentLocale === 'ar' ? 'إدارة الاستفسارات' : 'Lead management'}
                        </p>
                        <h1 className="text-3xl font-extrabold text-[#0F172A]">
                            {currentLocale === 'ar' ? 'استفسارات التواصل' : 'Contact inquiries'}
                        </h1>
                    </div>
                    <p className="text-sm font-medium text-[#475569]">
                        {inquiries.from ?? 0}-{inquiries.to ?? 0} / {inquiries.total}
                    </p>
                </div>

                <Card className="rounded-lg border-[#D8E2EC] bg-white">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-[#0F172A]">
                            {currentLocale === 'ar' ? 'بحث وتصفية' : 'Search and filters'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto_auto]">
                            <label className="grid gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">{currentLocale === 'ar' ? 'بحث' : 'Search'}</span>
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className="h-10 rounded-md border border-[#D8E2EC] bg-white px-3 text-sm text-[#0F172A] outline-none focus:border-[#0AA6B5] focus:ring-3 focus:ring-[#22C7CF]/25"
                                    placeholder={currentLocale === 'ar' ? 'الاسم أو البريد أو الموضوع' : 'Name, email, phone, subject'}
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
                        {inquiries.data.length === 0 ? (
                            <EmptyState
                                title={currentLocale === 'ar' ? 'لا توجد استفسارات' : 'No inquiries found'}
                                description={
                                    currentLocale === 'ar'
                                        ? 'جرّب تغيير البحث أو المرشحات لعرض نتائج أخرى.'
                                        : 'Try adjusting search or filters to find matching contact inquiries.'
                                }
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[880px] text-sm">
                                    <thead>
                                        <tr className="border-b border-[#D8E2EC] text-left text-xs uppercase text-[#475569]">
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'المرسل' : 'Sender'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الموضوع' : 'Subject'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الحالة' : 'Status'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'المسؤول' : 'Assignee'}</th>
                                            <th className="py-3 pe-4 font-bold">{currentLocale === 'ar' ? 'الوصول' : 'Received'}</th>
                                            <th className="py-3 text-right font-bold">{currentLocale === 'ar' ? 'إجراء' : 'Action'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D8E2EC]">
                                        {inquiries.data.map((inquiry) => (
                                            <tr key={inquiry.id} className={inquiry.deleted_at ? 'bg-red-50/60' : undefined}>
                                                <td className="py-4 pe-4">
                                                    <p className="font-bold text-[#0F172A]">{inquiry.name}</p>
                                                    <p className="text-[#475569]">{inquiry.email}</p>
                                                    {inquiry.organization ? <p className="text-xs text-[#475569]">{inquiry.organization}</p> : null}
                                                </td>
                                                <td className="py-4 pe-4 text-[#0F172A]">{inquiry.subject || '-'}</td>
                                                <td className="py-4 pe-4">
                                                    <StatusBadge status={inquiry.status} />
                                                    {inquiry.deleted_at ? <p className="mt-2 text-xs font-bold text-red-700">Deleted</p> : null}
                                                </td>
                                                <td className="py-4 pe-4 text-[#475569]">{inquiry.assignee?.name ?? '-'}</td>
                                                <td className="py-4 pe-4 text-[#475569]">{formatDateTime(inquiry.created_at, currentLocale)}</td>
                                                <td className="py-4 text-right">
                                                    <Link href={`/admin/inquiries/${inquiry.id}`} className="font-bold text-[#0AA6B5] hover:text-[#082D67]">
                                                        {currentLocale === 'ar' ? 'عرض' : 'View'}
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

                <AdminPagination links={inquiries.links} />
            </div>
        </>
    );
}
