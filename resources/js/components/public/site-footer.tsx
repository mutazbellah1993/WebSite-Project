import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/public/brand-logo';
import { navItems, services, text } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

export function SiteFooter() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <footer className="bg-[#061B3A] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
                <div>
                    <BrandLogo variant="light" />
                    <p className="mt-5 max-w-md text-sm font-normal leading-6 text-[#D7E4F2]">
                        {currentLocale === 'ar'
                            ? 'إيليت داتا شركة بحث إحصائي وتحليل بيانات تساعد المؤسسات على تحويل البيانات إلى قرارات واضحة.'
                            : 'EliteData is a research, statistics, and data analytics company helping organizations turn data into clear decisions.'}
                    </p>
                </div>
                <nav aria-label="Footer navigation">
                    <h2 className="text-sm font-bold uppercase text-[#22C7CF]">
                        {currentLocale === 'ar' ? 'الموقع' : 'Website'}
                    </h2>
                    <ul className="mt-5 space-y-3">
                        {navItems.slice(1).map((item) => (
                            <li key={item.href}>
                                <Link className="text-sm text-[#D7E4F2] transition hover:text-[#22C7CF]" href={item.href}>
                                    {text(item.label, currentLocale)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div>
                    <h2 className="text-sm font-bold uppercase text-[#22C7CF]">
                        {currentLocale === 'ar' ? 'خدمات رئيسية' : 'Core Services'}
                    </h2>
                    <ul className="mt-5 grid gap-3">
                        {services.slice(0, 5).map((service) => (
                            <li key={service.key} className="text-sm text-[#D7E4F2]">
                                {text(service.title, currentLocale)}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/request-a-study"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#22C7CF] transition hover:text-white"
                    >
                        {currentLocale === 'ar' ? 'ابدأ طلب دراسة' : 'Start a study request'}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm text-[#B8C7D9] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <p>ELITEDATA</p>
                        <Link href="/privacy-policy" className="transition hover:text-[#22C7CF]">
                            {currentLocale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                        </Link>
                        <Link href="/terms-of-use" className="transition hover:text-[#22C7CF]">
                            {currentLocale === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
                        </Link>
                    </div>
                    <p>
                        {currentLocale === 'ar'
                            ? 'تم إعداد الموقع لدعم العربية والإنجليزية.'
                            : 'Prepared for Arabic and English public communication.'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
