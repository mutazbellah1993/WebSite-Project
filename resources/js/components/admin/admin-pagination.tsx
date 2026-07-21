import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types';
import { cn } from '@/lib/utils';

function cleanLabel(label: string): string {
    return label.replace('&laquo;', 'Previous').replace('&raquo;', 'Next');
}

export function AdminPagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={cn(
                            'rounded-md border border-[#D8E2EC] px-3 py-2 text-sm font-semibold text-[#0F172A] transition hover:border-[#0AA6B5] hover:text-[#0AA6B5]',
                            link.active && 'border-[#0AA6B5] bg-[#E7F8FA] text-[#082D67]',
                        )}
                    >
                        {cleanLabel(link.label)}
                    </Link>
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="rounded-md border border-[#D8E2EC] px-3 py-2 text-sm font-semibold text-[#94A3B8]"
                    >
                        {cleanLabel(link.label)}
                    </span>
                ),
            )}
        </nav>
    );
}
