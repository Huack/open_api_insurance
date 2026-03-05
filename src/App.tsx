import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import InsuranceTable from './components/InsuranceTable';
import NaturalPersonTable from './components/NaturalPersonTable';
import DetailModal from './components/DetailModal';
import NaturalPersonDetailModal from './components/NaturalPersonDetailModal';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import { useInsurances } from './hooks/useInsurances';
import { useNaturalPersons } from './hooks/useNaturalPersons';
import { InsuranceStatus, InsuranceType, type Insurance, type InsuranceFilters } from './types/insurance';
import type { NaturalPersonFilters, NaturalPerson } from './types/naturalPerson';

const queryClient = new QueryClient();

const DEFAULT_FILTERS: InsuranceFilters = {
    page: 1,
    size: 50,
    status: '',
    insuranceType: '',
    insuranceId: '',
    ansCode: '',
};

const DEFAULT_NP_FILTERS: NaturalPersonFilters = {
    page: 1,
    size: 50,
};

function Dashboard() {
    const [view, setView] = useState<'insurances' | 'patients'>('insurances');

    const [filters, setFilters] = useState<InsuranceFilters>(DEFAULT_FILTERS);
    const [selected, setSelected] = useState<Insurance | null>(null);

    const [npFilters, setNpFilters] = useState<NaturalPersonFilters>(DEFAULT_NP_FILTERS);
    const [selectedNp, setSelectedNp] = useState<NaturalPerson | null>(null);

    const { data: insData, isLoading: insIsLoading, isError: insIsError, error: insError, refetch: insRefetch } = useInsurances(filters);

    // Always call the hook (React rules of hooks) - it caches anyway
    const { data: npData, isLoading: npIsLoading, isError: npIsError, error: npError, refetch: npRefetch } = useNaturalPersons(npFilters);

    const handleFilterChange = useCallback((partial: Partial<InsuranceFilters>) => {
        setFilters((prev) => ({ ...prev, ...partial }));
    }, []);

    const handleNpFilterChange = useCallback((partial: Partial<NaturalPersonFilters>) => {
        setNpFilters((prev) => ({ ...prev, ...partial }));
    }, []);

    const handleReset = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setNpFilters(DEFAULT_NP_FILTERS);
    }, []);

    const insResults = insData?.results || [];
    const insTotal = insData?.total || 0;
    const insTotalPages = Math.ceil(insTotal / filters.size) || 1;

    // Tasy APIs could return NaturalPersons as a direct array or wrapped in { results, total }
    const npResults: NaturalPerson[] = Array.isArray(npData) ? npData : ((npData as any)?.results || []);
    // If it's an array directly, we don't have total server count, just page size
    const npTotal = Array.isArray(npData) ? npResults.length : ((npData as any)?.total || 0);

    return (
        <div className="bg-[#f8fafc] dark:bg-[#070b14] text-slate-800 dark:text-slate-200 transition-colors duration-300 min-h-screen font-sans">
            <Header />

            <main className="max-w-4k mx-auto p-6 space-y-6">

                {/* Tabs for Navigation */}
                <div className="flex space-x-6 mb-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button
                        onClick={() => setView('insurances')}
                        className={`pb-2 text-sm font-bold uppercase tracking-wider transition-all ${view === 'insurances' ? 'text-[#00d4ff] border-b-2 border-[#00d4ff] scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Convênios
                    </button>
                    <button
                        onClick={() => setView('patients')}
                        className={`pb-2 text-sm font-bold uppercase tracking-wider transition-all ${view === 'patients' ? 'text-[#00d4ff] border-b-2 border-[#00d4ff] scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Pacientes (Master Data)
                    </button>
                </div>

                {/* Dynamic Content Based on View */}
                {view === 'insurances' ? (
                    <>
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <KpiCard title="Total de Convênios" value={insTotal.toLocaleString()} subtitle="+12.4% ESTE MÊS" icon="database" accent="primary" iconIcon="trending_up" />
                            <KpiCard title="Página Atual" value={`${filters.page}/${insTotalPages}`} subtitle={`VISUALIZANDO ${filters.size} POR PÁGINA`} icon="analytics" accent="accent-purple" />
                            <KpiCard title="Por Página" value={filters.size.toString()} subtitle="LIMITE CONFIGURADO" icon="list" accent="accent-teal" />
                            <KpiCard title="Exibindo" value={insResults.length.toString()} subtitle="RESULTADOS FILTRADOS" icon="check_circle" accent="emerald-500" />
                        </section>

                        <MiddleMetrics data={insResults} total={insTotal} />

                        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 items-start">
                            <aside className="xl:col-span-1 glass-effect rounded-2xl p-6 sidebar-gradient space-y-6">
                                <FilterSidebar
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onReset={handleReset}
                                />
                            </aside>

                            <section className="xl:col-span-5 glass-effect rounded-2xl overflow-hidden flex flex-col min-h-[700px] table-container">
                                {insIsLoading ? (
                                    <LoadingState />
                                ) : insIsError ? (
                                    <ErrorState message={(insError as Error)?.message} onRetry={insRefetch} />
                                ) : insResults.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    <InsuranceTable
                                        data={insResults}
                                        onSelect={setSelected}
                                        page={filters.page}
                                        totalItems={insTotal}
                                        pageSize={filters.size}
                                        onPageChange={(p) => handleFilterChange({ page: p })}
                                    />
                                )}
                            </section>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Pacientes View */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KpiCard title="Total Cadastrado na Nuvem" value="1.240.590" subtitle="PACIENTES ATIVOS" icon="group" accent="primary" iconIcon="cloud" />
                            <KpiCard title="Página Atual" value={npFilters.page?.toString() || '1'} subtitle={`VISUALIZANDO ${npFilters.size} POR PÁGINA`} icon="analytics" accent="accent-purple" />
                            <KpiCard title="Resultados da API" value={npResults.length.toString()} subtitle="CARREGADOS NESTA TELA" icon="download" accent="accent-teal" />
                        </section>

                        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 items-start">
                            {/* Reusing Filter Sidebar styling for a placeholder for Natural Persons Filters */}
                            <aside className="xl:col-span-1 glass-effect rounded-2xl p-6 sidebar-gradient space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Busca Avançada</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">CPF do Paciente</label>
                                            <input
                                                type="text"
                                                placeholder="000.000.000-00"
                                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#00d4ff] outline-none text-slate-900 dark:text-white"
                                                value={npFilters['taxpayer-id'] || ''}
                                                onChange={(e) => handleNpFilterChange({ 'taxpayer-id': e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nome Completo</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: João da Silva..."
                                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#00d4ff] outline-none text-slate-900 dark:text-white"
                                                value={npFilters.name || ''}
                                                onChange={(e) => handleNpFilterChange({ name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                                        <button
                                            onClick={() => handleReset()}
                                            className="w-full flex justify-center items-center space-x-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-600 dark:text-slate-400"
                                        >
                                            <span className="material-symbols-rounded text-sm">restart_alt</span>
                                            <span>LIMPAR FILTROS</span>
                                        </button>
                                    </div>
                                </div>
                            </aside>

                            <section className="xl:col-span-5 glass-effect rounded-2xl overflow-hidden flex flex-col min-h-[700px] table-container">
                                {npIsLoading ? (
                                    <LoadingState />
                                ) : npIsError ? (
                                    <ErrorState message={(npError as Error)?.message} onRetry={npRefetch} />
                                ) : npResults.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    <NaturalPersonTable
                                        data={npResults}
                                        onSelect={setSelectedNp}
                                        page={npFilters.page || 1}
                                        totalItems={npTotal}
                                        pageSize={npFilters.size || 50}
                                        onPageChange={(p) => handleNpFilterChange({ page: p })}
                                    />
                                )}
                            </section>
                        </div>
                    </>
                )}
            </main>

            <footer className="max-w-4k mx-auto p-6 flex items-center justify-between border-t border-slate-200 dark:border-[#1e293b] mt-12 mb-6">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">© {new Date().getFullYear()} Gestão de Saúde Tasy. Optimized for 4K Performance.</p>
                <div className="flex space-x-6">
                    <a href="#" className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Suporte</a>
                    <a href="#" className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Termos</a>
                    <a href="#" className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#00d4ff] uppercase tracking-widest font-bold transition-colors">Privacidade</a>
                </div>
            </footer>

            {selected && <DetailModal insurance={selected} onClose={() => setSelected(null)} />}
            {selectedNp && <NaturalPersonDetailModal person={selectedNp} onClose={() => setSelectedNp(null)} />}
        </div>
    );
}

function KpiCard({ title, value, subtitle, icon, accent, iconIcon }: { title: string; value: string; subtitle: string; icon: string; accent: string; iconIcon?: string; }) {
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

function MiddleMetrics({ data, total }: { data: Insurance[]; total: number }) {
    const empCount = data.filter(i => i.insuranceType === InsuranceType.TRADE_INSURANCE).length;
    const indCount = data.filter(i => i.insuranceType === InsuranceType.PRIVATE).length;
    const colCount = data.filter(i => i.insuranceType === InsuranceType.HEALTH_INSURANCE).length;

    const pendingCount = data.filter(i => i.status === InsuranceStatus.INACTIVE).length;
    const activeCount = data.filter(i => i.status === InsuranceStatus.ACTIVE).length;

    const pendingPercentage = data.length > 0 ? ((pendingCount / data.length) * 100).toFixed(1) : '0.0';
    const activePercentage = data.length > 0 ? ((activeCount / data.length) * 100).toFixed(1) : '0.0';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-effect p-4 rounded-xl flex items-center space-x-4 border-l-4 border-l-[#00d4ff]">
                <div className="p-2 bg-slate-800 rounded-lg">
                    <span className="material-symbols-rounded text-[#00d4ff] text-xl">pie_chart</span>
                </div>
                <div className="flex-grow">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Convênios por Tipo (Pág. Atual)</p>
                    <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs font-semibold"><span className="text-[#00d4ff]">{empCount}</span> Emp.</span>
                        <span className="text-xs font-semibold"><span className="text-[#14b8a6]">{indCount}</span> Ind.</span>
                        <span className="text-xs font-semibold"><span className="text-[#a855f7]">{colCount}</span> Col.</span>
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
                        <span className="text-lg font-bold">{pendingCount}</span>
                        <div className="flex space-x-1 h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-[#a855f7]" style={{ width: `${Math.min(100, Number(pendingPercentage))}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-500">{pendingPercentage}% da pág.</span>
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
                        <span className="text-lg font-bold">{activeCount}</span>
                        <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">{activePercentage}%</span>
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