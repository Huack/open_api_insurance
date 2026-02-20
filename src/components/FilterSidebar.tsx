import { Search, Filter, RotateCcw } from 'lucide-react';
import { InsuranceStatus, InsuranceType } from '../types/insurance';
import type { InsuranceFilters } from '../types/insurance';

interface FilterSidebarProps {
    filters: InsuranceFilters;
    onFilterChange: (filters: Partial<InsuranceFilters>) => void;
    onReset: () => void;
}

export default function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
    return (
        <aside className="w-full shrink-0 lg:w-72">
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-5 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Filter className="h-4 w-4 text-cyan-400" />
                        Filtros
                    </div>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Limpar
                    </button>
                </div>

                <div className="space-y-4">
                    {/* ID do Convênio */}
                    <div>
                        <label htmlFor="filter-id" className="mb-1.5 block text-xs font-medium text-slate-400">
                            ID do Convênio
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                            <input
                                id="filter-id"
                                type="text"
                                placeholder="Ex: 10"
                                value={filters.insuranceId || ''}
                                onChange={(e) => onFilterChange({ insuranceId: e.target.value, page: 1 })}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                            />
                        </div>
                    </div>

                    {/* Código ANS */}
                    <div>
                        <label htmlFor="filter-ans" className="mb-1.5 block text-xs font-medium text-slate-400">
                            Código ANS
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                            <input
                                id="filter-ans"
                                type="text"
                                placeholder="Ex: 312345"
                                value={filters.ansCode || ''}
                                onChange={(e) => onFilterChange({ ansCode: e.target.value, page: 1 })}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="filter-status" className="mb-1.5 block text-xs font-medium text-slate-400">
                            Status
                        </label>
                        <select
                            id="filter-status"
                            value={filters.status || ''}
                            onChange={(e) => onFilterChange({ status: e.target.value as InsuranceStatus | '', page: 1 })}
                            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        >
                            <option value="">Todos</option>
                            <option value={InsuranceStatus.ACTIVE}>Ativo</option>
                            <option value={InsuranceStatus.INACTIVE}>Inativo</option>
                        </select>
                    </div>

                    {/* Tipo */}
                    <div>
                        <label htmlFor="filter-type" className="mb-1.5 block text-xs font-medium text-slate-400">
                            Tipo de Convênio
                        </label>
                        <select
                            id="filter-type"
                            value={filters.insuranceType || ''}
                            onChange={(e) => onFilterChange({ insuranceType: e.target.value as InsuranceType | '', page: 1 })}
                            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                        >
                            <option value="">Todos</option>
                            <option value={InsuranceType.PRIVATE}>Privado</option>
                            <option value={InsuranceType.SUS}>SUS</option>
                            <option value={InsuranceType.SELF_PAYMENT}>Particular</option>
                            <option value={InsuranceType.PUBLIC}>Público</option>
                            <option value={InsuranceType.PRO_BONOPHILANTHROPIC}>Filantrópico</option>
                            <option value={InsuranceType.SELFMANAGEMENT}>Autogestão</option>
                            <option value={InsuranceType.HEALTH_INSURANCE}>Seguro Saúde</option>
                            <option value={InsuranceType.MEDICARE}>Medicare</option>
                        </select>
                    </div>
                </div>
            </div>
        </aside>
    );
}
