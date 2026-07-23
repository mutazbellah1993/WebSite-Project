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

export type ContactContext = {
    website: string;
    email: string;
    email_href: string;
    phone: string;
    phone_href: string;
    whatsapp_url: string;
    linkedin_url: string;
};

export type SharedPageProps = {
    name: string;
    appUrl: string;
    brand: BrandContext;
    contact: ContactContext;
    locale: LocaleContext;
    sidebarOpen: boolean;
};
