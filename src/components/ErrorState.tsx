interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    // Common OAuth error handling for better UX
    const isAuthError = message?.includes('401') || message?.toLowerCase().includes('unauthorized');

    const displayTitle = isAuthError
        ? "Falha de Autenticação (OAuth 2.0)"
        : "Erro de Comunicação com o Tasy";

    const displayMessage = isAuthError
        ? "O token de acesso expirou ou é inválido. Verifique as credenciais no Vercel."
        : (message || "Não foi possível carregar os dados. Verifique a conexão com o gateway.");

    return (
        <div className="flex-1 flex items-center justify-center p-8 w-full animate-fade-in">
            <div className="max-w-xl w-full surface-card border-rose-500/20 p-8 flex flex-col items-center text-center relative overflow-hidden">

                {/* Warning Background Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/50" />

                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
                    <span className="material-symbols-rounded text-rose-500 text-3xl">
                        {isAuthError ? 'key_off' : 'cloud_off'}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                    {displayTitle}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                    {displayMessage}
                </p>

                <div className="mt-8 flex gap-4 w-full sm:w-auto">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-rounded text-[20px]">refresh</span>
                            Tentar Novamente
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
