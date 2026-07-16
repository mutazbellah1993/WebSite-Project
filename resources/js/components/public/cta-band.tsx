import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { LocalizedText } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import type { LocaleCode, TextDirection } from '@/types';

type CtaBandProps = {
    title: LocalizedText;
    description: LocalizedText;
    action: {
        href: string;
        label: LocalizedText;
    };
    locale: LocaleCode;
    direction: TextDirection;
};

export function CtaBand({ title, description, action, locale, direction }: CtaBandProps) {
    return (
        <section className="bg-[#061B3A] px-5 py-16 text-white sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-lg border border-white/10 bg-[#082D67]/35 p-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-extrabold tracking-normal">{text(title, locale)}</h2>
                    <p className="mt-3 text-base font-normal leading-7 text-[#D7E4F2]">{text(description, locale)}</p>
                </div>
                <Link
                    href={action.href}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#22C7CF] px-5 py-3 text-sm font-bold text-[#061B3A] transition hover:bg-white focus:outline-none focus:ring-3 focus:ring-[#22C7CF]/40"
                >
                    {text(action.label, locale)}
                    <ArrowRight className={direction === 'rtl' ? 'size-4 rotate-180' : 'size-4'} aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
