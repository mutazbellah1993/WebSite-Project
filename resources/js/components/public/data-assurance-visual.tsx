import { Activity, CheckCircle2, Database, FileText, ShieldCheck } from 'lucide-react';
import type { LocaleCode } from '@/types';

const labels = {
    en: {
        title: 'Evidence workflow',
        intake: 'Data intake',
        quality: 'Quality checks',
        analysis: 'Analysis',
        reporting: 'Reporting',
        note: 'Structured research from collection to decision-ready outputs.',
    },
    ar: {
        title: 'سير عمل الأدلة',
        intake: 'استلام البيانات',
        quality: 'فحص الجودة',
        analysis: 'التحليل',
        reporting: 'التقارير',
        note: 'بحث منظم من جمع البيانات إلى مخرجات جاهزة لدعم القرار.',
    },
};

export function DataAssuranceVisual({ locale }: { locale: LocaleCode }) {
    const copy = labels[locale];
    const steps = [
        { label: copy.intake, Icon: Database },
        { label: copy.quality, Icon: ShieldCheck },
        { label: copy.analysis, Icon: Activity },
        { label: copy.reporting, Icon: FileText },
    ];

    return (
        <div className="w-full max-w-xl rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl shadow-[#061B3A]/40 backdrop-blur">
            <div className="rounded-md bg-white p-5 text-[#0F172A]">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-[#0AA6B5]">{copy.title}</p>
                        <p className="mt-1 text-sm font-normal text-[#475569]">{copy.note}</p>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#E7F8FA] text-[#0AA6B5]">
                        <CheckCircle2 className="size-6" aria-hidden="true" />
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {steps.map(({ label, Icon }) => (
                        <div key={label} className="rounded-md border border-[#D8E2EC] bg-[#F4F7FA] p-4">
                            <Icon className="mb-3 size-5 text-[#0AA6B5]" aria-hidden="true" />
                            <p className="text-sm font-bold text-[#0F172A]">{label}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-5 grid grid-cols-6 items-end gap-2 rounded-md bg-[#061B3A] p-4" aria-hidden="true">
                    {[38, 58, 44, 72, 62, 86].map((height, index) => (
                        <div
                            key={height + index}
                            className="rounded-t-sm bg-[#22C7CF]"
                            style={{ height: `${height}px` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
