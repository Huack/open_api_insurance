import { Activity, Shield, Zap } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-30 glass">
            <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-6 py-4">
                {/* Logo */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 opacity-50 blur-lg" />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                </div>

                {/* Title */}
                <div className="animate-fade-in">
                    <h1 className="text-lg font-bold tracking-tight text-white">
                        Gestão de Convênios
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-slate-400">Philips Tasy</p>
                        <span className="text-slate-600">•</span>
                        <p className="text-xs font-medium text-cyan-400/70">Dashboard v2.0</p>
                    </div>
                </div>

                {/* Right side */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Feature badges */}
                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 ring-1 ring-white/5 transition-colors hover:ring-white/10">
                            <Shield className="h-3 w-3 text-violet-400" />
                            OAuth2
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 ring-1 ring-white/5 transition-colors hover:ring-white/10">
                            <Zap className="h-3 w-3 text-amber-400" />
                            Real-time
                        </span>
                    </div>

                    {/* Connection status */}
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-ring" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            Online
                        </span>
                    </div>
                </div>
            </div>

            {/* Gradient line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </header>
    );
}