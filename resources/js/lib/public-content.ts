import type { LocaleCode } from '@/types';

export type LocalizedText = Record<LocaleCode, string>;

export type NavigationItem = {
    href: string;
    label: LocalizedText;
};

export type ServiceItem = {
    key: string;
    title: LocalizedText;
    description: LocalizedText;
};

export type IndustryItem = {
    title: LocalizedText;
    description: LocalizedText;
};

export type InsightItem = {
    title: LocalizedText;
    description: LocalizedText;
};

export const homePath = '/';

export const navItems: NavigationItem[] = [
    { href: '/', label: { en: 'Home', ar: 'الرئيسية' } },
    { href: '/about-us', label: { en: 'About Us', ar: 'من نحن' } },
    { href: '/services', label: { en: 'Services', ar: 'الخدمات' } },
    { href: '/industries', label: { en: 'Industries', ar: 'القطاعات' } },
    { href: '/research-and-insights', label: { en: 'Research & Insights', ar: 'الأبحاث والرؤى' } },
    { href: '/request-a-study', label: { en: 'Request a Study', ar: 'طلب دراسة' } },
    { href: '/contact-us', label: { en: 'Contact Us', ar: 'اتصل بنا' } },
];

export const services: ServiceItem[] = [
    {
        key: 'statistical-consulting',
        title: { en: 'Statistical studies and consulting', ar: 'الدراسات والاستشارات الإحصائية' },
        description: {
            en: 'Study design, sampling guidance, statistical planning, and interpretation support for institutional decisions.',
            ar: 'تصميم الدراسات، وتوجيه العينات، والتخطيط الإحصائي، ودعم تفسير النتائج للقرارات المؤسسية.',
        },
    },
    {
        key: 'survey-fieldwork',
        title: { en: 'Survey design and field data collection', ar: 'تصميم الاستبيانات وجمع البيانات الميدانية' },
        description: {
            en: 'Questionnaire structure, field protocols, enumerator guidance, and quality checks for reliable primary data.',
            ar: 'بناء الاستبيانات، وبروتوكولات العمل الميداني، وتوجيه الباحثين، وضوابط الجودة لبيانات أولية موثوقة.',
        },
    },
    {
        key: 'data-analysis',
        title: { en: 'Data cleaning and statistical analysis', ar: 'تنظيف البيانات والتحليل الإحصائي' },
        description: {
            en: 'Data validation, coding, transformation, descriptive analysis, modeling, and clear analytical reporting.',
            ar: 'التحقق من البيانات، والترميز، والتحويل، والتحليل الوصفي، والنمذجة، وإعداد تقارير تحليلية واضحة.',
        },
    },
    {
        key: 'market-research',
        title: { en: 'Market research', ar: 'أبحاث السوق' },
        description: {
            en: 'Customer, competitor, demand, and pricing research for organizations planning products, programs, or expansion.',
            ar: 'أبحاث العملاء والمنافسين والطلب والتسعير للجهات التي تخطط لمنتجات أو برامج أو توسع.',
        },
    },
    {
        key: 'feasibility',
        title: { en: 'Feasibility studies', ar: 'دراسات الجدوى' },
        description: {
            en: 'Evidence-led feasibility analysis covering market, operational, financial, and implementation considerations.',
            ar: 'تحليل جدوى قائم على الأدلة يغطي السوق والتشغيل والجوانب المالية ومتطلبات التنفيذ.',
        },
    },
    {
        key: 'monitoring-evaluation',
        title: { en: 'Monitoring and evaluation', ar: 'المتابعة والتقييم' },
        description: {
            en: 'Results frameworks, indicators, data collection plans, evaluation tools, and practical learning loops.',
            ar: 'أطر النتائج، والمؤشرات، وخطط جمع البيانات، وأدوات التقييم، وحلقات تعلم عملية.',
        },
    },
    {
        key: 'impact',
        title: { en: 'Impact assessment', ar: 'تقييم الأثر' },
        description: {
            en: 'Outcome measurement, attribution-aware analysis, beneficiary feedback, and lessons for future programming.',
            ar: 'قياس النتائج، وتحليل يراعي الإسناد، وتغذية راجعة من المستفيدين، ودروس للبرامج المستقبلية.',
        },
    },
    {
        key: 'power-bi',
        title: { en: 'Power BI dashboards and reporting', ar: 'لوحات Power BI والتقارير' },
        description: {
            en: 'Interactive dashboards, metric definitions, reporting workflows, and executive-ready data views.',
            ar: 'لوحات تفاعلية، وتعريفات للمؤشرات، وسير عمل للتقارير، وعروض بيانات جاهزة للإدارة.',
        },
    },
    {
        key: 'research-support',
        title: { en: 'Scientific research support', ar: 'دعم البحث العلمي' },
        description: {
            en: 'Methodology review, instrument design, analysis plans, statistical testing, and publication-oriented outputs.',
            ar: 'مراجعة المنهجية، وتصميم الأدوات، وخطط التحليل، والاختبارات الإحصائية، ومخرجات موجهة للنشر.',
        },
    },
];

