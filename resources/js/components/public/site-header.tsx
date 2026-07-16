import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/components/public/brand-logo';
import { LanguageSwitcher } from '@/components/public/language-switcher';
import { navItems, text } from '@/lib/public-content';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types';

export function SiteHeader() {
    const [open, setOpen] = useState(false);
    const page = usePage<SharedPageProps>();
    const locale = page.props.locale.current;
    const path = page.url.split('?')[0] || '/';

    return (
        <header className="sticky top-0 z-50 border-b border-[#D8E2EC] bg-white/95 shadow-sm shadow-[#061B3A]/5 backdrop-blur">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
                <BrandLogo />
                <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
                    {navItems.map((item) => {
                        const active = item.href === path;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm font-medium transition',
                                    active
                                        ? 'bg-[#E7F8FA] text-[#0AA6B5]'
                                        : 'text-[#0F172A] hover:bg-[#F4F7FA] hover:text-[#0AA6B5]',
                                )}
                                aria-current={active ? 'page' : undefined}
                            >
                                {text(item.label, locale)}
                            </Link>
                        );
                    })}
                </nav>
                <div className="hidden items-center gap-3 lg:flex">
                    <LanguageSwitcher />
                    <Link
                        href="/request-a-study"
                        className="rounded-md bg-[#082D67] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0AA6B5] focus:outline-none focus:ring-3 focus:ring-[#22C7CF]/35"
                    >
                        {locale === 'ar' ? 'طلب دراسة' : 'Request'}
                    </Link>
                </div>
                <button
                    type="button"
                    className="inline-flex size-11 items-center justify-center rounded-md border border-[#D8E2EC] text-[#082D67] transition hover:border-[#0AA6B5] hover:text-[#0AA6B5] lg:hidden"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-controls="mobile-navigation"
                    aria-label={open ? 'Close navigation' : 'Open navigation'}
                >
                    {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
                </button>
            </div>
            {open ? (
                <div id="mobile-navigation" className="border-t border-[#D8E2EC] bg-white px-5 py-5 shadow-lg lg:hidden">
                    <nav className="grid gap-2" aria-label="Mobile navigation">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-md px-3 py-3 text-base font-semibold text-[#0F172A] transition hover:bg-[#F4F7FA] hover:text-[#0AA6B5]"
                                onClick={() => setOpen(false)}
                            >
                                {text(item.label, locale)}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-5">
                        <LanguageSwitcher compact />
                    </div>
                </div>
            ) : null}
        </header>
    );
}
