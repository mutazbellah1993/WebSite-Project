import { useForm, usePage } from '@inertiajs/react';
import { MailCheck, Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { SelectField, TextareaField, TextField } from '@/components/public/form-fields';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { contactSubjects } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

type ContactForm = {
    name: string;
    email: string;
    phone: string;
    organization: string;
    subject: string;
    message: string;
    consent: boolean;
    website: string;
};

export default function Contact() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;
    const form = useForm<ContactForm>({
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        message: '',
        consent: false,
        website: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/contact-us', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Contact Us', ar: 'اتصل بنا' }}
                description={{
                    en: 'Contact EliteData for research, statistics, survey, data analytics, monitoring and evaluation, impact assessment, and dashboard support.',
                    ar: 'تواصل مع إيليت داتا لدعم البحوث والإحصاء والمسوح وتحليل البيانات والمتابعة والتقييم وتقييم الأثر ولوحات البيانات.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Contact Us', ar: 'اتصل بنا' }}
                title={{ en: 'Start a focused conversation about your data need.', ar: 'ابدأ نقاشا مركزا حول احتياجك للبيانات.' }}
                description={{
                    en: 'Send a general inquiry, partnership note, or research support question. For detailed project needs, the request form is usually the best starting point.',
                    ar: 'أرسل استفسارا عاما أو ملاحظة شراكة أو سؤالا حول الدعم البحثي. للاحتياجات التفصيلية، يكون نموذج طلب الدراسة غالبا أفضل نقطة بداية.',
                }}
                primaryAction={{ href: '/request-a-study', label: { en: 'Request a Study', ar: 'طلب دراسة' } }}
            />

            <section className="bg-white px-5 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
                    <div>
                        <SectionHeading
                            locale={currentLocale}
                            eyebrow={{ en: 'Contact form', ar: 'نموذج التواصل' }}
                            title={{ en: 'Send a message', ar: 'أرسل رسالة' }}
                            description={{
                                en: 'Use this form for general questions, collaboration discussions, or follow-up about EliteData services.',
                                ar: 'استخدم هذا النموذج للأسئلة العامة أو نقاشات التعاون أو المتابعة حول خدمات إيليت داتا.',
                            }}
                        />
                        <div className="mt-8 rounded-lg bg-[#F4F7FA] p-6 ring-1 ring-[#D8E2EC]">
                            <MailCheck className="mb-4 size-7 text-[#0AA6B5]" aria-hidden="true" />
                            <p className="text-sm font-normal leading-6 text-[#475569]">
                                {currentLocale === 'ar'
                                    ? 'يمكن إضافة البريد الرسمي ورقم الهاتف وعنوان المكتب بعد تأكيد بيانات الاتصال النهائية قبل الإطلاق.'
                                    : 'Official email, phone number, and office address can be added after final contact details are confirmed before launch.'}
                            </p>
                        </div>
                    </div>
                    <form onSubmit={submit} className="rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-6 shadow-sm">
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
                                id="name"
                                label={{ en: 'Full name', ar: 'الاسم الكامل' }}
                                locale={currentLocale}
                                value={form.data.name}
                                autoComplete="name"
                                onChange={(event) => form.setData('name', event.target.value)}
                                error={form.errors.name}
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
                            <TextField
                                id="organization"
                                label={{ en: 'Organization', ar: 'المؤسسة' }}
                                locale={currentLocale}
                                value={form.data.organization}
                                onChange={(event) => form.setData('organization', event.target.value)}
                                error={form.errors.organization}
                            />
                            <div className="md:col-span-2">
                                <SelectField
                                    id="subject"
                                    label={{ en: 'Subject', ar: 'الموضوع' }}
                                    locale={currentLocale}
                                    value={form.data.subject}
                                    placeholder={{ en: 'Select a subject', ar: 'اختر الموضوع' }}
                                    options={contactSubjects}
                                    onChange={(event) => form.setData('subject', event.target.value)}
                                    error={form.errors.subject}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-5">
                            <TextareaField
                                id="message"
                                label={{ en: 'Message', ar: 'الرسالة' }}
                                locale={currentLocale}
                                value={form.data.message}
                                onChange={(event) => form.setData('message', event.target.value)}
                                error={form.errors.message}
                                placeholder={{
                                    en: 'Tell us how EliteData can help.',
                                    ar: 'أخبرنا كيف يمكن لإيليت داتا مساعدتك.',
                                }}
                                required
                            />
                        </div>
                        <div className="mt-5 flex items-start gap-3">
                            <input
                                id="contact-consent"
                                name="consent"
                                type="checkbox"
                                checked={form.data.consent}
                                onChange={(event) => form.setData('consent', event.target.checked)}
                                aria-invalid={Boolean(form.errors.consent)}
                                aria-describedby={form.errors.consent ? 'contact-consent-error' : undefined}
                                className="mt-1 size-4 rounded border-[#D8E2EC] text-[#0AA6B5] focus:ring-[#0AA6B5]"
                            />
                            <div>
                                <label htmlFor="contact-consent" className="text-sm font-normal leading-6 text-[#475569]">
                                    {currentLocale === 'ar'
                                        ? 'أوافق على استخدام هذه المعلومات للرد على رسالتي.'
                                        : 'I agree that this information may be used to respond to my message.'}
                                </label>
                                {form.errors.consent ? (
                                    <p id="contact-consent-error" className="mt-1 text-sm text-red-700">
                                        {form.errors.consent}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#082D67] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0AA6B5] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Send className="size-4" aria-hidden="true" />
                            {form.processing
                                ? currentLocale === 'ar'
                                    ? 'جار الإرسال...'
                                    : 'Sending...'
                                : currentLocale === 'ar'
                                  ? 'إرسال الرسالة'
                                  : 'Send message'}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
