import { SearchX, ArrowRight } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl glass py-20 animate-fade-in">
            {/* Icon */}
            <div className="relative mb-6">
                <div className="absolute inset-0 rounded-3xl bg-slate-500/10 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-700/30 to-slate-600/20 ring-1 ring-white/10">
                    <SearchX className="h-9 w-9 text-slate-500 animate-float" />
                </div>
            </div>

            <h3 className="mb-2 text-xl font-bold text-white">
                Nenhum convênio encontrado
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm leading-relaxed text-slate-400">
                Os filtros aplicados não retornaram resultados. Tente ajustar ou limpar os filtros para expandir a busca.
            </p>

            <div className="flex items-center gap-2 rounded-xl bg-cyan-500/5 px-4 py-2.5 ring-1 ring-cyan-500/10">
                <p className="text-xs font-medium text-cyan-300/70">
                    Dica: clique em "Limpar" na sidebar para ver todos os registros
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-cyan-400/50" />
            </div>
        </div>
    );
}
