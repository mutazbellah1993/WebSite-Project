import { Link } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { LocalizedText } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import type { LocaleCode, TextDirection } from '@/types';

type PageHeroProps = {
    eyebrow?: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    locale: LocaleCode;
    direction: TextDirection;
    primaryAction?: {
        href: string;
        label: LocalizedText;
    };
    secondaryAction?: {
        href: string;
        label: LocalizedText;
    };
    visual?: ReactNode;
};

export function PageHero({
    eyebrow,
    title,
    description,
    locale,
    direction,
    primaryAction,
    secondaryAction,
    visual,
}: PageHeroProps) {
    return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,184,166,0.24),transparent_40%),radial-gradient(circle_at_70%_10%,rgba(56,189,248,0.2),transparent_28%)]" />
            <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
                <div className="flex flex-col justify-center">
                    {eyebrow ? (
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">
                            {text(eyebrow, locale)}
                        </p>
                    ) : null}
                    <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-white md:text-6xl">
                        {text(title, locale)}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{text(description, locale)}</p>
                    {(primaryAction || secondaryAction) && (
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            {primaryAction ? (
                                <Link
                                    href={primaryAction.href}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-3 focus:ring-teal-200"
                                >
                                    {text(primaryAction.label, locale)}
                                    <ArrowRight
                                        className={direction === 'rtl' ? 'size-4 rotate-180' : 'size-4'}
                                        aria-hidden="true"
                                    />
                                </Link>
                            ) : null}
                            {secondaryAction ? (
                                <Link
                                    href={secondaryAction.href}
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-3 focus:ring-white/25"
                                >
                                    {text(secondaryAction.label, locale)}
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </Link>
                            ) : null}
                        </div>
                    )}
                </div>
                {visual ? <div className="flex items-center justify-center lg:justify-end">{visual}</div> : null}
            </div>
        </section>
    );
}
