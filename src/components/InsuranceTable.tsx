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

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('...');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, totalItems);

    return (
        <div className="lg:col-span-3 glass-effect rounded-2xl overflow-hidden flex flex-col min-h-[600px] animate-fade-in">
            {/* Table Header */}
            <div className="p-6 border-b border-[#1e293b] flex items-center justify-between bg-slate-800/20">
                <div className="flex items-center space-x-4">
                    <h2 className="font-bold text-white">Lista de Convênios</h2>
                    <span className="px-2 py-0.5 rounded-md bg-[#00d4ff]/20 text-[#00d4ff] text-[10px] font-bold tracking-widest">
                        PÁGINA {page}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/30">
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Convênio</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">CNPJ</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]">
                        {data.map((ins) => (
                            <tr
                                key={ins.insuranceId}
                                className="table-row-hover group cursor-pointer"
                                onClick={() => onSelect(ins)}
                            >
                                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                    #{ins.insuranceId}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white row-name transition-colors">
                                            {ins.commercialName || ins.insuranceDescription}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            {getInsuranceTypeLabel(ins.insuranceType)}
                                            {ins.corporateName && ` • ${ins.corporateName}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded">
                                        {formatCNPJ(ins.legalEntityCode || '') || '—'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={ins.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            className="p-2 text-slate-400 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-lg transition-all"
                                            onClick={(e) => { e.stopPropagation(); onSelect(ins); }}
                                        >
                                            <span className="material-symbols-rounded text-lg">visibility</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-[#1e293b] flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <p className="text-xs text-slate-500">
                    Mostrando <span className="font-bold text-white">{startItem} - {endItem}</span> de{' '}
                    <span className="font-bold text-white">{totalItems.toLocaleString('pt-BR')}</span> registros
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange(1)}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                    >
                        <span className="material-symbols-rounded">first_page</span>
                    </button>
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                    >
                        <span className="material-symbols-rounded">chevron_left</span>
                    </button>

                    <div className="flex space-x-1">
                        {getPageNumbers().map((p, i) =>
                            p === '...' ? (
                                <span key={`dots-${i}`} className="px-2 text-slate-500">...</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => onPageChange(p as number)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === page
                                            ? 'bg-[#00d4ff] text-slate-900'
                                            : 'hover:bg-slate-800 text-slate-300'
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                    >
                        <span className="material-symbols-rounded">chevron_right</span>
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(totalPages)}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                    >
                        <span className="material-symbols-rounded">last_page</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isActive = status === InsuranceStatus.ACTIVE;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${isActive
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                }`}
        >
            <span className={`w-1 h-1 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            {getStatusLabel(status)}
        </span>
    );
}