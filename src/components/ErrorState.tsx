import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
                <AlertTriangle className="h-8 w-8 text-rose-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-white">
                Erro ao carregar dados
            </h3>
            <p className="mb-5 max-w-sm text-center text-sm text-slate-400">
                {message || 'Não foi possível conectar à API. Verifique se o token está configurado corretamente.'}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 active:scale-95"
                >
                    <RefreshCw className="h-4 w-4" />
                    Tentar novamente
                </button>
            )}
        </div>
    );
}
