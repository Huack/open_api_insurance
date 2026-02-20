import { SearchX } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-800/30 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-700/40">
                <SearchX className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-white">
                Nenhum convênio encontrado
            </h3>
            <p className="max-w-xs text-center text-sm text-slate-400">
                Tente ajustar os filtros aplicados ou limpar a busca para ver todos os registros.
            </p>
        </div>
    );
}
