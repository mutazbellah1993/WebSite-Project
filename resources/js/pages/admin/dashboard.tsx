import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, ClipboardList, FileText } from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { formatDateTime, humanizeStatus } from '@/components/admin/admin-format';
import { StatusBadge } from '@/components/admin/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LocaleCode } from '@/types';

type StatusCount = {
    status: string;
    count: number;
};

type RecentSubmission = {
    id: number;
    type: 'inquiry' | 'study_request';
    title: string;
    name: string;
    email: string;
    status: string;
    created_at: string | null;
    href: string;
};

type Props = {
    metrics: {
        newInquiries: number;
        newStudyRequests: number;
        requestsByStatus: StatusCount[];
    };
    recentSubmissions: RecentSubmission[];
    canManageLeads: boolean;
    locale: {
        current: LocaleCode;
    };
};

export default function AdminDashboard({ metrics, recentSubmissions, locale }: Props) {
    const currentLocale = locale.current;

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold uppercase text-[#0AA6B5]">
                        {currentLocale === 'ar' ? 'لوحة التحكم' : 'Overview'}
                    </p>
                    <h1 className="text-3xl font-extrabold text-[#0F172A]">
                        {currentLocale === 'ar' ? 'متابعة الاستفسارات وطلبات الدراسات' : 'Lead operations dashboard'}
                    </h1>
                    <p className="max-w-3xl text-sm leading-6 text-[#475569]">
                        {currentLocale === 'ar'
                            ? 'ملخص سريع للطلبات الجديدة، حالات طلبات الدراسات، وآخر الرسائل الواردة.'
                            : 'A focused snapshot of new leads, study request status, and recent public submissions.'}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'استفسارات جديدة' : 'New contact inquiries'}
                            </CardTitle>
                            <ClipboardList className="size-5 text-[#0AA6B5]" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold text-[#082D67]">{metrics.newInquiries}</p>
                            <Link href="/admin/inquiries?status=new" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5]">
                                {currentLocale === 'ar' ? 'عرض الاستفسارات' : 'View inquiries'}
                                <ArrowUpRight className="size-4" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'طلبات دراسات جديدة' : 'New study requests'}
                            </CardTitle>
                            <FileText className="size-5 text-[#0AA6B5]" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-extrabold text-[#082D67]">{metrics.newStudyRequests}</p>
                            <Link
                                href="/admin/study-requests?status=new"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0AA6B5]"
                            >
                                {currentLocale === 'ar' ? 'عرض طلبات الدراسات' : 'View study requests'}
                                <ArrowUpRight className="size-4" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'طلبات الدراسات حسب الحالة' : 'Study requests by status'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {metrics.requestsByStatus.map((item) => (
                                <div key={item.status} className="flex items-center justify-between gap-4 rounded-md bg-[#F4F7FA] p-3">
                                    <StatusBadge status={item.status} />
                                    <span className="text-lg font-extrabold text-[#082D67]">{item.count}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-[#D8E2EC] bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-extrabold text-[#0F172A]">
                                {currentLocale === 'ar' ? 'آخر الرسائل والطلبات' : 'Recent submissions'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentSubmissions.length === 0 ? (
                                <EmptyState
                                    title={currentLocale === 'ar' ? 'لا توجد رسائل بعد' : 'No submissions yet'}
                                    description={
                                        currentLocale === 'ar'
                                            ? 'ستظهر الاستفسارات وطلبات الدراسات الجديدة هنا عند وصولها.'
                                            : 'New contact inquiries and study requests will appear here when they arrive.'
                                    }
                                />
                            ) : (
                                <div className="divide-y divide-[#D8E2EC]">
                                    {recentSubmissions.map((submission) => (
                                        <Link
                                            key={`${submission.type}-${submission.id}`}
                                            href={submission.href}
                                            className="grid gap-3 py-4 transition hover:bg-[#F4F7FA] sm:grid-cols-[1fr_auto]"
                                        >
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <StatusBadge status={submission.status} />
                                                    <span className="text-xs font-bold uppercase text-[#475569]">
                                                        {submission.type === 'inquiry'
                                                            ? currentLocale === 'ar'
                                                                ? 'استفسار'
                                                                : 'Inquiry'
                                                            : currentLocale === 'ar'
                                                              ? 'طلب دراسة'
                                                              : 'Study request'}
                                                    </span>
                                                </div>
                                                <p className="mt-2 font-bold text-[#0F172A]">{submission.title}</p>
                                                <p className="text-sm text-[#475569]">
                                                    {submission.name} · {submission.email}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium text-[#475569]">
                                                {formatDateTime(submission.created_at, currentLocale)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
