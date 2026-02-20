import { X, Layers, FileText, ShieldCheck } from 'lucide-react';
import type { Insurance } from '../types/insurance';
import { InsuranceStatus } from '../types/insurance';
import { formatCNPJ } from '../utils/formatCNPJ';
import { getInsuranceTypeLabel, getStatusLabel } from '../utils/labels';

interface DetailModalProps {
    insurance: Insurance;
    onClose: () => void;
}

export default function DetailModal({ insurance, onClose }: DetailModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-800 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-800/95 px-6 py-4 backdrop-blur-sm">
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            {insurance.legalEntity?.commercialName || insurance.description}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-400">
                            Convênio #{insurance.id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoCard
                            icon={<FileText className="h-4 w-4 text-cyan-400" />}
                            label="Razão Social"
                            value={insurance.legalEntity?.corporateName || '—'}
                        />
                        <InfoCard
                            icon={<ShieldCheck className="h-4 w-4 text-cyan-400" />}
                            label="CNPJ"
                            value={formatCNPJ(insurance.legalEntity?.legalEntityId || '')}
                        />
                        <InfoCard
                            icon={<Layers className="h-4 w-4 text-cyan-400" />}
                            label="Tipo"
                            value={getInsuranceTypeLabel(insurance.insuranceType)}
                        />
                        <InfoCard
                            icon={
                                <span
                                    className={`inline-block h-2.5 w-2.5 rounded-full ${insurance.status === InsuranceStatus.ACTIVE
                                            ? 'bg-emerald-400'
                                            : 'bg-rose-400'
                                        }`}
                                />
                            }
                            label="Status"
                            value={getStatusLabel(insurance.status)}
                        />
                    </div>

                    {/* Categories */}
                    {insurance.categories && insurance.categories.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-white">
                                Categorias & Planos
                            </h3>
                            <div className="space-y-3">
                                {insurance.categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="rounded-xl border border-white/10 bg-slate-900/50 p-4"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium text-white">
                                                {cat.description}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.status === 'ACTIVE'
                                                        ? 'bg-emerald-500/10 text-emerald-400'
                                                        : 'bg-rose-500/10 text-rose-400'
                                                    }`}
                                            >
                                                {cat.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                        {cat.accommodation && (
                                            <p className="mb-2 text-xs text-slate-400">
                                                Acomodação: {cat.accommodation}
                                            </p>
                                        )}
                                        {cat.plans && cat.plans.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {cat.plans.map((plan) => (
                                                    <span
                                                        key={plan.id}
                                                        className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-300 ring-1 ring-cyan-500/20"
                                                    >
                                                        {plan.description}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!insurance.categories || insurance.categories.length === 0) && (
                        <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
                            <Layers className="mx-auto mb-2 h-8 w-8 text-slate-600" />
                            <p className="text-sm text-slate-400">
                                Nenhuma categoria disponível para este convênio.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
                {icon}
                {label}
            </div>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    );
}
