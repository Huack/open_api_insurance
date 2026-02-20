import { InsuranceType, InsuranceStatus } from '../types/insurance';

const TYPE_LABELS: Record<string, string> = {
    [InsuranceType.SELF_PAYMENT]: 'Particular',
    [InsuranceType.PRIVATE]: 'Privado',
    [InsuranceType.SUS]: 'SUS',
    [InsuranceType.PRO_BONOPHILANTHROPIC]: 'Filantrópico',
    [InsuranceType.OWN]: 'Próprio',
    [InsuranceType.SELFMANAGEMENT]: 'Autogestão',
    [InsuranceType.OPERATING_COST]: 'Custo Operacional',
    [InsuranceType.EXCHANGE]: 'Intercâmbio',
    [InsuranceType.PREPAYMENT]: 'Pré-pagamento',
    [InsuranceType.IAMSPE]: 'IAMSPE',
    [InsuranceType.PUBLIC]: 'Público',
    [InsuranceType.MEDICARE]: 'Medicare',
    [InsuranceType.DVA]: 'DVA',
    [InsuranceType.HEALTH_INSURANCE]: 'Seguro Saúde',
    [InsuranceType.TRADE_INSURANCE]: 'Seguro Comercial',
    [InsuranceType.ANNUITY_INSURANCE]: 'Seguro Anuidade',
    [InsuranceType.CARE_INSURANCE]: 'Seguro Cuidados',
    [InsuranceType.WORKER_S_COMPENSATION_INSURANCE]: 'Seg. Trabalhador',
};

export function getInsuranceTypeLabel(type: string): string {
    return TYPE_LABELS[type] || type;
}

export function getStatusLabel(status: InsuranceStatus | string): string {
    return status === InsuranceStatus.ACTIVE ? 'Ativo' : 'Inativo';
}
