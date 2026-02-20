import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Insurance } from '../types/insurance';
import { InsuranceStatus } from '../types/insurance';
import { formatCNPJ } from '../utils/formatCNPJ';
import { getInsuranceTypeLabel, getStatusLabel } from '../utils/labels';

interface InsuranceTableProps {
    data: Insurance[];
    onSelect: (insurance: Insurance) => void;
    page: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
}

export default function InsuranceTable({
    data,
    onSelect,
    page,
    totalPages,
    totalElements,
    onPageChange,
}: InsuranceTableProps) {
    return (
        <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm">
            {/* Table wrapper with horizontal scroll for mobile */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-slate-900/50">
                            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                ID
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Nome Comercial
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                CNPJ
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Tipo
                            </th>
                            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((insurance) => (
                            <tr
                                key={insurance.id}
                                onClick={() => onSelect(insurance)}
                                className="cursor-pointer transition-colors hover:bg-white/5"
                            >
                                <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-300">
                                    #{insurance.id}
                                </td>
                                <td className="px-5 py-4 font-medium text-white">
                                    {insurance.legalEntity?.commercialName || insurance.description}
                                </td>
                                <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-slate-300">
                                    {formatCNPJ(insurance.legalEntity?.legalEntityId || '')}
                                </td>
                                <td className="whitespace-nowrap px-5 py-4">
                                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
                                        {getInsuranceTypeLabel(insurance.insuranceType)}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${insurance.status === InsuranceStatus.ACTIVE
                                                ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${insurance.status === InsuranceStatus.ACTIVE
                                                    ? 'bg-emerald-400'
                                                    : 'bg-rose-400'
                                                }`}
                                        />
                                        {getStatusLabel(insurance.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
                <p className="text-xs text-slate-400">
                    <span className="font-semibold text-white">{totalElements}</span> convênios encontrados
                </p>
                <div className="flex items-center gap-1">
                    <button
                        disabled={page === 0}
                        onClick={() => onPageChange(page - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-3 text-xs font-medium text-slate-300">
                        {page + 1} / {totalPages || 1}
                    </span>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => onPageChange(page + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}