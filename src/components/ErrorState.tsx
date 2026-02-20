interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="lg:col-span-3 glass-effect rounded-2xl flex flex-col items-center justify-center min-h-[600px] p-12 animate-fade-in">
            <div className="p-4 bg-[#ef4444]/10 rounded-2xl mb-6">
                <span className="material-symbols-rounded text-[#ef4444] text-5xl">cloud_off</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Falha na conexão</h3>
            <p className="text-sm text-slate-400 text-center max-w-md mb-4 leading-relaxed">
                Não foi possível conectar à API Tasy. Verifique se o token de acesso
                está configurado corretamente nas variáveis de ambiente.
            </p>

            {message && (
                <div className="mb-6 max-w-lg w-full p-4 bg-[#ef4444]/5 rounded-xl border border-[#ef4444]/10">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="material-symbols-rounded text-[#ef4444] text-sm">error</span>
                        <span className="text-[10px] font-bold text-[#ef4444]/70 uppercase tracking-widest">
                            Detalhes do erro
                        </span>
                    </div>
                    <p className="text-xs font-mono text-[#ef4444]/60 break-all leading-relaxed">
                        {message.substring(0, 300)}
                    </p>
                </div>
            )}

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center space-x-2 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-slate-900 px-6 py-3 rounded-xl text-sm font-bold transition-all glow-accent active:scale-95"
                >
                    <span className="material-symbols-rounded text-lg">refresh</span>
                    <span>Tentar novamente</span>
                </button>
            )}
        </div>
    );
}
