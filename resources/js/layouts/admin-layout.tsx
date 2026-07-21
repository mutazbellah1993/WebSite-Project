import { Link, usePage } from '@inertiajs/react';
import { BarChart3, ClipboardList, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';
import { InertiaAwareProviders } from '@/components/app-providers';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import type { SharedPageProps } from '@/types';

type AdminPageProps = SharedPageProps & {
    auth: {
        user: {
            name: string;
            email: string;
            role?: string;
        } | null;
    };
};

const navItems = [
    { href: '/admin', label: { en: 'Overview', ar: 'نظرة عامة' }, icon: LayoutDashboard },
    { href: '/admin/inquiries', label: { en: 'Contact Inquiries', ar: 'استفسارات التواصل' }, icon: ClipboardList },
    { href: '/admin/study-requests', label: { en: 'Study Requests', ar: 'طلبات الدراسات' }, icon: BarChart3 },
];

function label(copy: { en: string; ar: string }, locale: 'en' | 'ar'): string {
    return copy[locale];
}

function localizedHref(url: string, locale: 'en' | 'ar'): string {
    const path = url.split('?')[0] || '/admin';

    return `${path}?locale=${locale}`;
}

export default function AdminLayout({ children }: PropsWithChildren) {
    const page = usePage<AdminPageProps>();
    const [open, setOpen] = useState(false);
    const locale = page.props.locale.current;
    const direction = page.props.locale.direction;
    const currentPath = page.url.split('?')[0] || '/admin';
    const user = page.props.auth.user;

    const sidebar = (
        <aside className="flex h-full flex-col bg-[#061B3A] text-white">
            <div className="border-b border-white/10 p-5">
                <Link href="/admin" className="inline-flex rounded-md bg-white p-2" aria-label="EliteData admin dashboard">
                    <img
                        src="/brand/elitedata-official-logo.png"
                        alt="ELITEDATA"
                        className="h-auto w-auto max-w-[190px] object-contain"
                    />
                </Link>
            </div>
            <nav className="grid gap-1 p-4" aria-label="Admin navigation">
                {navItems.map((item) => {
                    const active = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-[#D7E4F2] transition',
                                active ? 'bg-[#0AA6B5] text-white' : 'hover:bg-white/10 hover:text-white',
                            )}
                            onClick={() => setOpen(false)}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon className="size-5" aria-hidden="true" />
                            <span>{label(item.label, locale)}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto border-t border-white/10 p-4 text-sm text-[#D7E4F2]">
                <p className="font-bold text-white">{user?.name}</p>
                <p className="mt-1 break-all">{user?.email}</p>
                {user?.role ? <p className="mt-2 text-xs uppercase text-[#22C7CF]">{user.role.replace('_', ' ')}</p> : null}
                <Link
                    href={logout()}
                    method="post"
                    as="button"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0AA6B5] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#22C7CF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C7CF]"
                    data-test="admin-logout-button"
                >
                    <LogOut className="size-4" aria-hidden="true" />
                    <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Log out'}</span>
                </Link>
            </div>
        </aside>
    );

    return (
        <InertiaAwareProviders>
            <div className={cn('min-h-screen bg-[#F4F7FA] text-[#0F172A]', direction === 'rtl' && 'text-right')} dir={direction}>
                <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">{sidebar}</div>

                {open ? (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button
                            type="button"
                            className="absolute inset-0 bg-[#061B3A]/70"
                            aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                            onClick={() => setOpen(false)}
                        />
                        <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">{sidebar}</div>
                    </div>
                ) : null}

                <div className="lg:ps-72">
                    <header className="sticky top-0 z-40 border-b border-[#D8E2EC] bg-white/95 shadow-sm shadow-[#061B3A]/5 backdrop-blur">
                        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                            <button
                                type="button"
                                className="inline-flex size-10 items-center justify-center rounded-md border border-[#D8E2EC] text-[#082D67] lg:hidden"
                                onClick={() => setOpen((value) => !value)}
                                aria-expanded={open}
                                aria-label={open ? 'Close admin navigation' : 'Open admin navigation'}
                            >
                                {open ? <X className="size-5" /> : <Menu className="size-5" />}
                            </button>
                            <div>
                                <p className="text-sm font-bold text-[#0AA6B5]">{locale === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}</p>
                                <p className="text-xs text-[#475569]">
                                    {locale === 'ar' ? 'إدارة الاستفسارات وطلبات الدراسات' : 'Manage inquiries and study requests'}
                                </p>
                            </div>
                            <div className="ms-auto flex items-center gap-2">
                                {(['en', 'ar'] as const).map((code) => (
                                    <Link
                                        key={code}
                                        href={localizedHref(page.url, code)}
                                        preserveScroll
                                        className={cn(
                                            'rounded-md px-3 py-2 text-sm font-bold transition',
                                            locale === code
                                                ? 'bg-[#082D67] text-white'
                                                : 'text-[#475569] hover:bg-[#F4F7FA] hover:text-[#0AA6B5]',
                                        )}
                                    >
                                        {code.toUpperCase()}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </header>
                    <main className="p-4 sm:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </InertiaAwareProviders>
    );
}
