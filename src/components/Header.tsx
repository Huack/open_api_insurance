import { Activity } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                    <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white">
                        Gestão de Convênios
                    </h1>
                    <p className="text-xs font-medium text-slate-400">Philips Tasy</p>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        API Conectada
                    </span>
                </div>
            </div>
        </header>
    );
}