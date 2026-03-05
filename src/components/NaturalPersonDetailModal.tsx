import { useState } from 'react';
import { X, User, Phone, Mail, Heart, Calendar, FileText, CreditCard, Shield, MapPin, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import type { NaturalPerson, AdditionalInformation, AdditionalInfoRequest } from '../types/naturalPerson';
import { useAdditionalInfo, useCreateAdditionalInfo, useDeleteAdditionalInfo } from '../hooks/useAdditionalInfo';

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

function contactTypeLabel(ct: string) {
    const map: Record<string, string> = {
        EMAIL: 'E-mail',
        PHONE: 'Telefone Fixo',
        MOBILE_PHONE: 'Celular',
        COMMERCIAL_PHONE: 'Telefone Comercial',
        FAX: 'Fax',
        RESIDENTIAL_ADDRESS: 'Endereço Residencial',
        COMMERCIAL_ADDRESS: 'Endereço Comercial',
        BILLING_ADDRESS: 'Endereço de Cobrança',
        OTHER: 'Outro',
    };
    return map[ct] || ct;
}

function contactTypeIcon(ct: string) {
    if (ct.includes('EMAIL')) return <Mail className="h-4 w-4 text-[#00d4ff]" />;
    if (ct.includes('PHONE') || ct.includes('MOBILE') || ct.includes('FAX')) return <Phone className="h-4 w-4 text-emerald-400" />;
    if (ct.includes('ADDRESS')) return <MapPin className="h-4 w-4 text-[#a855f7]" />;
    return <FileText className="h-4 w-4 text-slate-400" />;
}

const CONTACT_TYPE_OPTIONS = [
    { value: 'EMAIL', label: 'E-mail' },
    { value: 'PHONE', label: 'Telefone Fixo' },
    { value: 'MOBILE_PHONE', label: 'Celular' },
    { value: 'COMMERCIAL_PHONE', label: 'Telefone Comercial' },
    { value: 'RESIDENTIAL_ADDRESS', label: 'Endereço Residencial' },
    { value: 'COMMERCIAL_ADDRESS', label: 'Endereço Comercial' },
];

export default function NaturalPersonDetailModal({ person, onClose }: NaturalPersonDetailModalProps) {
    const { data: additionalInfo, isLoading: aiLoading, isError: aiError } = useAdditionalInfo(person.naturalPersonCode);
    const createMutation = useCreateAdditionalInfo(person.naturalPersonCode);
    const deleteMutation = useDeleteAdditionalInfo(person.naturalPersonCode);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newContactType, setNewContactType] = useState('EMAIL');
    const [newValue, setNewValue] = useState('');
    const [newComplement, setNewComplement] = useState('');

    const handleAddContact = () => {
        if (!newValue.trim()) return;
        const body: AdditionalInfoRequest = { value: newValue.trim() };
        if (newComplement.trim()) body.complement = newComplement.trim();
        createMutation.mutate(
            { contactType: newContactType, body },
            {
                onSuccess: () => {
                    setNewValue('');
                    setNewComplement('');
                    setShowAddForm(false);
                },
            }
        );
    };

    const handleDelete = (contactType: string) => {
        if (!confirm(`Tem certeza que deseja excluir o contato ${contactTypeLabel(contactType)}?`)) return;
        deleteMutation.mutate({ contactType });
    };

    // Separar contatos de endereços
    const contacts = (additionalInfo || []).filter(
        (ai) => ai.contactType.includes('PHONE') || ai.contactType.includes('EMAIL') || ai.contactType.includes('FAX') || ai.contactType === 'MOBILE_PHONE'
    );
    const addresses = (additionalInfo || []).filter(
        (ai) => ai.contactType.includes('ADDRESS')
    );
    const others = (additionalInfo || []).filter(
        (ai) => !contacts.includes(ai) && !addresses.includes(ai)
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl glass-effect shadow-2xl shadow-[#00d4ff]/5"
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

                    {/* ── Additional Information (Contatos) ── */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <SectionHeader title="Contatos" />
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#00d4ff]/10 text-[#00d4ff] text-xs font-bold border border-[#00d4ff]/20 hover:bg-[#00d4ff]/20 transition-all"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>ADICIONAR</span>
                            </button>
                        </div>

                        {/* Add Contact Form */}
                        {showAddForm && (
                            <div className="mb-4 p-4 rounded-2xl bg-slate-800/50 border border-[#00d4ff]/20 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tipo</label>
                                        <select
                                            value={newContactType}
                                            onChange={(e) => setNewContactType(e.target.value)}
                                            className="w-full bg-slate-700 border-none rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-[#00d4ff] outline-none"
                                        >
                                            {CONTACT_TYPE_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Valor</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: (11) 99999-0000"
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                            className="w-full bg-slate-700 border-none rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-[#00d4ff] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Complemento</label>
                                        <input
                                            type="text"
                                            placeholder="Opcional..."
                                            value={newComplement}
                                            onChange={(e) => setNewComplement(e.target.value)}
                                            className="w-full bg-slate-700 border-none rounded-lg px-3 py-2 text-xs text-white focus:ring-2 focus:ring-[#00d4ff] outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddContact}
                                        disabled={createMutation.isPending || !newValue.trim()}
                                        className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#00d4ff] text-slate-900 text-xs font-bold hover:bg-[#00d4ff]/90 transition-all disabled:opacity-50"
                                    >
                                        {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                        <span>Salvar</span>
                                    </button>
                                </div>
                                {createMutation.isError && (
                                    <p className="text-xs text-rose-400">Erro ao salvar: {(createMutation.error as Error)?.message}</p>
                                )}
                            </div>
                        )}

                        {/* Loading / Error State */}
                        {aiLoading && (
                            <div className="flex items-center space-x-2 text-slate-500 text-xs p-4">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Carregando informações adicionais...</span>
                            </div>
                        )}
                        {aiError && (
                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                                Não foi possível carregar os contatos. A API pode não suportar este endpoint para este paciente.
                            </div>
                        )}

                        {/* Contacts List */}
                        {contacts.length > 0 && (
                            <div className="space-y-2">
                                {contacts.map((c, idx) => (
                                    <ContactCard key={`${c.contactType}-${idx}`} info={c} onDelete={() => handleDelete(c.contactType)} isDeleting={deleteMutation.isPending} />
                                ))}
                            </div>
                        )}

                        {!aiLoading && !aiError && contacts.length === 0 && !showAddForm && (
                            <p className="text-xs text-slate-600 p-4">Nenhum contato cadastrado.</p>
                        )}
                    </section>

                    {/* ── Endereços ── */}
                    {addresses.length > 0 && (
                        <section>
                            <SectionHeader title="Endereços" />
                            <div className="space-y-2">
                                {addresses.map((a, idx) => (
                                    <AddressCard key={`${a.contactType}-${idx}`} info={a} onDelete={() => handleDelete(a.contactType)} isDeleting={deleteMutation.isPending} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Outros ── */}
                    {others.length > 0 && (
                        <section>
                            <SectionHeader title="Outras Informações" />
                            <div className="space-y-2">
                                {others.map((o, idx) => (
                                    <ContactCard key={`${o.contactType}-${idx}`} info={o} onDelete={() => handleDelete(o.contactType)} isDeleting={deleteMutation.isPending} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Death Info */}
                    {person.dateOfDeath && (
                        <section>
                            <SectionHeader title="Óbito" />
                            <InfoCard icon={<Calendar className="h-4 w-4 text-rose-500" />} label="Data do Óbito" value={formatDate(person.dateOfDeath)} />
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────

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

function ContactCard({ info, onDelete, isDeleting }: { info: AdditionalInformation; onDelete: () => void; isDeleting: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-[#1e293b] hover:border-[#00d4ff]/10 transition-all group">
            <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/50">
                    {contactTypeIcon(info.contactType)}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{info.contactTypeDescription || contactTypeLabel(info.contactType)}</p>
                    <p className="text-sm font-bold text-white">{info.value || '---'}</p>
                    {info.complement && <p className="text-[10px] text-slate-500 mt-0.5">{info.complement}</p>}
                </div>
            </div>
            <button
                onClick={onDelete}
                disabled={isDeleting}
                className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Excluir contato"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}

function AddressCard({ info, onDelete, isDeleting }: { info: AdditionalInformation; onDelete: () => void; isDeleting: boolean }) {
    const addressParts = [info.value, info.complement, info.neighborhood, info.city, info.state, info.zipCode].filter(Boolean);
    const fullAddress = addressParts.join(', ') || '---';

    return (
        <div className="flex items-start justify-between p-4 rounded-xl bg-slate-800/30 border border-[#1e293b] hover:border-[#a855f7]/10 transition-all group">
            <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a855f7]/10 mt-1">
                    <MapPin className="h-4 w-4 text-[#a855f7]" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{info.contactTypeDescription || contactTypeLabel(info.contactType)}</p>
                    <p className="text-sm font-bold text-white mt-1">{fullAddress}</p>
                    {info.observation && <p className="text-[10px] text-slate-500 mt-1 italic">{info.observation}</p>}
                </div>
            </div>
            <button
                onClick={onDelete}
                disabled={isDeleting}
                className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Excluir endereço"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}
