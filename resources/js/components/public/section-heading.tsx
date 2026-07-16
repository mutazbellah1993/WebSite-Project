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
                <p className="mb-3 text-sm font-bold uppercase text-[#0AA6B5]">
                    {text(eyebrow, locale)}
                </p>
            ) : null}
            <h2 className="text-3xl font-extrabold tracking-normal text-[#0F172A] md:text-4xl">
                {text(title, locale)}
            </h2>
            {description ? (
                <p className="mt-4 text-base font-normal leading-7 text-[#475569] md:text-lg">{text(description, locale)}</p>
            ) : null}
        </div>
    );
}
