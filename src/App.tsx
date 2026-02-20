import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import InsuranceTable from './components/InsuranceTable';
import DetailModal from './components/DetailModal';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import { useInsurances } from './hooks/useInsurances';
import type { Insurance, InsuranceFilters } from './types/insurance';

const queryClient = new QueryClient();

const DEFAULT_FILTERS: InsuranceFilters = {
    page: 1,
    size: 50,
    status: '',
    insuranceType: '',
    insuranceId: '',
    ansCode: '',
};

function Dashboard() {
    const [filters, setFilters] = useState<InsuranceFilters>(DEFAULT_FILTERS);
    const [selected, setSelected] = useState<Insurance | null>(null);

    const { data, isLoading, isError, error, refetch } = useInsurances(filters);

    const handleFilterChange = useCallback((partial: Partial<InsuranceFilters>) => {
        setFilters((prev) => ({ ...prev, ...partial }));
    }, []);

    const handleReset = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    const results = data?.results || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / filters.size) || 1;

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-200">
            <Header />

            <main className="max-w-[1600px] mx-auto p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                    <StatCard
                        label="Total de Convênios"
                        value={total.toLocaleString('pt-BR')}
                        icon="database"
                        colorClass="text-[#00d4ff]"
                        bgClass="bg-[#00d4ff]/10"
                        accentClass="from-[#00d4ff]"
                        trend="+12.4% ESTE MÊS"
                    />
                    <StatCard
                        label="Página Atual"
                        value={`${filters.page}/${totalPages}`}
                        icon="analytics"
                        colorClass="text-[#a855f7]"
                        bgClass="bg-[#a855f7]/10"
                        accentClass="from-[#a855f7]"
                        footer="VISUALIZANDO 50 POR PÁGINA"
                    />
                    <StatCard
                        label="Por Página"
                        value={String(filters.size)}
                        icon="list"
                        colorClass="text-[#14b8a6]"
                        bgClass="bg-[#14b8a6]/10"
                        accentClass="from-[#14b8a6]"
                        footer="LIMITE CONFIGURADO"
                    />
                    <StatCard
                        label="Exibindo"
                        value={String(results.length)}
                        icon="check_circle"
                        colorClass="text-[#22c55e]"
                        bgClass="bg-[#22c55e]/10"
                        accentClass="from-[#22c55e]"
                        footer="RESULTADOS FILTRADOS"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                    />

                    {isLoading ? (
                        <LoadingState />
                    ) : isError ? (
                        <ErrorState
                            message={(error as Error)?.message}
                            onRetry={() => refetch()}
                        />
                    ) : results.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <InsuranceTable
                            data={results}
                            onSelect={setSelected}
                            page={filters.page}
                            totalItems={total}
                            pageSize={filters.size}
                            onPageChange={(p) => handleFilterChange({ page: p })}
                        />
                    )}
                </div>
            </main>

            <footer className="max-w-[1600px] mx-auto p-6 flex items-center justify-between border-t border-[#1e293b] mt-12 mb-6">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                    © {new Date().getFullYear()} Gestão de Convênios. Todos os direitos reservados.
                </p>
                <div className="flex space-x-6">
                    <a href="#" className="text-[10px] text-slate-500 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Suporte</a>
                    <a href="#" className="text-[10px] text-slate-500 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Termos</a>
                    <a href="#" className="text-[10px] text-slate-500 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Privacidade</a>
                </div>
            </footer>

            {selected && (
                <DetailModal
                    insurance={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string;
    icon: string;
    colorClass: string;
    bgClass: string;
    accentClass: string;
    trend?: string;
    footer?: string;
}

function StatCard({ label, value, icon, colorClass, bgClass, accentClass, trend, footer }: StatCardProps) {
    return (
        <div className="glass-effect p-5 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {label}
                    </p>
                    <h3 className="text-3xl font-bold text-white font-mono tracking-tighter">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 ${bgClass} rounded-xl`}>
                    <span className={`material-symbols-rounded ${colorClass}`}>{icon}</span>
                </div>
            </div>
            {(trend || footer) && (
                <div className="mt-4 flex items-center text-[10px] font-bold">
                    {trend ? (
                        <div className="flex items-center text-emerald-500">
                            <span className="material-symbols-rounded text-sm mr-1">trending_up</span>
                            <span>{trend}</span>
                        </div>
                    ) : (
                        <span className="text-slate-500">{footer}</span>
                    )}
                </div>
            )}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${accentClass} to-transparent opacity-20`} />
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>
    );
}