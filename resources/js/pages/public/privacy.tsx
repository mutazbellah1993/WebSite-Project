import { usePage } from '@inertiajs/react';
import { PageHero } from '@/components/public/page-hero';
import { SeoHead } from '@/components/public/seo-head';
import type { SharedPageProps } from '@/types';

const sections = {
    en: [
        {
            title: 'Information We Collect',
            body: 'When you contact EliteData or request a study, the website may collect your name, email address, phone number, organization, role, project details, research objectives, geographic scope, timing preferences, and uploaded request attachments when that feature is available.',
        },
        {
            title: 'How We Use Information',
            body: 'We use submitted information to respond to inquiries, assess study requests, prepare appropriate follow-up, manage internal lead records, and operate the website securely.',
        },
        {
            title: 'Confidentiality',
            body: 'Submitted inquiry and study-request information is available only to authorized EliteData administrators inside the secured admin area. Internal notes are not shown on public pages.',
        },
        {
            title: 'Security and Retention',
            body: 'The application uses Laravel session authentication, CSRF protection, role-based admin access, validation, and controlled file handling. Records are retained as needed for communication, service planning, administration, and legal or operational requirements.',
        },
        {
            title: 'Contact',
            body: 'To ask about information submitted through the website, use the Contact Us page and include enough context for the team to identify your request.',
        },
    ],
    ar: [
        {
            title: 'المعلومات التي نجمعها',
            body: 'عند التواصل مع EliteData أو طلب دراسة، قد يجمع الموقع الاسم والبريد الإلكتروني ورقم الهاتف والمنظمة والمسمى الوظيفي وتفاصيل المشروع وأهداف البحث والنطاق الجغرافي وتفضيلات التوقيت ومرفقات طلب الدراسة عند توفر هذه الميزة.',
        },
        {
            title: 'كيفية استخدام المعلومات',
            body: 'نستخدم المعلومات المرسلة للرد على الاستفسارات، ودراسة طلبات المشاريع، وتجهيز المتابعة المناسبة، وإدارة سجلات الطلبات داخليا، وتشغيل الموقع بأمان.',
        },
        {
            title: 'السرية',
            body: 'تظهر معلومات الاستفسارات وطلبات الدراسات للمستخدمين الإداريين المخولين داخل لوحة الإدارة الآمنة فقط. لا تظهر الملاحظات الداخلية في الصفحات العامة.',
        },
        {
            title: 'الأمان والاحتفاظ',
            body: 'يستخدم التطبيق مصادقة جلسات Laravel وحماية CSRF وصلاحيات إدارية مبنية على الأدوار والتحقق من المدخلات والتعامل المنضبط مع الملفات. يتم الاحتفاظ بالسجلات حسب الحاجة للتواصل وتخطيط الخدمات والإدارة والمتطلبات التشغيلية أو القانونية.',
        },
        {
            title: 'التواصل',
            body: 'للاستفسار عن معلومات أرسلت عبر الموقع، استخدم صفحة التواصل وأضف سياقا كافيا يساعد الفريق على تحديد طلبك.',
        },
    ],
};

export default function Privacy() {
    const { locale } = usePage<SharedPageProps>().props;
    const currentLocale = locale.current;

    return (
        <>
            <SeoHead
                locale={currentLocale}
                title={{ en: 'Privacy Policy', ar: 'سياسة الخصوصية' }}
                description={{
                    en: 'Privacy Policy for the EliteData website and public inquiry and study-request forms.',
                    ar: 'سياسة الخصوصية الخاصة بموقع EliteData ونماذج الاستفسار وطلبات الدراسات العامة.',
                }}
            />
            <PageHero
                locale={currentLocale}
                direction={locale.direction}
                eyebrow={{ en: 'Legal', ar: 'الشروط القانونية' }}
                title={{ en: 'Privacy Policy', ar: 'سياسة الخصوصية' }}
                description={{
                    en: 'A plain-language summary of what the EliteData website may collect and how submitted information is used.',
                    ar: 'ملخص واضح للمعلومات التي قد يجمعها موقع EliteData وكيفية استخدام البيانات المرسلة.',
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
