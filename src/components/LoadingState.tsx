export default function LoadingState() {
    return (
        <div className="w-full glass-effect rounded-2xl overflow-hidden flex flex-col animate-fade-in">
            {/* Header skeleton */}
            <div className="p-6 border-b border-[#1e293b] bg-slate-800/20">
                <div className="flex items-center space-x-4">
                    <div className="h-5 w-40 animate-pulse rounded bg-slate-700/40" />
                    <div className="h-5 w-20 animate-pulse rounded-md bg-[#00d4ff]/10" />
                </div>
            </div>

            {/* Table header skeleton */}
            <div className="bg-slate-900/30 px-6 py-4 flex gap-12">
                {[50, 140, 100, 60, 50].map((w, i) => (
                    <div
                        key={i}
                        className="h-3 animate-pulse rounded bg-slate-700/30"
                        style={{ width: w, animationDelay: `${i * 100}ms` }}
                    />
                ))}
            </div>

            {/* Rows skeleton */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-8 border-b border-[#1e293b] px-6 py-4"
                    style={{ opacity: 1 - i * 0.08 }}
                >
                    <div className="h-4 w-12 animate-pulse rounded bg-slate-700/30 font-mono"
                        style={{ animationDelay: `${i * 60}ms` }} />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-4 animate-pulse rounded bg-slate-700/40"
                            style={{ width: `${50 + Math.random() * 30}%`, animationDelay: `${i * 60 + 30}ms` }} />
                        <div className="h-2.5 animate-pulse rounded bg-slate-700/20"
                            style={{ width: `${25 + Math.random() * 15}%`, animationDelay: `${i * 60 + 60}ms` }} />
                    </div>
                    <div className="h-5 w-24 animate-pulse rounded bg-slate-800"
                        style={{ animationDelay: `${i * 60 + 90}ms` }} />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-700/30"
                        style={{ animationDelay: `${i * 60 + 120}ms` }} />
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-700/20"
                        style={{ animationDelay: `${i * 60 + 150}ms` }} />
                </div>
            ))}

            {/* Footer skeleton */}
            <div className="mt-auto p-6 border-t border-[#1e293b] flex items-center justify-between">
                <div className="h-3 w-48 animate-pulse rounded bg-slate-700/30" />
                <div className="flex items-center space-x-2">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="w-8 h-8 animate-pulse rounded-lg bg-slate-700/20" />
                    ))}
                </div>
            </div>
        </div>
    );
}
