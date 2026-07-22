import { usePage } from '@inertiajs/react';
import { PageHero } from '@/components/public/page-hero';
import { SeoHead } from '@/components/public/seo-head';
import type { SharedPageProps } from '@/types';

const sections = {
    en: [
        {
            title: 'Use of the Website',
            body: 'This website provides information about EliteData services and allows visitors to submit inquiries and study requests. You agree to use the website lawfully and avoid submitting harmful, misleading, or unauthorized content.',
        },
        {
            title: 'Service Requests',
            body: 'Submitting a request through the website does not create a contract, guarantee availability, or confirm acceptance of a project. EliteData may review the request and respond with questions, clarification, or a proposal where appropriate.',
        },
        {
            title: 'Content',
            body: 'Website content is provided for general information about research, statistics, and data analytics services. Published research or reports should be read within their stated scope, methodology, and limitations.',
        },
        {
            title: 'Uploaded Materials',
            body: 'If a request form allows attachments, you are responsible for ensuring that you have the right to share the uploaded material and that it does not contain malware or unlawful content.',
        },
        {
            title: 'Changes',
            body: 'EliteData may update website content, public pages, forms, and these terms as needed for operational or legal reasons.',
        },
    ],
    ar: [
        {
            title: 'استخدام الموقع',
            body: 'يوفر هذا الموقع معلومات عن خدمات EliteData ويسمح للزوار بإرسال الاستفسارات وطلبات الدراسات. يوافق المستخدم على استخدام الموقع بشكل قانوني وتجنب إرسال محتوى ضار أو مضلل أو غير مصرح به.',
        },
        {
            title: 'طلبات الخدمات',
            body: 'إرسال طلب عبر الموقع لا ينشئ عقدا ولا يضمن توفر الخدمة ولا يعني قبول المشروع. قد تراجع EliteData الطلب وترد بأسئلة أو توضيحات أو عرض مناسب عند الحاجة.',
        },
        {
            title: 'المحتوى',
            body: 'يقدم محتوى الموقع معلومات عامة عن خدمات البحث والإحصاء وتحليل البيانات. يجب قراءة أي أبحاث أو تقارير منشورة ضمن نطاقها ومنهجيتها وقيودها المعلنة.',
        },
        {
            title: 'المواد المرفوعة',
            body: 'إذا سمح نموذج الطلب بإرفاق ملفات، فأنت مسؤول عن امتلاك الحق في مشاركة المواد المرفوعة والتأكد من خلوها من البرمجيات الضارة أو المحتوى غير القانوني.',
        },
        {
            title: 'التغييرات',
            body: 'قد تقوم EliteData بتحديث محتوى الموقع والصفحات العامة والنماذج وهذه الشروط عند الحاجة لأسباب تشغيلية أو قانونية.',
        },
    ],
};

export default function Terms() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Terms of Use', ar: 'شروط الاستخدام' }}
                description={{
                    en: 'Terms of Use for the EliteData website and public forms.',
                    ar: 'شروط استخدام موقع EliteData والنماذج العامة.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Legal', ar: 'الشروط القانونية' }}
                title={{ en: 'Terms of Use', ar: 'شروط الاستخدام' }}
                description={{
                    en: 'Basic terms for using the EliteData public website and submitting inquiries or study requests.',
                    ar: 'شروط أساسية لاستخدام موقع EliteData العام وإرسال الاستفسارات أو طلبات الدراسات.',
                }}
            />
            <section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    {sections[currentLocale].map((section) => (
                        <section key={section.title} className="rounded-lg border border-[#D8E2EC] bg-[#F4F7FA] p-6">
                            <h2 className="text-2xl font-extrabold text-[#0F172A]">{section.title}</h2>
                            <p className="mt-3 text-base leading-8 text-[#475569]">{section.body}</p>
                        </section>
                    ))}
                </div>
            </section>
        </>
    );
}
