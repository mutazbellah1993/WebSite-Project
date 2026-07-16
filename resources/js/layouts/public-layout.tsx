import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { InertiaAwareProviders } from '@/components/app-providers';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { cn } from '@/lib/utils';
import type { SharedPageProps } from '@/types';

export default function PublicLayout({ children }: PropsWithChildren) {
    const { locale } = usePage<SharedPageProps>().props;

    return (
        <InertiaAwareProviders>
            <div className={cn('min-h-screen bg-slate-50 text-slate-950', locale.direction === 'rtl' && 'text-right')}>
                <SiteHeader />
                <main>{children}</main>
                <SiteFooter />
            </div>
        </InertiaAwareProviders>
    );
}
