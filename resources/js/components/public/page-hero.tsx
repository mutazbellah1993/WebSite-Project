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
        <section className="relative overflow-hidden bg-[#061B3A] text-white">
            <div
                className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,199,207,0.22),transparent_38%),radial-gradient(circle_at_74%_12%,rgba(10,166,181,0.24),transparent_28%)]"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.24)_1px,transparent_1px)] [background-size:72px_72px]"
                aria-hidden="true"
            />
            <div
                className="absolute right-[6%] top-16 hidden h-40 w-72 rotate-[-8deg] rounded-md border border-[#22C7CF]/25 lg:block"
                aria-hidden="true"
            >
                <div className="absolute bottom-6 left-8 h-12 w-5 rounded-t-sm bg-[#22C7CF]/50" />
                <div className="absolute bottom-6 left-20 h-20 w-5 rounded-t-sm bg-[#22C7CF]/70" />
                <div className="absolute bottom-6 left-32 h-16 w-5 rounded-t-sm bg-white/35" />
                <div className="absolute bottom-6 left-44 h-28 w-5 rounded-t-sm bg-[#22C7CF]/80" />
                <div className="absolute left-7 top-24 h-1 w-52 origin-left rotate-[-20deg] rounded-full bg-[#22C7CF]" />
            </div>
            <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
                <div className="flex flex-col justify-center">
                    {eyebrow ? (
                        <p className="mb-5 text-base font-bold uppercase tracking-normal text-white md:text-lg">
                            {text(eyebrow, locale)}
                        </p>
                    ) : null}
                    <h1 className="max-w-4xl text-4xl font-extrabold tracking-normal text-white md:text-6xl">
                        {text(title, locale)}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg font-normal leading-8 text-[#D7E4F2]">
                        {text(description, locale)}
                    </p>
                    {(primaryAction || secondaryAction) && (
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            {primaryAction ? (
                                <Link
                                    href={primaryAction.href}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#22C7CF] px-5 py-3 text-sm font-bold text-[#061B3A] transition hover:bg-white focus:outline-none focus:ring-3 focus:ring-[#22C7CF]/40"
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
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:border-[#22C7CF] hover:bg-white/10 focus:outline-none focus:ring-3 focus:ring-white/25"
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
