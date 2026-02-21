export default function Header() {
    return (
        <header className="sticky top-0 z-50 glass-effect border-b border-white/5 px-6 py-3">
            <div className="max-w-4k mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="bg-[#00d4ff] p-2 rounded-xl shadow-lg shadow-[#00d4ff]/20">
                        <span className="material-symbols-rounded text-white text-2xl">monitoring</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white leading-none">Gestão de Convênios</h1>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Philips Tasy</span>
                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                            <span className="text-[10px] font-medium text-[#00d4ff] uppercase tracking-widest">Data Analyst View v3.0</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
                            <span className="material-symbols-rounded text-slate-400 text-sm">shield</span>
                            <span className="text-xs font-medium">OAuth2</span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
                            <span className="material-symbols-rounded text-[#a855f7] text-sm">bolt</span>
                            <span className="text-xs font-medium">Real-time</span>
                        </div>
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Online</span>
                        </div>
                    </div>

                    <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>

                    <div className="flex items-center space-x-3">
                        <button className="p-2 hover:bg-slate-800 rounded-full transition-colors relative">
                            <span className="material-symbols-rounded text-slate-500">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-slate-900"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-2">
                            <div className="text-right">
                                <p className="text-xs font-semibold text-white">Administrador Tasy</p>
                                <p className="text-[10px] text-slate-500">Acesso Total</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#00d4ff]/20 flex items-center justify-center">
                                <span className="material-symbols-rounded text-slate-400">person</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Badge({ icon, label }: { icon: string; label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 shadow-sm">
            <span className="material-symbols-rounded text-[16px] text-slate-400">{icon}</span>
            <span className="text-xs font-semibold">{label}</span>
        </div>
    );
}