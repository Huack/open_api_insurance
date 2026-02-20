import { InsuranceStatus, InsuranceType } from '../types/insurance';
import type { InsuranceFilters } from '../types/insurance';

interface FilterSidebarProps {
    filters: InsuranceFilters;
    onFilterChange: (filters: Partial<InsuranceFilters>) => void;
    onReset: () => void;
}

export default function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
    return (
        <aside className="lg:col-span-1 glass-effect rounded-2xl p-6 sidebar-gradient space-y-6 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span className="material-symbols-rounded text-[#00d4ff]">tune</span>
                    <h2 className="text-sm font-bold uppercase tracking-widest">Filtros</h2>
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
                {/* ID do Convênio */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        ID do Convênio
                    </label>
                    <div className="relative">
                        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Ex: 1010"
                            value={filters.insuranceId || ''}
                            onChange={(e) => onFilterChange({ insuranceId: e.target.value, page: 1 })}
                            className="w-full bg-slate-800/50 border border-[#1e293b] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Código ANS */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Código ANS
                    </label>
                    <div className="relative">
                        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                            tag
                        </span>
                        <input
                            type="text"
                            placeholder="Ex: 312345"
                            value={filters.ansCode || ''}
                            onChange={(e) => onFilterChange({ ansCode: e.target.value, page: 1 })}
                            className="w-full bg-slate-800/50 border border-[#1e293b] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Status
                    </label>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => onFilterChange({ status: e.target.value as InsuranceStatus | '', page: 1 })}
                        className="w-full bg-slate-800/50 border border-[#1e293b] rounded-xl py-2.5 px-4 text-sm text-white focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none appearance-none"
                    >
                        <option value="">Todos os status</option>
                        <option value={InsuranceStatus.ACTIVE}>Ativo</option>
                        <option value={InsuranceStatus.INACTIVE}>Inativo</option>
                    </select>
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tipo de Convênio
                    </label>
                    <select
                        value={filters.insuranceType || ''}
                        onChange={(e) => onFilterChange({ insuranceType: e.target.value as InsuranceType | '', page: 1 })}
                        className="w-full bg-slate-800/50 border border-[#1e293b] rounded-xl py-2.5 px-4 text-sm text-white focus:ring-2 focus:ring-[#00d4ff]/20 focus:border-[#00d4ff] transition-all outline-none appearance-none"
                    >
                        <option value="">Todos os tipos</option>
                        <option value={InsuranceType.PRIVATE}>Privado</option>
                        <option value={InsuranceType.SUS}>SUS</option>
                        <option value={InsuranceType.SELF_PAYMENT}>Particular</option>
                        <option value={InsuranceType.PUBLIC}>Público</option>
                        <option value={InsuranceType.PRO_BONOPHILANTHROPIC}>Filantrópico</option>
                        <option value={InsuranceType.SELFMANAGEMENT}>Autogestão</option>
                        <option value={InsuranceType.HEALTH_INSURANCE}>Seguro Saúde</option>
                        <option value={InsuranceType.MEDICARE}>Medicare</option>
                        <option value={InsuranceType.OWN}>Próprio</option>
                        <option value={InsuranceType.OPERATING_COST}>Custo Operacional</option>
                    </select>
                </div>
            </div>

            {/* Info box */}
            <div className="pt-4 border-t border-[#1e293b]">
                <div className="p-3 bg-[#00d4ff]/5 rounded-xl border border-[#00d4ff]/20">
                    <div className="flex items-start space-x-2">
                        <span className="material-symbols-rounded text-[#00d4ff] text-lg">info</span>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                            Filtros são aplicados automaticamente. Use "Limpar" para resetar todos os parâmetros de busca.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
