import { useForm, usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { TextField, SelectField, TextareaField } from '@/components/public/form-fields';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { sectorOptions, serviceOptions } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

type StudyForm = {
    organization: string;
    name: string;
    email: string;
    phone: string;
    sector: string;
    service_interest: string;
    timeline: string;
    message: string;
    consent: boolean;
    website: string;
};

export default function RequestStudy() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;
    const form = useForm<StudyForm>({
        organization: '',
        name: '',
        email: '',
        phone: '',
        sector: '',
        service_interest: '',
        timeline: '',
        message: '',
        consent: false,
        website: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/request-a-study', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Request a Study', ar: 'طلب دراسة' }}
                description={{
                    en: 'Request a statistical study, survey, data analysis, market research, feasibility study, evaluation, impact assessment, dashboard, or research support from EliteData.',
                    ar: 'اطلب دراسة إحصائية أو مسحا أو تحليل بيانات أو بحث سوق أو دراسة جدوى أو تقييما أو تقييم أثر أو لوحة بيانات أو دعما بحثيا من إيليت داتا.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Request a Study', ar: 'طلب دراسة' }}
                title={{ en: 'Tell us what decision your research needs to support.', ar: 'أخبرنا ما القرار الذي يجب أن يدعمه البحث.' }}
                description={{
                    en: 'Use this form to outline the organization, sector, service need, timeline, and research question. The team can then shape the appropriate next step.',
                    ar: 'استخدم هذا النموذج لتوضيح المؤسسة والقطاع والخدمة المطلوبة والجدول الزمني والسؤال البحثي، ليتمكن الفريق من تحديد الخطوة المناسبة.',
                }}
            />

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
                    <SectionHeading
                        locale={currentLocale}
                        eyebrow={{ en: 'Study brief', ar: 'موجز الدراسة' }}
                        title={{ en: 'Start with the essentials', ar: 'ابدأ بالمعلومات الأساسية' }}
                        description={{
                            en: 'You do not need a finished methodology before reaching out. A clear question, audience, and expected use are enough to begin the conversation.',
                            ar: 'لا تحتاج إلى منهجية مكتملة قبل التواصل. يكفي وجود سؤال واضح والجمهور المتوقع وطريقة استخدام النتائج لبدء النقاش.',
                        }}
                    />
                    <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                        <input
                            type="text"
                            name="website"
                            value={form.data.website}
                            onChange={(event) => form.setData('website', event.target.value)}
                            className="hidden"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                        <div className="grid gap-5 md:grid-cols-2">
                            <TextField
                                id="organization"
                                label={{ en: 'Organization', ar: 'المؤسسة' }}
                                locale={currentLocale}
                                value={form.data.organization}
                                onChange={(event) => form.setData('organization', event.target.value)}
                                error={form.errors.organization}
                                required
                            />
                            <TextField
                                id="name"
                                label={{ en: 'Contact name', ar: 'اسم جهة التواصل' }}
                                locale={currentLocale}
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                error={form.errors.name}
                                autoComplete="name"
                                required
                            />
                            <TextField
                                id="email"
                                label={{ en: 'Email address', ar: 'البريد الإلكتروني' }}
                                locale={currentLocale}
                                value={form.data.email}
                                type="email"
                                autoComplete="email"
                                onChange={(event) => form.setData('email', event.target.value)}
                                error={form.errors.email}
                                required
                            />
                            <TextField
                                id="phone"
                                label={{ en: 'Phone or WhatsApp', ar: 'الهاتف أو واتساب' }}
                                locale={currentLocale}
                                value={form.data.phone}
                                autoComplete="tel"
                                onChange={(event) => form.setData('phone', event.target.value)}
                                error={form.errors.phone}
                            />
                            <SelectField
                                id="sector"
                                label={{ en: 'Sector', ar: 'القطاع' }}
                                locale={currentLocale}
                                value={form.data.sector}
                                placeholder={{ en: 'Select a sector', ar: 'اختر القطاع' }}
                                options={sectorOptions}
                                onChange={(event) => form.setData('sector', event.target.value)}
                                error={form.errors.sector}
                                required
                            />
                            <SelectField
                                id="service_interest"
                                label={{ en: 'Service interest', ar: 'الخدمة المطلوبة' }}
                                locale={currentLocale}
                                value={form.data.service_interest}
                                placeholder={{ en: 'Select a service', ar: 'اختر الخدمة' }}
                                options={serviceOptions}
                                onChange={(event) => form.setData('service_interest', event.target.value)}
                                error={form.errors.service_interest}
                                required
                            />
                            <TextField
                                id="timeline"
                                label={{ en: 'Preferred timeline', ar: 'الجدول الزمني المفضل' }}
                                locale={currentLocale}
                                value={form.data.timeline}
                                onChange={(event) => form.setData('timeline', event.target.value)}
                                error={form.errors.timeline}
                                placeholder={{ en: 'Example: within two months', ar: 'مثال: خلال شهرين' }}
                            />
                        </div>
                        <div className="mt-5">
                            <TextareaField
                                id="message"
                                label={{ en: 'Research question or study need', ar: 'السؤال البحثي أو احتياج الدراسة' }}
                                locale={currentLocale}
                                value={form.data.message}
                                onChange={(event) => form.setData('message', event.target.value)}
                                error={form.errors.message}
                                placeholder={{
                                    en: 'Describe what you need to learn, the audience for the findings, and any data already available.',
                                    ar: 'صف ما تحتاج إلى معرفته، والجمهور المستهدف من النتائج، وأي بيانات متاحة حاليا.',
                                }}
                                required
                            />
                        </div>
                        <div className="mt-5 flex items-start gap-3">
                            <input
                                id="consent"
                                name="consent"
                                type="checkbox"
                                checked={form.data.consent}
                                onChange={(event) => form.setData('consent', event.target.checked)}
                                aria-invalid={Boolean(form.errors.consent)}
                                aria-describedby={form.errors.consent ? 'consent-error' : undefined}
                                className="mt-1 size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                            />
                            <div>
                                <label htmlFor="consent" className="text-sm leading-6 text-slate-700">
                                    {currentLocale === 'ar'
                                        ? 'أوافق على استخدام هذه المعلومات للرد على طلب الدراسة.'
                                        : 'I agree that this information may be used to respond to this study request.'}
                                </label>
                                {form.errors.consent ? (
                                    <p id="consent-error" className="mt-1 text-sm text-red-700">
                                        {form.errors.consent}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Send className="size-4" aria-hidden="true" />
                            {form.processing
                                ? currentLocale === 'ar'
                                    ? 'جار الإرسال...'
                                    : 'Sending...'
                                : currentLocale === 'ar'
                                  ? 'إرسال طلب الدراسة'
                                  : 'Send study request'}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
