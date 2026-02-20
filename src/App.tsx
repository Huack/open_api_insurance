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
import { Database, BarChart3, TrendingUp, ListChecks } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Animated background blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-60 right-20 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.04] blur-[100px] animate-gradient-flow" />
                <div className="absolute bottom-20 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.04] blur-[100px] animate-gradient-flow-delayed" />
                <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.03] blur-[100px] animate-gradient-flow" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative z-10">
                <Header />

                <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
                    {/* Stats Cards */}
                    {data && (
                        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-children">
                            <StatCard
                                icon={<Database className="h-4 w-4" />}
                                label="Total de Convênios"
                                value={total.toLocaleString('pt-BR')}
                                color="cyan"
                            />
                            <StatCard
                                icon={<BarChart3 className="h-4 w-4" />}
                                label="Página Atual"
                                value={`${filters.page} / ${totalPages}`}
                                color="blue"
                            />
                            <StatCard
                                icon={<TrendingUp className="h-4 w-4" />}
                                label="Por Página"
                                value={String(filters.size)}
                                color="violet"
                            />
                            <StatCard
                                icon={<ListChecks className="h-4 w-4" />}
                                label="Exibindo"
                                value={String(results.length)}
                                color="emerald"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-6 lg:flex-row">
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
            </div>

            {selected && (
                <DetailModal
                    insurance={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: 'cyan' | 'blue' | 'violet' | 'emerald';
}) {
    const colorMap = {
        cyan: {
            bg: 'from-cyan-500/10 to-cyan-600/5',
            icon: 'text-cyan-400 bg-cyan-500/15',
            ring: 'ring-cyan-500/10',
            value: 'text-cyan-100',
        },
        blue: {
            bg: 'from-blue-500/10 to-blue-600/5',
            icon: 'text-blue-400 bg-blue-500/15',
            ring: 'ring-blue-500/10',
            value: 'text-blue-100',
        },
        violet: {
            bg: 'from-violet-500/10 to-violet-600/5',
            icon: 'text-violet-400 bg-violet-500/15',
            ring: 'ring-violet-500/10',
            value: 'text-violet-100',
        },
        emerald: {
            bg: 'from-emerald-500/10 to-emerald-600/5',
            icon: 'text-emerald-400 bg-emerald-500/15',
            ring: 'ring-emerald-500/10',
            value: 'text-emerald-100',
        },
    };

    const c = colorMap[color];

    return (
        <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${c.bg} p-4 ring-1 ${c.ring} transition-all hover:scale-[1.02] hover:ring-2`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </p>
                    <p className={`mt-1.5 text-2xl font-extrabold tracking-tight ${c.value}`}>
                        {value}
                    </p>
                </div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.icon}`}>
                    {icon}
                </div>
            </div>
            {/* Decorative gradient */}
            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/[0.02] blur-2xl transition-transform group-hover:scale-150" />
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