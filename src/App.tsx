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
        <div className="bg-[#f8fafc] dark:bg-[#070b14] text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen font-sans">
            <Header />

            <main className="max-w-4k mx-auto p-6 space-y-6">

                {/* Enterprise KPI Dashboard */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Total de Convênios" value={total.toLocaleString()} subtitle="+12.4% ESTE MÊS" icon="database" accent="primary" iconIcon="trending_up" />
                    <KpiCard title="Página Atual" value={`${filters.page}/${totalPages}`} subtitle={`VISUALIZANDO ${filters.size} POR PÁGINA`} icon="analytics" accent="accent-purple" />
                    <KpiCard title="Por Página" value={filters.size.toString()} subtitle="LIMITE CONFIGURADO" icon="list" accent="accent-teal" />
                    <KpiCard title="Exibindo" value={results.length.toString()} subtitle="RESULTADOS FILTRADOS" icon="check_circle" accent="emerald-500" />
                </section>

                {/* Middle Metrics Row */}
                <MiddleMetrics />

                {/* Core Layout Grid: Sidebar + Data Area */}
                <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 items-start">

                    <aside className="xl:col-span-1 glass-effect rounded-2xl p-6 sidebar-gradient space-y-6">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={handleReset}
                        />
                    </aside>

                    <section className="xl:col-span-5 glass-effect rounded-2xl overflow-hidden flex flex-col min-h-[700px] table-container">
                        {isLoading ? (
                            <LoadingState />
                        ) : isError ? (
                            <ErrorState message={(error as Error)?.message} onRetry={refetch} />
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
                    </section>

                </div>
            </main>

            {/* Corporate Footer */}
            <footer className="max-w-4k mx-auto p-6 flex items-center justify-between border-t border-slate-200 dark:border-[#1e293b] mt-12 mb-6">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">© {new Date().getFullYear()} Gestão de Convênios. Optimized for 4K Performance.</p>
                <div className="flex space-x-6">
                    <a href="#" className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Suporte</a>
                    <a href="#" className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Termos</a>
                    <a href="#" className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Privacidade</a>
                </div>
            </footer>

            {selected && <DetailModal insurance={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

function KpiCard({ title, value, subtitle, icon, accent, iconIcon }: { title: string; value: string; subtitle: string; icon: string; accent: string; iconIcon?: string; }) {
    // Map accents to exact hex/tailwind classes since dynamic template literals can be tricky in Tailwind
    const bgClass = accent === 'primary' ? 'bg-[#00d4ff]/10' : accent === 'accent-purple' ? 'bg-[#a855f7]/10' : accent === 'accent-teal' ? 'bg-[#14b8a6]/10' : 'bg-emerald-500/10';
    const textClass = accent === 'primary' ? 'text-[#00d4ff]' : accent === 'accent-purple' ? 'text-[#a855f7]' : accent === 'accent-teal' ? 'text-[#14b8a6]' : 'text-emerald-500';
    const fromClass = accent === 'primary' ? 'from-[#00d4ff]' : accent === 'accent-purple' ? 'from-[#a855f7]' : accent === 'accent-teal' ? 'from-[#14b8a6]' : 'from-emerald-500';
    const subtitleColorClass = accent === 'primary' ? 'text-emerald-500' : 'text-slate-500';

    return (
        <div className="glass-effect p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter">{value}</h3>
                </div>
                <div className={`p-3 ${bgClass} rounded-xl`}>
                    <span className={`material-symbols-rounded ${textClass}`}>{icon}</span>
                </div>
            </div>
            <div className={`mt-4 flex items-center text-[10px] ${subtitleColorClass} font-bold`}>
                {iconIcon && <span className="material-symbols-rounded text-sm mr-1">{iconIcon}</span>}
                <span>{subtitle}</span>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${fromClass} to-transparent opacity-20`} />
        </div>
    );
}

function MiddleMetrics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-effect p-4 rounded-xl flex items-center space-x-4 border-l-4 border-l-[#00d4ff]">
                <div className="p-2 bg-slate-800 rounded-lg">
                    <span className="material-symbols-rounded text-[#00d4ff] text-xl">pie_chart</span>
                </div>
                <div className="flex-grow">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Convênios por Tipo</p>
                    <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs font-semibold"><span className="text-[#00d4ff]">642</span> Emp.</span>
                        <span className="text-xs font-semibold"><span className="text-[#14b8a6]">412</span> Ind.</span>
                        <span className="text-xs font-semibold"><span className="text-[#a855f7]">194</span> Col.</span>
                    </div>
                </div>
            </div>
            <div className="glass-effect p-4 rounded-xl flex items-center space-x-4 border-l-4 border-l-[#a855f7]">
                <div className="p-2 bg-slate-800 rounded-lg">
                    <span className="material-symbols-rounded text-[#a855f7] text-xl">pending_actions</span>
                </div>
                <div className="flex-grow">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Convênios Pendentes</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-bold">34</span>
                        <div className="flex space-x-1 h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-[#a855f7] w-1/3"></div>
                        </div>
                        <span className="text-[10px] text-slate-500">2.7% do total</span>
                    </div>
                </div>
            </div>
            <div className="glass-effect p-4 rounded-xl flex items-center space-x-4 border-l-4 border-l-emerald-500">
                <div className="p-2 bg-slate-800 rounded-lg">
                    <span className="material-symbols-rounded text-emerald-500 text-xl">verified</span>
                </div>
                <div className="flex-grow">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contratos Ativos</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-bold">1,189</span>
                        <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">95.2%</span>
                    </div>
                </div>
            </div>
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