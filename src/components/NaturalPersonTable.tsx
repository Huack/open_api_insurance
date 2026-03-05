import type { NaturalPerson } from '../types/naturalPerson';

function formatCPF(cpf?: string) {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatDate(dateString?: string) {
    if (!dateString) return '---';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    } catch {
        return dateString;
    }
}

interface NaturalPersonTableProps {
    data: NaturalPerson[];
    onSelect: (person: NaturalPerson) => void;
    page: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function NaturalPersonTable({ data, onSelect, page, totalItems, pageSize, onPageChange }: NaturalPersonTableProps) {
    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Toolbar Header */}
            <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center space-x-4">
                    <h2 className="font-bold text-slate-900 dark:text-white">Lista de Pacientes / Beneficiários</h2>
                    <span className="px-2 py-0.5 rounded-md bg-[#00d4ff]/20 text-[#00d4ff] text-[10px] font-bold tracking-widest">MASTER DATA</span>
                    <span className="text-xs text-slate-500 font-medium">{data.length} registros nesta página</span>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                        <span className="material-symbols-rounded text-lg">download</span>
                        <span>EXPORTAR CSV</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold transition-all glow-accent">
                        <span className="material-symbols-rounded text-lg">person_add</span>
                        <span>NOVO PACIENTE</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Table Area */}
            <div className="overflow-x-auto flex-grow bg-slate-50/50 dark:bg-[#0f172a]/30">
                <table className="w-full text-left border-collapse table-fixed lg:table-auto">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-[#0f172a]/60">
                            <th className="px-6 py-4 w-24 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Código</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Paciente</th>
                            <th className="px-6 py-4 w-36 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">CPF</th>
                            <th className="px-6 py-4 w-36 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Cartão SUS</th>
                            <th className="px-6 py-4 w-32 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Nascimento</th>
                            <th className="px-6 py-4 w-32 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Tipo Sanguíneo</th>
                            <th className="px-6 py-4 w-24 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1e293b]">
                        {data.map((person) => (
                            <tr
                                key={person.naturalPersonCode}
                                className="hover:bg-slate-50/50 dark:hover:bg-[#00d4ff]/5 transition-colors group cursor-pointer"
                                onClick={() => onSelect(person)}
                            >
                                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                    #{person.naturalPersonCode}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#00d4ff] transition-colors">
                                            {person.personName}
                                        </span>
                                        <span className="text-[10px] text-slate-500 uppercase">
                                            {person.gender || 'Não Informado'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                        {formatCPF(person.taxpayerId) || '---'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-mono text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
                                        {person.susCard || 'Não Cadastrado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {formatDate(person.birthDate)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <BloodTypeBadge blood={person.blood} rh={person.bloodRhFactor} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-1">
                                        <button className="p-1.5 text-slate-400 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-lg transition-all" aria-label="Visualizar">
                                            <span className="material-symbols-rounded text-lg">visibility</span>
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-lg transition-all" aria-label="Editar">
                                            <span className="material-symbols-rounded text-lg">edit</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <span className="material-symbols-rounded text-4xl mb-3 opacity-50">person_off</span>
                        <p>Nenhum paciente encontrado.</p>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-[#1e293b] flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="flex items-center space-x-4">
                    <p className="text-xs text-slate-500">
                        Mostrando <span className="font-bold text-slate-900 dark:text-white">Página {page}</span> (Total na tela: {data.length})
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onPageChange(page > 1 ? page - 1 : 1)}
                        disabled={page === 1}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <span className="material-symbols-rounded">chevron_left</span>
                    </button>
                    <span className="text-xs font-bold text-slate-400">Página {page}</span>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={data.length < pageSize}
                        className="p-2 text-slate-500 hover:text-[#00d4ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <span className="material-symbols-rounded">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function BloodTypeBadge({ blood, rh }: { blood?: string; rh?: string }) {
    if (!blood) return <span className="text-xs text-slate-600">---</span>;
    const rhSign = rh === 'POSITIVE' ? '+' : rh === 'NEGATIVE' ? '-' : '';
    const display = `${blood}${rhSign}`;
    return (
        <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-bold">
            {display}
        </span>
    );
}
