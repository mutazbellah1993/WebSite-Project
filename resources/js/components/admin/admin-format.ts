import type { LocaleCode } from '@/types';

export function humanizeStatus(value: string): string {
    return value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function formatDateTime(value: string | null, locale: LocaleCode): string {
    if (!value) {
        return locale === 'ar' ? 'غير محدد' : 'Not set';
    }

    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export function formatDate(value: string | null, locale: LocaleCode): string {
    if (!value) {
        return locale === 'ar' ? 'غير محدد' : 'Not set';
    }

    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', {
        dateStyle: 'medium',
    }).format(new Date(value));
}
