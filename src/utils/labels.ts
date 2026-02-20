import { InsuranceType, InsuranceStatus } from '../types/insurance';

export function getInsuranceTypeLabel(type: InsuranceType): string {
    const labels: Record<InsuranceType, string> = {
        [InsuranceType.PRIVATE]: 'Privado',
        [InsuranceType.SUS]: 'SUS',
        [InsuranceType.SELF_PAYMENT]: 'Particular',
    };
    return labels[type] || type;
}

export function getStatusLabel(status: InsuranceStatus): string {
    return status === InsuranceStatus.ACTIVE ? 'Ativo' : 'Inativo';
}
