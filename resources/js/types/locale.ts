export type LocaleCode = 'en' | 'ar';

export type TextDirection = 'ltr' | 'rtl';

export type LocaleMeta = {
    name: string;
    native: string;
    direction: TextDirection;
};

export type LocaleContext = {
    current: LocaleCode;
    fallback: LocaleCode;
    direction: TextDirection;
    supported: Record<LocaleCode, LocaleMeta>;
};

export type BrandContext = {
    name: string;
    service_line: string;
    tagline: Record<LocaleCode, string>;
};

export type SharedPageProps = {
    name: string;
    brand: BrandContext;
    locale: LocaleContext;
    sidebarOpen: boolean;
};
