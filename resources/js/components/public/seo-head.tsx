import { Head } from '@inertiajs/react';
import type { LocalizedText } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import type { LocaleCode } from '@/types';

type SeoHeadProps = {
    title: LocalizedText;
    description: LocalizedText;
    locale: LocaleCode;
    canonicalUrl?: string;
    alternateUrls?: Partial<Record<LocaleCode, string>>;
    imageUrl?: string | null;
    ogType?: 'website' | 'article';
    publishedTime?: string | null;
    structuredData?: Record<string, unknown> | null;
    noindex?: boolean;
};

export function SeoHead({
    title,
    description,
    locale,
    canonicalUrl,
    alternateUrls,
    imageUrl,
    ogType = 'website',
    publishedTime,
    structuredData,
    noindex = false,
}: SeoHeadProps) {
    const localizedTitle = text(title, locale);
    const localizedDescription = text(description, locale);

    return (
        <Head title={localizedTitle}>
            <meta name="description" content={localizedDescription} />
            {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
            {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
            {alternateUrls
                ? Object.entries(alternateUrls).map(([language, href]) =>
                      href ? <link key={language} rel="alternate" hrefLang={language} href={href} /> : null,
                  )
                : null}
            <meta property="og:title" content={`${localizedTitle} - ELITEDATA`} />
            <meta property="og:description" content={localizedDescription} />
            <meta property="og:type" content={ogType} />
            {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
            {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
            {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}
            <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
            {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
            {structuredData ? <script type="application/ld+json">{JSON.stringify(structuredData)}</script> : null}
        </Head>
    );
}
