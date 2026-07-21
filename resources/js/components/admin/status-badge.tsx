import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { humanizeStatus } from './admin-format';

const statusClasses: Record<string, string> = {
    new: 'border-[#22C7CF]/30 bg-[#E7F8FA] text-[#082D67]',
    in_progress: 'border-blue-200 bg-blue-50 text-blue-800',
    resolved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    spam: 'border-red-200 bg-red-50 text-red-800',
    reviewing: 'border-blue-200 bg-blue-50 text-blue-800',
    clarification_needed: 'border-amber-200 bg-amber-50 text-amber-800',
    proposal_sent: 'border-[#22C7CF]/30 bg-[#E7F8FA] text-[#082D67]',
    accepted: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    rejected: 'border-red-200 bg-red-50 text-red-800',
    closed: 'border-slate-200 bg-slate-100 text-slate-700',
};

export function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
    return (
        <Badge variant="outline" className={cn('font-bold', statusClasses[status] ?? statusClasses.new, className)}>
            {humanizeStatus(status)}
        </Badge>
    );
}
