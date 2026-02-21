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

export default function InsuranceTable({ data, onSelect, page, totalItems, pageSize, onPageChange }: InsuranceTableProps) {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Toolbar Header */}
            <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center space-x-4">
                    <h2 className="font-bold text-slate-900 dark:text-white">Lista de Convênios</h2>
                    <span className="px-2 py-0.5 rounded-md bg-[#00d4ff]/20 text-[#00d4ff] text-[10px] font-bold tracking-widest">ANALYSIS MODE</span>
                    <span className="text-xs text-slate-500 font-medium">8 colunas visíveis</span>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                        <span className="material-symbols-rounded text-lg">download</span>
                        <span>EXPORTAR CSV</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold transition-all glow-accent">
                        <span className="material-symbols-rounded text-lg">add</span>
                        <span>NOVO CONVÊNIO</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Table Area */}
            <div className="overflow-x-auto flex-grow bg-slate-50/50 dark:bg-[#0f172a]/30">
                <table className="w-full text-left border-collapse table-fixed lg:table-auto">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#0f172a]/60">
                            <th className="px-6 py-4 w-20 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">ID</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Convênio</th>
                            <th className="px-6 py-4 w-32 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Código ANS</th>
                            <th className="px-6 py-4 w-40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Doc. Fiscal</th>
                            <th className="px-6 py-4 w-32 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 w-24 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1e293b]">
                        {data.map((ins) => (
                            <tr
                                key={ins.insuranceId}
                                className="hover:bg-slate-50/50 dark:hover:bg-[#00d4ff]/5 transition-colors group cursor-pointer"
                                onClick={() => onSelect(ins)}
                            >
                                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                    #{ins.insuranceId}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#00d4ff] transition-colors">{ins.commercialName || ins.insuranceDescription}</span>
                                        <span className="text-[10px] text-slate-500">{getInsuranceTypeLabel(ins.insuranceType)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">{ins.ansCode || '---'}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-mono text-slate-400">{formatCNPJ(ins.legalEntityCode || '') || 'Não Informado'}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={ins.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-1">
                                        <button className="p-1.5 text-slate-400 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-lg transition-all" aria-label="Visualizar">
                                            <span className="material-symbols-rounded text-lg">visibility</span>
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-lg transition-all" aria-label="Editar">
                                            <span className="material-symbols-rounded text-lg">edit</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Enterprise Pagination Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-[#1e293b] flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="flex items-center space-x-4">
                    <p className="text-xs text-slate-500">
                        Mostrando <span className="font-bold text-slate-900 dark:text-white">{Math.min((page - 1) * pageSize + 1, totalItems)} - {Math.min(page * pageSize, totalItems)}</span> de <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> registros
                    </p>
                    <div className="h-4 w-[1px] bg-slate-700"></div>
                    <select className="bg-transparent border-none text-xs font-bold text-[#00d4ff] focus:ring-0 cursor-pointer outline-none appearance-none">
                        <option value="50">50 por página</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={page === 1}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <span className="material-symbols-rounded">first_page</span>
                    </button>
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <span className="material-symbols-rounded">chevron_left</span>
                    </button>

                    <div className="flex space-x-1">
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            let p = i + 1;
                            if (totalPages > 5 && page > 3) {
                                p = page - 2 + i;
                                if (p > totalPages) p = totalPages - (4 - i);
                            }

                            const isActive = p === page;

                            return (
                                <button
                                    key={p}
                                    onClick={() => onPageChange(p)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${isActive
                                        ? 'bg-[#00d4ff] text-slate-900 shadow-lg shadow-[#00d4ff]/20'
                                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        {totalPages > 5 && page < totalPages - 2 && (
                            <span className="px-2 text-slate-500 flex items-end">...</span>
                        )}
                    </div>

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <span className="material-symbols-rounded">chevron_right</span>
                    </button>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={page === totalPages}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
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
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
            <span className={`w-1 h-1 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {getStatusLabel(status)}
        </span>
    );
}