import type { ChangeEventHandler, TextareaHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';
import type { LocalizedText } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import { cn } from '@/lib/utils';
import type { LocaleCode } from '@/types';

type BaseFieldProps = {
    id: string;
    label: LocalizedText;
    locale: LocaleCode;
    error?: string;
    required?: boolean;
};

type TextFieldProps = BaseFieldProps & {
    value: string;
    type?: string;
    autoComplete?: string;
    placeholder?: LocalizedText;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

type SelectFieldProps = BaseFieldProps & {
    value: string;
    placeholder: LocalizedText;
    options: Array<{ value: string; label: LocalizedText }>;
    onChange: ChangeEventHandler<HTMLSelectElement>;
};

type TextareaFieldProps = BaseFieldProps &
    Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> & {
        value: string;
        placeholder?: LocalizedText;
        onChange: ChangeEventHandler<HTMLTextAreaElement>;
    };

function FieldLabel({ id, label, locale, required }: Pick<BaseFieldProps, 'id' | 'label' | 'locale' | 'required'>) {
    return (
        <label htmlFor={id} className="text-sm font-bold text-[#0F172A]">
            {text(label, locale)}
            {required ? <span className="text-[#0AA6B5]"> *</span> : null}
        </label>
    );
}

function FieldError({ id, error }: { id: string; error?: string }) {
    if (!error) {
        return null;
    }

    return (
        <p id={`${id}-error`} className="text-sm text-red-700">
            {error}
        </p>
    );
}

export function TextField({
    id,
    label,
    locale,
    error,
    required,
    value,
    type = 'text',
    autoComplete,
    placeholder,
    onChange,
}: TextFieldProps) {
    return (
        <div className="grid gap-2">
            <FieldLabel id={id} label={label} locale={locale} required={required} />
            <Input
                id={id}
                name={id}
                type={type}
                value={value}
                autoComplete={autoComplete}
                placeholder={placeholder ? text(placeholder, locale) : undefined}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className="h-11 bg-white"
            />
            <FieldError id={id} error={error} />
        </div>
    );
}

export function SelectField({
    id,
    label,
    locale,
    error,
    required,
    value,
    placeholder,
    options,
    onChange,
}: SelectFieldProps) {
    return (
        <div className="grid gap-2">
            <FieldLabel id={id} label={label} locale={locale} required={required} />
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn(
                    'h-11 rounded-md border border-input bg-white px-3 text-base text-[#0F172A] shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm',
                    !value && 'text-[#475569]',
                )}
            >
                <option value="">{text(placeholder, locale)}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {text(option.label, locale)}
                    </option>
                ))}
            </select>
            <FieldError id={id} error={error} />
        </div>
    );
}

export function TextareaField({
    id,
    label,
    locale,
    error,
    required,
    value,
    rows = 6,
    placeholder,
    onChange,
}: TextareaFieldProps) {
    return (
        <div className="grid gap-2">
            <FieldLabel id={id} label={label} locale={locale} required={required} />
            <textarea
                id={id}
                name={id}
                rows={rows}
                value={value}
                placeholder={placeholder ? text(placeholder, locale) : undefined}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className="min-h-36 rounded-md border border-input bg-white px-3 py-2 text-base text-[#0F172A] shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            />
            <FieldError id={id} error={error} />
        </div>
    );
}
