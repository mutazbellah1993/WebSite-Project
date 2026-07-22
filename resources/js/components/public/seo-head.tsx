import { Head, usePage } from '@inertiajs/react';
import type { LocalizedText } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import type { LocaleCode, SharedPageProps } from '@/types';

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
    const page = usePage<SharedPageProps>();
    const localizedTitle = text(title, locale);
    const localizedDescription = text(description, locale);
    const defaultCanonicalUrl = `${page.props.appUrl}${page.url.split('?')[0]}`;
    const resolvedCanonicalUrl = canonicalUrl ?? defaultCanonicalUrl;
    const resolvedImageUrl = imageUrl ?? `${page.props.appUrl}/brand/elitedata-official-logo.png`;

    return (
        <Head title={localizedTitle}>
            <meta name="description" content={localizedDescription} />
            {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
            <link rel="canonical" href={resolvedCanonicalUrl} />
            {alternateUrls
                ? Object.entries(alternateUrls).map(([language, href]) =>
                      href ? <link key={language} rel="alternate" hrefLang={language} href={href} /> : null,
                  )
                : null}
            <meta property="og:title" content={`${localizedTitle} - ELITEDATA`} />
            <meta property="og:description" content={localizedDescription} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={resolvedCanonicalUrl} />
            <meta property="og:image" content={resolvedImageUrl} />
            {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={resolvedImageUrl} />
            {structuredData ? <script type="application/ld+json">{JSON.stringify(structuredData)}</script> : null}
        </Head>
    );
}
