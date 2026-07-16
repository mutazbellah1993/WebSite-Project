import type { LocalizedText } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import type { LocaleCode } from '@/types';

type SectionHeadingProps = {
    eyebrow?: LocalizedText;
    title: LocalizedText;
    description?: LocalizedText;
    locale: LocaleCode;
    align?: 'start' | 'center';
};

export function SectionHeading({ eyebrow, title, description, locale, align = 'start' }: SectionHeadingProps) {
    return (
        <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            {eyebrow ? (
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                    {text(eyebrow, locale)}
                </p>
            ) : null}
            <h2 className="text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
                {text(title, locale)}
            </h2>
            {description ? (
                <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{text(description, locale)}</p>
            ) : null}
        </div>
    );
}
