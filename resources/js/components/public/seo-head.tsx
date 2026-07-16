import { Head } from '@inertiajs/react';
import type { LocalizedText } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import type { LocaleCode } from '@/types';

type SeoHeadProps = {
    title: LocalizedText;
    description: LocalizedText;
    locale: LocaleCode;
};

export function SeoHead({ title, description, locale }: SeoHeadProps) {
    const localizedTitle = text(title, locale);
    const localizedDescription = text(description, locale);

    return (
        <Head title={localizedTitle}>
            <meta name="description" content={localizedDescription} />
            <meta property="og:title" content={`${localizedTitle} - ELITEDATA`} />
            <meta property="og:description" content={localizedDescription} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
        </Head>
    );
}
