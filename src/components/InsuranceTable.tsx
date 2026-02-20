import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Insurance } from '../types/insurance';
import { InsuranceStatus } from '../types/insurance';
import { formatCNPJ } from '../utils/formatCNPJ';
import { getInsuranceTypeLabel, getStatusLabel } from '../utils/labels';

interface InsuranceTableProps {
    data: Insurance[];
    onSelect: (insurance: Insurance) => void;
    page: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function InsuranceTable({
    data,
    onSelect,
    page,
    totalItems,
    pageSize,
    onPageChange,
}: InsuranceTableProps) {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    return (
        <div className="flex-1 overflow-hidden rounded-2xl glass glow-cyan animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-800/40">
                            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
                                ID
                            </th>
                            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
                                Nome Comercial
                            </th>
                            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
                                CNPJ
                            </th>
                            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
                                Tipo
                            </th>
                            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
                                Status
                            </th>
                            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">

                            </th>
                        </tr>
                    </thead>
                    <tbody className="stagger-children">
                        {data.map((ins) => (
                            <tr
                                key={ins.insuranceId}
                                onClick={() => onSelect(ins)}
                                className="group cursor-pointer table-row-hover border-b border-white/5 last:border-b-0"
                            >
                                <td className="whitespace-nowrap px-5 py-4">
                                    <span className="inline-flex items-center rounded-lg bg-slate-800/80 px-2.5 py-1 font-mono text-xs font-bold text-cyan-300 ring-1 ring-cyan-500/20">
                                        #{ins.insuranceId}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                                        {ins.commercialName || ins.insuranceDescription}
                                    </div>
                                    {ins.corporateName && ins.corporateName !== ins.commercialName && (
                                        <div className="mt-0.5 text-[11px] text-slate-500 truncate max-w-[250px]">
                                            {ins.corporateName}
                                        </div>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-400">
                                    {formatCNPJ(ins.legalEntityCode || '')}
                                </td>
                                <td className="whitespace-nowrap px-5 py-4">
                                    <TypeBadge type={ins.insuranceType} />
                                </td>
                                <td className="whitespace-nowrap px-5 py-4">
                                    <StatusBadge status={ins.status} />
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <ExternalLink className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-cyan-400" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-white/8 bg-gradient-to-r from-slate-900/60 to-transparent px-5 py-3.5">
                <p className="text-xs text-slate-400">
                    <span className="font-bold text-white">{totalItems.toLocaleString('pt-BR')}</span> convênios
                </p>
                <div className="flex items-center gap-1.5">
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 ring-1 ring-white/5 transition-all hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-20"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1 px-2">
                        <span className="rounded-md bg-cyan-500/15 px-2.5 py-1 text-xs font-bold text-cyan-300">
                            {page}
                        </span>
                        <span className="text-xs text-slate-500">/</span>
                        <span className="text-xs font-medium text-slate-400">{totalPages}</span>
                    </div>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 ring-1 ring-white/5 transition-all hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-20"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function TypeBadge({ type }: { type: string }) {
    const colorMap: Record<string, string> = {
        PRIVATE: 'bg-violet-500/10 text-violet-300 ring-violet-500/20',
        SUS: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
        SELF_PAYMENT: 'bg-blue-500/10 text-blue-300 ring-blue-500/20',
        PUBLIC: 'bg-teal-500/10 text-teal-300 ring-teal-500/20',
        MEDICARE: 'bg-pink-500/10 text-pink-300 ring-pink-500/20',
        HEALTH_INSURANCE: 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/20',
    };

    const classes = colorMap[type] || 'bg-slate-500/10 text-slate-300 ring-slate-500/20';

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${classes}`}>
            {getInsuranceTypeLabel(type)}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isActive = status === InsuranceStatus.ACTIVE;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${isActive
                    ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-rose-400'
                    }`}
            />
            {getStatusLabel(status)}
        </span>
    );
}