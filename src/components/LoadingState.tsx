export default function LoadingState() {
    return (
        <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm">
            {/* Skeleton header */}
            <div className="border-b border-white/10 bg-slate-900/50 px-5 py-3.5">
                <div className="flex gap-12">
                    {[80, 160, 140, 80, 80].map((w, i) => (
                        <div
                            key={i}
                            className="h-3 animate-pulse rounded bg-slate-700"
                            style={{ width: w }}
                        />
                    ))}
                </div>
            </div>
            {/* Skeleton rows */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-12 border-b border-white/5 px-5 py-4"
                >
                    <div className="h-4 w-12 animate-pulse rounded bg-slate-700/60" />
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-700/60" />
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-700/60" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-slate-700/60" />
                    <div className="h-5 w-14 animate-pulse rounded-full bg-slate-700/60" />
                </div>
            ))}
        </div>
    );
}
