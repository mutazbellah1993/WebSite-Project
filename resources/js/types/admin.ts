export type AdminAssignee = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

export type InquiryStatus = 'new' | 'in_progress' | 'resolved' | 'spam';

export type StudyRequestStatus =
    | 'new'
    | 'reviewing'
    | 'clarification_needed'
    | 'proposal_sent'
    | 'accepted'
    | 'rejected'
    | 'closed';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type InsightType = 'article' | 'report' | 'insight' | 'news';

export type ContentCategoryOption = {
    id: number;
    slug: string;
    name_en: string;
    name_ar: string;
};

export type ContentCategoryListItem = ContentCategoryOption & {
    description_en: string | null;
    description_ar: string | null;
    insights_count: number;
    created_at: string | null;
    updated_at: string | null;
};

export type InsightCategorySummary = ContentCategoryOption;

export type InsightListItem = {
    id: number;
    type: InsightType;
    title_en: string;
    title_ar: string;
    slug: string;
    status: ContentStatus;
    is_featured: boolean;
    published_at: string | null;
    cover_image_url: string | null;
    has_report_attachment: boolean;
    categories: InsightCategorySummary[];
    author: {
        id: number;
        name: string;
    } | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
};

export type InsightDetail = InsightListItem & {
    excerpt_en: string | null;
    excerpt_ar: string | null;
    body_en: string | null;
    body_ar: string | null;
    category_ids: number[];
    seo_title_en: string | null;
    seo_title_ar: string | null;
    seo_description_en: string | null;
    seo_description_ar: string | null;
};

export type InquiryListItem = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    organization: string | null;
    subject: string | null;
    status: InquiryStatus;
    assigned_to: number | null;
    assignee: AdminAssignee | null;
    created_at: string | null;
    deleted_at: string | null;
};

export type ServiceListItem = {
    id: number;
    title_en: string;
    title_ar: string;
    slug: string;
    short_description_en: string | null;
    short_description_ar: string | null;
    icon: string | null;
    image_path: string | null;
    status: ContentStatus;
    is_featured: boolean;
    sort_order: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
};

export type ServiceDetail = ServiceListItem & {
    description_en: string | null;
    description_ar: string | null;
    seo_title_en: string | null;
    seo_title_ar: string | null;
    seo_description_en: string | null;
    seo_description_ar: string | null;
};

export type IndustryListItem = {
    id: number;
    title_en: string;
    title_ar: string;
    slug: string;
    icon: string | null;
    image_path: string | null;
    status: ContentStatus;
    sort_order: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
};

export type IndustryDetail = IndustryListItem & {
    description_en: string | null;
    description_ar: string | null;
};

export type InquiryDetail = InquiryListItem & {
    message: string;
    preferred_language: 'en' | 'ar';
    internal_notes: string | null;
    source: string | null;
    ip_address: string | null;
    user_agent: string | null;
    responded_at: string | null;
    updated_at: string | null;
};

export type StudyRequestListItem = {
    id: number;
    request_number: string;
    full_name: string;
    email: string;
    phone: string | null;
    organization: string | null;
    client_type: string | null;
    service_type: string | null;
    study_title: string | null;
    status: StudyRequestStatus;
    assigned_to: number | null;
    assignee: AdminAssignee | null;
    proposal_sent_at: string | null;
    closed_at: string | null;
    created_at: string | null;
    deleted_at: string | null;
};

export type StudyRequestDetail = StudyRequestListItem & {
    job_title: string | null;
    project_description: string;
    objectives: string | null;
    target_population: string | null;
    geographic_scope: string | null;
    estimated_sample_size: number | null;
    desired_start_date: string | null;
    desired_end_date: string | null;
    estimated_budget: string | null;
    budget_currency: string | null;
    attachment_path: string | null;
    preferred_language: 'en' | 'ar';
    internal_notes: string | null;
    updated_at: string | null;
};
