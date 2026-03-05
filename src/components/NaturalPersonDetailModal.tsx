import { X, User, MapPin, Phone, Mail, Heart, Calendar, FileText, CreditCard, Shield } from 'lucide-react';
import type { NaturalPerson } from '../types/naturalPerson';

interface NaturalPersonDetailModalProps {
    person: NaturalPerson;
    onClose: () => void;
}

function formatCPF(cpf?: string) {
    if (!cpf) return '---';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatDate(dateString?: string) {
    if (!dateString) return '---';
    try {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
    } catch {
        return dateString;
    }
}

function genderLabel(g?: string) {
    const map: Record<string, string> = { FEMALE: 'Feminino', MALE: 'Masculino', UNDETERMINED: 'Indeterminado', DIVERSE: 'Diverso' };
    return g ? map[g] || g : '---';
}

function maritalLabel(m?: string) {
    const map: Record<string, string> = { SINGLE: 'Solteiro(a)', MARRIED: 'Casado(a)', DIVORCED: 'Divorciado(a)', LEGALLY_SEPARATED: 'Separado(a) Judicialmente', WIDOW: 'Viúvo(a)', SEPARATED: 'Separado(a)', CIVIL_UNION: 'União Estável', OTHERS: 'Outros' };
    return m ? map[m] || m : '---';
}

function bloodLabel(b?: string, rh?: string) {
    if (!b) return '---';
    const rhSign = rh === 'POSITIVE' ? '+' : rh === 'NEGATIVE' ? '-' : '';
    return `${b}${rhSign}`;
}

export default function NaturalPersonDetailModal({ person, onClose }: NaturalPersonDetailModalProps) {
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
                                <User className="h-7 w-7 text-[#00d4ff]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {person.personName}
                                </h2>
                                <div className="mt-1.5 flex items-center space-x-3">
                                    <span className="inline-flex items-center rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-bold text-[#00d4ff]">
                                        Código: {person.naturalPersonCode}
                                    </span>
                                    {person.dateOfDeath && (
                                        <span className="inline-flex items-center space-x-1 rounded-full px-3 py-1 text-[10px] font-bold border uppercase tracking-wider bg-rose-500/10 text-rose-500 border-rose-500/20">
                                            <span>FALECIDO</span>
                                        </span>
                                    )}
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
                    {/* Identification */}
                    <section>
                        <SectionHeader title="Identificação" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoCard icon={<User className="h-4 w-4 text-[#00d4ff]" />} label="Nome Completo" value={person.personName} />
                            <InfoCard icon={<FileText className="h-4 w-4 text-[#a855f7]" />} label="Primeiro Nome" value={person.firstName || '---'} />
                            <InfoCard icon={<FileText className="h-4 w-4 text-[#14b8a6]" />} label="Sobrenome" value={person.lastName || '---'} />
                            <InfoCard icon={<User className="h-4 w-4 text-pink-400" />} label="Gênero" value={genderLabel(person.gender)} />
                            <InfoCard icon={<Calendar className="h-4 w-4 text-emerald-400" />} label="Data de Nascimento" value={formatDate(person.birthDate)} />
                            <InfoCard icon={<User className="h-4 w-4 text-amber-400" />} label="Estado Civil" value={maritalLabel(person.maritalStatus)} />
                        </div>
                    </section>

                    {/* Documents */}
                    <section>
                        <SectionHeader title="Documentos" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoCard icon={<CreditCard className="h-4 w-4 text-[#00d4ff]" />} label="CPF" value={formatCPF(person.taxpayerId)} />
                            <InfoCard icon={<Shield className="h-4 w-4 text-[#a855f7]" />} label="RG" value={person.civilId || '---'} />
                            <InfoCard icon={<CreditCard className="h-4 w-4 text-emerald-400" />} label="Cartão SUS" value={person.susCard || '---'} />
                        </div>
                    </section>

                    {/* Clinical Data */}
                    <section>
                        <SectionHeader title="Dados Clínicos" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-800/30 p-4 border border-[#1e293b] flex items-center space-x-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
                                    <Heart className="h-6 w-6 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tipo Sanguíneo</p>
                                    <p className="text-2xl font-bold text-white">{bloodLabel(person.blood, person.bloodRhFactor)}</p>
                                </div>
                            </div>
                            <InfoCard icon={<User className="h-4 w-4 text-[#14b8a6]" />} label="Altura (cm)" value={person.height ? `${person.height} cm` : '---'} />
                            <InfoCard icon={<User className="h-4 w-4 text-amber-400" />} label="Peso (kg)" value={person.weight ? `${person.weight} kg` : '---'} />
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <SectionHeader title="Contato" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoCard icon={<Phone className="h-4 w-4 text-[#00d4ff]" />} label="Celular" value={person.mobilePhone || '---'} />
                        </div>
                    </section>

                    {/* Death Info */}
                    {person.dateOfDeath && (
                        <section>
                            <SectionHeader title="Óbito" />
                            <InfoCard icon={<Calendar className="h-4 w-4 text-rose-500" />} label="Data do Óbito" value={formatDate(person.dateOfDeath)} />
                        </section>
                    )}

                    {/* Raw JSON (Debug) */}
                    <section>
                        <SectionHeader title="Dados Completos (JSON)" />
                        <div className="p-4 bg-slate-800/40 rounded-xl border border-[#1e293b] font-mono text-[11px] text-slate-400 overflow-x-auto max-h-48">
                            <pre>{JSON.stringify(person, null, 2)}</pre>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
            <div className="flex-grow h-px bg-[#1e293b]"></div>
        </div>
    );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
