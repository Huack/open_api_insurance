export default function EmptyState() {
    return (
        <div className="lg:col-span-3 glass-effect rounded-2xl flex flex-col items-center justify-center min-h-[600px] p-12 animate-fade-in">
            <div className="p-4 bg-slate-700/20 rounded-2xl mb-6">
                <span className="material-symbols-rounded text-slate-500 text-5xl">search_off</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum convênio encontrado</h3>
            <p className="text-sm text-slate-400 text-center max-w-sm leading-relaxed mb-6">
                Os filtros aplicados não retornaram resultados. Tente ajustar ou limpar os filtros para expandir a busca.
            </p>
            <div className="flex items-center space-x-2 p-3 bg-[#00d4ff]/5 rounded-xl border border-[#00d4ff]/20">
                <span className="material-symbols-rounded text-[#00d4ff] text-sm">lightbulb</span>
                <p className="text-[10px] text-slate-400 font-medium">
                    Dica: clique em "Limpar" nos filtros para ver todos os registros.
                </p>
            </div>
        </div>
    );
}
