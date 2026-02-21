import { InsuranceStatus, InsuranceType } from '../types/insurance';
import type { InsuranceFilters } from '../types/insurance';

interface FilterSidebarProps {
    filters: InsuranceFilters;
    onFilterChange: (filters: Partial<InsuranceFilters>) => void;
    onReset: () => void;
}

export default function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span className="material-symbols-rounded text-[#00d4ff]">tune</span>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Filtros</h2>
                </div>
                <button
                    onClick={onReset}
                    className="text-[10px] font-bold text-[#00d4ff] hover:text-white uppercase flex items-center space-x-1 transition-colors"
                >
                    <span className="material-symbols-rounded text-xs">restart_alt</span>
                    <span>Limpar</span>
                </button>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID do Convênio</label>
                    <div className="relative">
                        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">search</span>
                        <input
                            type="text"
                            value={filters.insuranceId || ''}
                            onChange={(e) => onFilterChange({ insuranceId: e.target.value, page: 1 })}
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-[#1e293b] rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none text-slate-800 dark:text-white placeholder-slate-400"
                            placeholder="Ex: 1010"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Código ANS</label>
                    <div className="relative">
                        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">tag</span>
                        <input
                            type="text"
                            value={filters.ansCode || ''}
                            onChange={(e) => onFilterChange({ ansCode: e.target.value, page: 1 })}
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-[#1e293b] rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none text-slate-800 dark:text-white placeholder-slate-400"
                            placeholder="Ex: 3123456"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Operacional</label>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => onFilterChange({ status: e.target.value as InsuranceStatus | '', page: 1 })}
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-[#1e293b] rounded-xl py-2 px-4 text-xs focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none appearance-none cursor-pointer text-slate-800 dark:text-white"
                    >
                        <option value="">Todos os status</option>
                        <option value={InsuranceStatus.ACTIVE}>Ativo</option>
                        <option value={InsuranceStatus.INACTIVE}>Inativo</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo de Convênio</label>
                    <select
                        value={filters.insuranceType || ''}
                        onChange={(e) => onFilterChange({ insuranceType: e.target.value as InsuranceType | '', page: 1 })}
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-[#1e293b] rounded-xl py-2 px-4 text-xs focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none appearance-none cursor-pointer text-slate-800 dark:text-white"
                    >
                        <option value="">Todos os tipos</option>
                        <option value={InsuranceType.PRIVATE}>Sistema Privado</option>
                        <option value={InsuranceType.SUS}>Sistema Único (SUS)</option>
                        <option value={InsuranceType.PUBLIC}>Sistema Público</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-[#1e293b]">
                <div className="p-3 bg-[#00d4ff]/5 rounded-xl border border-[#00d4ff]/20">
                    <div className="flex items-start space-x-2">
                        <span className="material-symbols-rounded text-[#00d4ff] text-lg">info</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Filtros aplicados em tempo real na base de dados 4K.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
