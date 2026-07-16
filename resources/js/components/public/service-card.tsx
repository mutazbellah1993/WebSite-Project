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
        <article className="group flex h-full flex-col rounded-lg border border-[#D8E2EC] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#22C7CF] hover:shadow-xl hover:shadow-[#082D67]/10">
            <div className="mb-5 flex size-12 items-center justify-center rounded-md bg-[#E7F8FA] text-[#0AA6B5] ring-1 ring-[#22C7CF]/25">
                <Icon className="size-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">{text(service.title, locale)}</h3>
            <p className="mt-3 text-sm font-normal leading-6 text-[#475569]">{text(service.description, locale)}</p>
        </article>
    );
}
