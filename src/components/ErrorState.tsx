import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl glass py-20 animate-fade-in">
            {/* Animated icon */}
            <div className="relative mb-6">
                <div className="absolute inset-0 rounded-3xl bg-rose-500/20 blur-xl animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 ring-1 ring-rose-500/30">
                    <WifiOff className="h-9 w-9 text-rose-400 animate-float" />
                </div>
            </div>

            <h3 className="mb-2 text-xl font-bold text-white">
                Falha na conexão
            </h3>
            <p className="mb-2 max-w-md text-center text-sm leading-relaxed text-slate-400">
                Não foi possível conectar à API Tasy. Verifique se o token de acesso
                está configurado corretamente nas variáveis de ambiente.
            </p>

            {message && (
                <div className="mb-6 max-w-lg rounded-xl bg-rose-500/5 p-4 ring-1 ring-rose-500/10">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-rose-400/70">
                        <AlertTriangle className="h-3 w-3" />
                        Detalhes do erro
                    </div>
                    <p className="text-xs font-mono text-rose-300/60 break-all leading-relaxed">
                        {message.substring(0, 200)}
                    </p>
                </div>
            )}

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95"
                >
                    <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
                    Tentar novamente
                </button>
            )}
        </div>
    );
}
