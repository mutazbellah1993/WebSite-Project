import {
    BarChart3,
    ClipboardList,
    DatabaseZap,
    FileChartColumn,
    Gauge,
    LineChart,
    Microscope,
    PieChart,
    SearchCheck,
    type LucideIcon,
} from 'lucide-react';
import type { ServiceItem } from '@/lib/public-content';
import { text } from '@/lib/public-content';
import type { LocaleCode } from '@/types';

const iconMap: Record<string, LucideIcon> = {
    'statistical-consulting': BarChart3,
    'survey-fieldwork': ClipboardList,
    'data-analysis': DatabaseZap,
    'market-research': SearchCheck,
    feasibility: FileChartColumn,
    'monitoring-evaluation': Gauge,
    impact: PieChart,
    'power-bi': LineChart,
    'research-support': Microscope,
};

export function ServiceCard({ service, locale }: { service: ServiceItem; locale: LocaleCode }) {
    const Icon = iconMap[service.key] ?? BarChart3;

    return (
        <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/70">
            <div className="mb-5 flex size-12 items-center justify-center rounded-md bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <Icon className="size-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950">{text(service.title, locale)}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text(service.description, locale)}</p>
        </article>
    );
}
