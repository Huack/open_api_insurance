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
    page: 0,
    size: 15,
    status: '',
    insuranceType: '',
    id: '',
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
                            <StatCard label="Total de Convênios" value={data.totalElements} />
                            <StatCard label="Página Atual" value={`${data.number + 1} / ${data.totalPages || 1}`} />
                            <StatCard label="Por Página" value={data.size} />
                            <StatCard label="Registros na Página" value={data.content.length} />
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
                        ) : data && data.content.length === 0 ? (
                            <EmptyState />
                        ) : data ? (
                            <InsuranceTable
                                data={data.content}
                                onSelect={setSelected}
                                page={data.number}
                                totalPages={data.totalPages}
                                totalElements={data.totalElements}
                                onPageChange={(p) => handleFilterChange({ page: p })}
                            />
                        ) : null}
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