export const industries: IndustryItem[] = [
    {
        title: { en: 'NGOs and development programs', ar: 'المنظمات والبرامج التنموية' },
        description: {
            en: 'Monitoring, evaluation, needs assessment, beneficiary studies, and impact-focused research.',
            ar: 'المتابعة والتقييم، وتقييم الاحتياجات، ودراسات المستفيدين، والأبحاث الموجهة للأثر.',
        },
    },
    {
        title: { en: 'Businesses and private organizations', ar: 'الشركات والمؤسسات الخاصة' },
        description: {
            en: 'Market research, customer analysis, feasibility studies, and decision dashboards.',
            ar: 'أبحاث السوق، وتحليل العملاء، ودراسات الجدوى، ولوحات دعم القرار.',
        },
    },
    {
        title: { en: 'Universities and researchers', ar: 'الجامعات والباحثون' },
        description: {
            en: 'Research design, statistical analysis, data cleaning, and academic reporting support.',
            ar: 'تصميم البحث، والتحليل الإحصائي، وتنظيف البيانات، ودعم التقارير الأكاديمية.',
        },
    },
    {
        title: { en: 'Public and institutional programs', ar: 'البرامج العامة والمؤسسية' },
        description: {
            en: 'Evidence systems, indicator frameworks, survey operations, and implementation learning.',
            ar: 'أنظمة الأدلة، وأطر المؤشرات، وعمليات المسح، والتعلم من التنفيذ.',
        },
    },
    {
        title: { en: 'Education and training initiatives', ar: 'مبادرات التعليم والتدريب' },
        description: {
            en: 'Learning outcomes, participant feedback, program quality, and evaluation tools.',
            ar: 'مخرجات التعلم، وآراء المشاركين، وجودة البرامج، وأدوات التقييم.',
        },
    },
    {
        title: { en: 'Health and social research', ar: 'الأبحاث الصحية والاجتماعية' },
        description: {
            en: 'Structured studies, ethical data practices, field instruments, and careful analysis of sensitive topics.',
            ar: 'دراسات منظمة، وممارسات بيانات أخلاقية، وأدوات ميدانية، وتحليل دقيق للموضوعات الحساسة.',
        },
    },
];

export const methodology = [
    {
        title: { en: 'Scoping and research design', ar: 'تحديد النطاق وتصميم البحث' },
        description: {
            en: 'Clarify the decision, define research questions, choose methods, and align the work plan with the intended use.',
            ar: 'توضيح القرار، وتعريف أسئلة البحث، واختيار المنهجيات، ومواءمة خطة العمل مع الاستخدام المقصود.',
        },
    },
    {
        title: { en: 'Instrument and data planning', ar: 'تخطيط الأدوات والبيانات' },
        description: {
            en: 'Prepare survey tools, sampling logic, field procedures, data dictionaries, and quality controls before collection.',
            ar: 'إعداد أدوات المسح، ومنطق العينة، وإجراءات الميدان، وقواميس البيانات، وضوابط الجودة قبل الجمع.',
        },
    },
    {
        title: { en: 'Collection, cleaning, and analysis', ar: 'الجمع والتنظيف والتحليل' },
        description: {
            en: 'Run fieldwork or data intake, validate records, prepare datasets, and apply the appropriate statistical techniques.',
            ar: 'تنفيذ العمل الميداني أو استلام البيانات، والتحقق من السجلات، وتجهيز مجموعات البيانات، وتطبيق الأساليب الإحصائية المناسبة.',
        },
    },
    {
        title: { en: 'Reporting and decision support', ar: 'التقارير ودعم القرار' },
        description: {
            en: 'Deliver clear findings, technical notes, dashboards, and practical recommendations for action.',
            ar: 'تقديم نتائج واضحة، وملاحظات فنية، ولوحات متابعة، وتوصيات عملية قابلة للتنفيذ.',
        },
    },
];

export const insights: InsightItem[] = [
    {
        title: { en: 'Methodology notes', ar: 'ملاحظات منهجية' },
        description: {
            en: 'Practical explanations of sampling, questionnaire design, data quality, and analysis choices.',
            ar: 'شروحات عملية حول العينات، وتصميم الاستبيانات، وجودة البيانات، وخيارات التحليل.',
        },
    },
    {
        title: { en: 'Market and sector briefs', ar: 'موجزات السوق والقطاعات' },
        description: {
            en: 'Research summaries for organizations that need structured market or sector understanding.',
            ar: 'ملخصات بحثية للجهات التي تحتاج إلى فهم منظم للسوق أو القطاعات.',
        },
    },
    {
        title: { en: 'Monitoring and evaluation guidance', ar: 'إرشادات المتابعة والتقييم' },
        description: {
            en: 'Guidance on indicators, evaluation questions, data collection tools, and learning systems.',
            ar: 'إرشادات حول المؤشرات، وأسئلة التقييم، وأدوات جمع البيانات، وأنظمة التعلم.',
        },
    },
];

export const contactSubjects = [
    { value: 'general-inquiry', label: { en: 'General inquiry', ar: 'استفسار عام' } },
    { value: 'partnership', label: { en: 'Partnership or collaboration', ar: 'شراكة أو تعاون' } },
    { value: 'research-support', label: { en: 'Research support', ar: 'دعم بحثي' } },
    { value: 'dashboard-reporting', label: { en: 'Dashboard or reporting request', ar: 'طلب لوحة بيانات أو تقارير' } },
];

export const sectorOptions = industries.map((industry) => ({
    value: industry.title.en.toLowerCase().replaceAll(' ', '-'),
    label: industry.title,
}));

export const serviceOptions = services.map((service) => ({
    value: service.key,
    label: service.title,
}));

export function text(value: LocalizedText, locale: LocaleCode): string {
    return value[locale] ?? value.en;
}
