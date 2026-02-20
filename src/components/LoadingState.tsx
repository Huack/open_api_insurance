export default function LoadingState() {
    return (
        <div className="flex-1 overflow-hidden rounded-2xl glass animate-fade-in">
            {/* Shimmer header */}
            <div className="border-b border-white/8 bg-gradient-to-r from-slate-900/80 to-slate-800/40 px-5 py-4">
                <div className="flex gap-12">
                    {[60, 140, 120, 80, 70].map((w, i) => (
                        <div
                            key={i}
                            className="h-3 animate-pulse rounded-full bg-gradient-to-r from-slate-700 to-slate-600"
                            style={{ width: w, animationDelay: `${i * 100}ms` }}
                        />
                    ))}
                </div>
            </div>

            {/* Skeleton rows */}
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-8 border-b border-white/5 px-5 py-4 last:border-b-0"
                    style={{ opacity: 1 - i * 0.08 }}
                >
                    <div
                        className="h-7 w-14 animate-pulse rounded-lg bg-slate-800/80"
                        style={{ animationDelay: `${i * 80}ms` }}
                    />
                    <div className="flex-1 space-y-1.5">
                        <div
                            className="h-4 animate-pulse rounded bg-slate-700/50"
                            style={{ width: `${60 + Math.random() * 30}%`, animationDelay: `${i * 80 + 40}ms` }}
                        />
                        <div
                            className="h-2.5 animate-pulse rounded bg-slate-800/40"
                            style={{ width: `${30 + Math.random() * 20}%`, animationDelay: `${i * 80 + 80}ms` }}
                        />
                    </div>
                    <div
                        className="h-4 w-32 animate-pulse rounded bg-slate-700/40"
                        style={{ animationDelay: `${i * 80 + 120}ms` }}
                    />
                    <div
                        className="h-6 w-20 animate-pulse rounded-full bg-slate-700/40"
                        style={{ animationDelay: `${i * 80 + 160}ms` }}
                    />
                    <div
                        className="h-6 w-16 animate-pulse rounded-full bg-slate-700/40"
                        style={{ animationDelay: `${i * 80 + 200}ms` }}
                    />
                </div>
            ))}

            {/* Loading indicator */}
            <div className="flex items-center justify-center border-t border-white/8 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin-slow" />
                    <span className="text-xs font-medium text-slate-400">Carregando convênios...</span>
                </div>
            </div>
        </div>
    );
}
