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
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl glass-effect shadow-2xl shadow-[#00d4ff]/5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-[#1e293b] bg-slate-900/90 backdrop-blur-xl px-8 py-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/20">
                                <Building2 className="h-7 w-7 text-[#00d4ff]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {insurance.commercialName || insurance.insuranceDescription}
                                </h2>
                                <div className="mt-1.5 flex items-center space-x-3">
                                    <span className="inline-flex items-center rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-bold text-[#00d4ff]">
                                        #{insurance.insuranceId}
                                    </span>
                                    <span
                                        className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-[10px] font-bold border uppercase tracking-wider ${insurance.status === InsuranceStatus.ACTIVE
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${insurance.status === InsuranceStatus.ACTIVE ? 'bg-emerald-500' : 'bg-rose-500'
                                                }`}
                                        />
                                        <span>{getStatusLabel(insurance.status)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-[#1e293b] transition-all hover:bg-slate-700 hover:text-white active:scale-90"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoCard
                            icon={<FileText className="h-4 w-4 text-[#00d4ff]" />}
                            label="Razão Social"
                            value={insurance.corporateName || '—'}
                        />
                        <InfoCard
                            icon={<ShieldCheck className="h-4 w-4 text-[#a855f7]" />}
                            label="CNPJ"
                            value={formatCNPJ(insurance.legalEntityCode || '') || '—'}
                        />
                        <InfoCard
                            icon={<Layers className="h-4 w-4 text-[#14b8a6]" />}
                            label="Tipo de Convênio"
                            value={getInsuranceTypeLabel(insurance.insuranceType)}
                        />
                        <InfoCard
                            icon={<UserCircle className="h-4 w-4 text-[#22c55e]" />}
                            label="Tipo Pessoa"
                            value={insurance.personType === 'LEGAL_ENTITY' ? 'Pessoa Jurídica' : 'Pessoa Física'}
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
                                label="Data de Inclusão"
                                value={new Date(insurance.inclusionDate).toLocaleDateString('pt-BR')}
                            />
                        )}
                    </div>

                    {/* Plans Section */}
                    {insurance.plans && insurance.plans.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Planos Disponíveis</h3>
                                <div className="flex-grow h-px bg-[#1e293b]"></div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {insurance.plans.map((plan) => (
                                    <div
                                        key={plan.insurancePlanId}
                                        className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all hover:scale-[1.03] ${plan.status === 'ACTIVE'
                                                ? 'bg-[#00d4ff]/5 text-[#00d4ff] border-[#00d4ff]/20'
                                                : 'bg-slate-800 text-slate-500 border-[#1e293b]'
                                            }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${plan.status === 'ACTIVE' ? 'bg-[#00d4ff]' : 'bg-slate-600'}`} />
                                        <span>{plan.planDescription}</span>
                                        {plan.ansPlanCode && (
                                            <span className="text-[10px] opacity-50 px-1.5 py-0.5 bg-black/20 rounded">ANS: {plan.ansPlanCode}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Categories Section */}
                    {insurance.categories && insurance.categories.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Categorias</h3>
                                <div className="flex-grow h-px bg-[#1e293b]"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {insurance.categories.map((cat) => (
                                    <div
                                        key={cat.categoryId}
                                        className="rounded-2xl bg-slate-800/40 p-5 border border-[#1e293b] hover:border-[#00d4ff]/20 transition-all"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-bold text-white">
                                                {cat.categoryDescription}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${cat.status === 'ACTIVE'
                                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                                    }`}
                                            >
                                                {cat.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                        {cat.accommodation && (
                                            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-3">
                                                <span className="material-symbols-rounded text-base text-[#00d4ff]">hotel</span>
                                                <span>Acomodação: <strong className="text-slate-200">{cat.accommodation.accommodationTypeDescription}</strong></span>
                                            </div>
                                        )}
                                        {cat.insuranceCategoryPlan && cat.insuranceCategoryPlan.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1e293b]">
                                                {cat.insuranceCategoryPlan.map((plan) => (
                                                    <span
                                                        key={`${plan.sequenceId}-${plan.planId}`}
                                                        className="rounded-lg bg-[#a855f7]/5 px-3 py-1 text-[11px] font-bold text-[#a855f7] border border-[#a855f7]/20"
                                                    >
                                                        {plan.planDescription}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(!insurance.categories || insurance.categories.length === 0) &&
                        (!insurance.plans || insurance.plans.length === 0) && (
                            <div className="rounded-2xl border border-dashed border-[#1e293b] py-12 text-center">
                                <span className="material-symbols-rounded text-slate-600 text-4xl mb-4">layers</span>
                                <p className="text-sm font-semibold text-slate-400">
                                    Nenhum plano ou categoria adicional disponível
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
        <div className="rounded-2xl bg-slate-800/30 p-4 border border-[#1e293b] hover:border-[#00d4ff]/10 transition-all">
            <div className="mb-2 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {icon}
                <span>{label}</span>
            </div>
            <p className="text-sm font-bold text-white leading-tight">{value}</p>
        </div>
    );
}
