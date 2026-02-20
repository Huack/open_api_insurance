import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { InsuranceStatus, InsuranceType } from '../types/insurance';
import type { InsuranceFilters } from '../types/insurance';

interface FilterSidebarProps {
    filters: InsuranceFilters;
    onFilterChange: (filters: Partial<InsuranceFilters>) => void;
    onReset: () => void;
}

export default function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
    const hasActiveFilters = filters.insuranceId || filters.ansCode || filters.status || filters.insuranceType;

    return (
        <aside className="w-full shrink-0 lg:w-72 animate-slide-in">
            <div className="glass rounded-2xl p-5 glow-blue">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-white/10">
                            <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
                        </div>
                        <span className="text-sm font-bold text-white">Filtros</span>
                        {hasActiveFilters && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
                                !
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-white/5 transition-all hover:bg-white/5 hover:text-white hover:ring-white/10 active:scale-95"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Limpar
                    </button>
                </div>

                <div className="space-y-5">
                    {/* ID do Convênio */}
                    <FilterInput
                        id="filter-id"
                        label="ID do Convênio"
                        placeholder="Ex: 10"
                        value={filters.insuranceId || ''}
                        onChange={(v) => onFilterChange({ insuranceId: v, page: 1 })}
                    />

                    {/* Código ANS */}
                    <FilterInput
                        id="filter-ans"
                        label="Código ANS"
                        placeholder="Ex: 312345"
                        value={filters.ansCode || ''}
                        onChange={(v) => onFilterChange({ ansCode: v, page: 1 })}
                    />

                    {/* Status */}
                    <FilterSelect
                        id="filter-status"
                        label="Status"
                        value={filters.status || ''}
                        onChange={(v) => onFilterChange({ status: v as InsuranceStatus | '', page: 1 })}
                        options={[
                            { value: '', label: 'Todos os status' },
                            { value: InsuranceStatus.ACTIVE, label: '● Ativo' },
                            { value: InsuranceStatus.INACTIVE, label: '○ Inativo' },
                        ]}
                    />

                    {/* Tipo */}
                    <FilterSelect
                        id="filter-type"
                        label="Tipo de Convênio"
                        value={filters.insuranceType || ''}
                        onChange={(v) => onFilterChange({ insuranceType: v as InsuranceType | '', page: 1 })}
                        options={[
                            { value: '', label: 'Todos os tipos' },
                            { value: InsuranceType.PRIVATE, label: 'Privado' },
                            { value: InsuranceType.SUS, label: 'SUS' },
                            { value: InsuranceType.SELF_PAYMENT, label: 'Particular' },
                            { value: InsuranceType.PUBLIC, label: 'Público' },
                            { value: InsuranceType.PRO_BONOPHILANTHROPIC, label: 'Filantrópico' },
                            { value: InsuranceType.SELFMANAGEMENT, label: 'Autogestão' },
                            { value: InsuranceType.HEALTH_INSURANCE, label: 'Seguro Saúde' },
                            { value: InsuranceType.MEDICARE, label: 'Medicare' },
                        ]}
                    />
                </div>

                {/* Footer info */}
                <div className="mt-6 rounded-xl bg-cyan-500/5 p-3 ring-1 ring-cyan-500/10">
                    <p className="text-[11px] leading-relaxed text-cyan-300/70">
                        <Filter className="mr-1 inline h-3 w-3" />
                        Filtros são aplicados automaticamente. Use "Limpar" para resetar todos.
                    </p>
                </div>
            </div>
        </aside>
    );
}

function FilterInput({
    id,
    label,
    placeholder,
    value,
    onChange,
}: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </label>
            <div className="group relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />
                <input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-slate-900/80 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500/70 outline-none transition-all focus:border-cyan-500/40 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-500/15 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                />
            </div>
        </div>
    );
}

function FilterSelect({
    id,
    label,
    value,
    onChange,
    options,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/8 bg-slate-900/80 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500/40 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-500/15 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
