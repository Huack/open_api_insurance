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

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Background decoration */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl" />
                <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-3xl" />
            </div>

            <div className="relative z-10">
                <Header />

                <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
                    {/* Stats bar */}
                    {data && (
                        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <StatCard label="Total de Convênios" value={total} />
                            <StatCard label="Página Atual" value={`${filters.page} / ${Math.ceil(total / filters.size) || 1}`} />
                            <StatCard label="Por Página" value={filters.size} />
                            <StatCard label="Exibindo" value={results.length} />
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

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-white/10 bg-slate-800/40 px-4 py-3 backdrop-blur-sm">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="mt-0.5 text-lg font-bold text-white">{value}</p>
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