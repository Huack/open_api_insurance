export default function EmptyState() {
    return (
        <div className="flex-1 flex items-center justify-center p-8 w-full animate-fade-in bg-[#1e293b]">
            <div className="max-w-md w-full p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
                    <span className="material-symbols-rounded text-slate-400 text-4xl">search_off</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                    Nenhum registro encontrado
                </h3>

                <p className="text-base text-slate-400 leading-relaxed mb-8">
                    Os filtros aplicados não retornaram resultados. Verifique os parâmetros e tente novamente.
                </p>

                <div className="bg-[#0ea5e9]/10 text-[#0ea5e9] px-5 py-3 rounded-xl border border-[#0ea5e9]/20 flex items-center gap-3 w-full justify-center">
                    <span className="material-symbols-rounded text-xl">lightbulb</span>
                    <span className="text-sm font-semibold">Dica: Use "Limpar" na barra lateral para resetar a busca.</span>
                </div>
            </div>
        </div>
    );
}
