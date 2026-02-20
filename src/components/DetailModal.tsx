import { X, Layers, FileText, ShieldCheck, Calendar, Building2, Hash, UserCircle } from 'lucide-react';
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl glass glow-cyan shadow-2xl shadow-cyan-500/5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl px-6 py-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-500/20">
                                <Building2 className="h-6 w-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    {insurance.commercialName || insurance.insuranceDescription}
                                </h2>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-slate-700/50 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300">
                                        #{insurance.insuranceId}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${insurance.status === InsuranceStatus.ACTIVE
                                                ? 'bg-emerald-500/15 text-emerald-400'
                                                : 'bg-rose-500/15 text-rose-400'
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${insurance.status === InsuranceStatus.ACTIVE ? 'bg-emerald-400' : 'bg-rose-400'
                                                }`}
                                        />
                                        {getStatusLabel(insurance.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 ring-1 ring-white/5 transition-all hover:bg-white/5 hover:text-white hover:ring-white/10 active:scale-90"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-6 p-6 stagger-children">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <InfoCard
                            icon={<FileText className="h-4 w-4 text-cyan-400" />}
                            label="Razão Social"
                            value={insurance.corporateName || '—'}
                        />
                        <InfoCard
                            icon={<ShieldCheck className="h-4 w-4 text-blue-400" />}
                            label="CNPJ"
                            value={formatCNPJ(insurance.legalEntityCode || '')}
                        />
                        <InfoCard
                            icon={<Layers className="h-4 w-4 text-violet-400" />}
                            label="Tipo"
                            value={getInsuranceTypeLabel(insurance.insuranceType)}
                        />
                        <InfoCard
                            icon={<UserCircle className="h-4 w-4 text-amber-400" />}
                            label="Tipo Pessoa"
                            value={insurance.personType === 'LEGAL_ENTITY' ? 'Pessoa Jurídica' : insurance.personType === 'PERSON' ? 'Pessoa Física' : insurance.personType || '—'}
                        />
                        {insurance.ansCode && (
                            <InfoCard
                                icon={<Hash className="h-4 w-4 text-emerald-400" />}
                                label="Código ANS"
                                value={insurance.ansCode}
                            />
                        )}
                        {insurance.inclusionDate && (
                            <InfoCard
                                icon={<Calendar className="h-4 w-4 text-pink-400" />}
                                label="Data Inclusão"
                                value={new Date(insurance.inclusionDate).toLocaleDateString('pt-BR')}
                            />
                        )}
                    </div>

                    {/* Plans */}
                    {insurance.plans && insurance.plans.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Planos ({insurance.plans.length})
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {insurance.plans.map((plan) => (
                                    <span
                                        key={plan.insurancePlanId}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition-all hover:scale-[1.03] ${plan.status === 'ACTIVE'
                                                ? 'bg-cyan-500/10 text-cyan-200 ring-cyan-500/20'
                                                : 'bg-slate-500/10 text-slate-400 ring-slate-500/20'
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${plan.status === 'ACTIVE' ? 'bg-cyan-400' : 'bg-slate-500'
                                                }`}
                                        />
                                        {plan.planDescription}
                                        {plan.ansPlanCode && (
                                            <span className="ml-0.5 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-medium opacity-70">
                                                ANS: {plan.ansPlanCode}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categories */}
                    {insurance.categories && insurance.categories.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Categorias ({insurance.categories.length})
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                            </div>
                            <div className="space-y-3">
                                {insurance.categories.map((cat) => (
                                    <div
                                        key={cat.categoryId}
                                        className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-white/5 transition-all hover:ring-white/10"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-white">
                                                {cat.categoryDescription}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${cat.status === 'ACTIVE'
                                                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                                                    }`}
                                            >
                                                {cat.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                        {cat.accommodation && (
                                            <p className="mb-2 text-xs text-slate-400">
                                                <span className="font-medium text-slate-300">Acomodação:</span>{' '}
                                                {cat.accommodation.accommodationTypeDescription}
                                                {cat.accommodation.accommodationLevel != null && (
                                                    <span className="ml-1 text-[10px] text-slate-500">
                                                        (Nível {cat.accommodation.accommodationLevel})
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                        {cat.insuranceCategoryPlan && cat.insuranceCategoryPlan.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {cat.insuranceCategoryPlan.map((plan) => (
                                                    <span
                                                        key={`${plan.sequenceId}-${plan.planId}`}
                                                        className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-300 ring-1 ring-violet-500/20"
                                                    >
                                                        {plan.planDescription}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!insurance.categories || insurance.categories.length === 0) &&
                        (!insurance.plans || insurance.plans.length === 0) && (
                            <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
                                <Layers className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                                <p className="text-sm font-medium text-slate-400">
                                    Nenhuma categoria ou plano disponível
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Este convênio não possui planos ou categorias cadastradas.
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
        <div className="rounded-xl bg-slate-900/60 p-3.5 ring-1 ring-white/5 transition-all hover:ring-white/10">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {icon}
                {label}
            </div>
            <p className="text-sm font-bold text-white">{value}</p>
        </div>
    );
}
