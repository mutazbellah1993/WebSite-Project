import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { LocaleCode, SharedPageProps } from '@/types';

const languageLabels: Record<LocaleCode, string> = {
    en: 'EN',
    ar: 'ع',
};

function localizedHref(url: string, locale: LocaleCode): string {
    const path = url.split('?')[0] || '/';

    return `${path}?locale=${locale}`;
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    const page = usePage<SharedPageProps>();
    const currentLocale = page.props.locale.current;

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border border-[#D8E2EC] bg-white p-1 shadow-sm',
                compact && 'w-full justify-center',
            )}
            aria-label="Language switcher"
        >
            {(['en', 'ar'] as LocaleCode[]).map((locale) => (
                <Link
                    key={locale}
                    href={localizedHref(page.url, locale)}
                    preserveScroll
                    className={cn(
                        'min-w-10 rounded-full px-3 py-1.5 text-center text-sm font-semibold transition',
                        currentLocale === locale
                            ? 'bg-[#082D67] text-white'
                            : 'text-[#475569] hover:bg-[#F4F7FA] hover:text-[#0AA6B5]',
                    )}
                    aria-current={currentLocale === locale ? 'true' : undefined}
                >
                    {languageLabels[locale]}
                </Link>
            ))}
        </div>
    );
}
