import type { ReactNode } from 'react';

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
    return (
        <div className="rounded-lg border border-dashed border-[#D8E2EC] bg-white px-6 py-10 text-center">
            <h2 className="text-base font-bold text-[#0F172A]">{title}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#475569]">{description}</p>
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    );
}
