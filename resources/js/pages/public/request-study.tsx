import { useForm, usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { TextField, SelectField, TextareaField } from '@/components/public/form-fields';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeading } from '@/components/public/section-heading';
import { SeoHead } from '@/components/public/seo-head';
import { clientTypeOptions, serviceOptions } from '@/lib/public-content';
import type { SharedPageProps } from '@/types';

type StudyForm = {
    organization: string;
    full_name: string;
    email: string;
    phone: string;
    job_title: string;
    client_type: string;
    service_type: string;
    study_title: string;
    project_description: string;
    objectives: string;
    target_population: string;
    geographic_scope: string;
    desired_start_date: string;
    desired_end_date: string;
    consent: boolean;
    website: string;
};

export default function RequestStudy() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;
    const form = useForm<StudyForm>({
        organization: '',
        full_name: '',
        email: '',
        phone: '',
        job_title: '',
        client_type: '',
        service_type: '',
        study_title: '',
        project_description: '',
        objectives: '',
        target_population: '',
        geographic_scope: '',
        desired_start_date: '',
        desired_end_date: '',
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
                                id="full_name"
                                label={{ en: 'Contact name', ar: 'اسم جهة التواصل' }}
                                locale={currentLocale}
                                value={form.data.full_name}
                                onChange={(event) => form.setData('full_name', event.target.value)}
                                error={form.errors.full_name}
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
                            <TextField
                                id="job_title"
                                label={{ en: 'Job title', ar: 'المسمى الوظيفي' }}
                                locale={currentLocale}
                                value={form.data.job_title}
                                onChange={(event) => form.setData('job_title', event.target.value)}
                                error={form.errors.job_title}
                            />
                            <SelectField
                                id="client_type"
                                label={{ en: 'Client type', ar: 'نوع الجهة' }}
                                locale={currentLocale}
                                value={form.data.client_type}
                                placeholder={{ en: 'Select a client type', ar: 'اختر نوع الجهة' }}
                                options={clientTypeOptions}
                                onChange={(event) => form.setData('client_type', event.target.value)}
                                error={form.errors.client_type}
                                required
                            />
                            <SelectField
                                id="service_type"
                                label={{ en: 'Service interest', ar: 'الخدمة المطلوبة' }}
                                locale={currentLocale}
                                value={form.data.service_type}
                                placeholder={{ en: 'Select a service', ar: 'اختر الخدمة' }}
                                options={serviceOptions}
                                onChange={(event) => form.setData('service_type', event.target.value)}
                                error={form.errors.service_type}
                                required
                            />
                            <TextField
                                id="study_title"
                                label={{ en: 'Study title', ar: 'عنوان الدراسة' }}
                                locale={currentLocale}
                                value={form.data.study_title}
                                onChange={(event) => form.setData('study_title', event.target.value)}
                                error={form.errors.study_title}
                                placeholder={{ en: 'Example: beneficiary needs assessment', ar: 'مثال: تقييم احتياجات المستفيدين' }}
                            />
                        </div>
                        <div className="mt-5">
                            <TextareaField
                                id="project_description"
                                label={{ en: 'Research question or study need', ar: 'السؤال البحثي أو احتياج الدراسة' }}
                                locale={currentLocale}
                                value={form.data.project_description}
                                onChange={(event) => form.setData('project_description', event.target.value)}
                                error={form.errors.project_description}
                                placeholder={{
                                    en: 'Describe what you need to learn, the audience for the findings, and any data already available.',
                                    ar: 'صف ما تحتاج إلى معرفته، والجمهور المستهدف من النتائج، وأي بيانات متاحة حاليا.',
                                }}
                                required
                            />
                        </div>
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <TextareaField
                                id="objectives"
                                label={{ en: 'Objectives', ar: 'الأهداف' }}
                                locale={currentLocale}
                                value={form.data.objectives}
                                rows={4}
                                onChange={(event) => form.setData('objectives', event.target.value)}
                                error={form.errors.objectives}
                            />
                            <TextareaField
                                id="target_population"
                                label={{ en: 'Target population', ar: 'الفئة المستهدفة' }}
                                locale={currentLocale}
                                value={form.data.target_population}
                                rows={4}
                                onChange={(event) => form.setData('target_population', event.target.value)}
                                error={form.errors.target_population}
                            />
                            <TextField
                                id="geographic_scope"
                                label={{ en: 'Geographic scope', ar: 'النطاق الجغرافي' }}
                                locale={currentLocale}
                                value={form.data.geographic_scope}
                                onChange={(event) => form.setData('geographic_scope', event.target.value)}
                                error={form.errors.geographic_scope}
                            />
                            <TextField
                                id="desired_start_date"
                                label={{ en: 'Desired start date', ar: 'تاريخ البدء المفضل' }}
                                locale={currentLocale}
                                value={form.data.desired_start_date}
                                type="date"
                                onChange={(event) => form.setData('desired_start_date', event.target.value)}
                                error={form.errors.desired_start_date}
                            />
                            <TextField
                                id="desired_end_date"
                                label={{ en: 'Desired end date', ar: 'تاريخ الانتهاء المفضل' }}
                                locale={currentLocale}
                                value={form.data.desired_end_date}
                                type="date"
                                onChange={(event) => form.setData('desired_end_date', event.target.value)}
                                error={form.errors.desired_end_date}
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
