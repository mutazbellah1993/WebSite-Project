import { useEffect, type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { SharedPageProps } from '@/types';

export function AppProviders({ children }: { children: ReactNode }) {
    return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
}

export function InertiaAwareProviders({ children }: { children: ReactNode }) {
    const { locale } = usePage<SharedPageProps>().props;
    const direction = locale?.direction ?? 'ltr';
    const currentLocale = locale?.current ?? 'en';

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        document.documentElement.lang = currentLocale;
        document.documentElement.dir = direction;
    }, [currentLocale, direction]);

    return (
        <>
            {children}
            <Toaster position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'} />
        </>
    );
}
