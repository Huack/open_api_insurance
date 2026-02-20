// ─── Enums ───────────────────────────────────────────────

export enum InsuranceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum InsuranceType {
    PRIVATE = 'PRIVATE',
    SUS = 'SUS',
    SELF_PAYMENT = 'SELF_PAYMENT',
}

export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

// ─── Interfaces ──────────────────────────────────────────

export interface LegalEntity {
    corporateName: string;
    commercialName: string;
    legalEntityId: string; // CNPJ
}

export interface Plan {
    id: number;
    description: string;
    status: string;
}

export interface Category {
    id: number;
    description: string;
    status: CategoryStatus;
    accommodation: string;
    plans: Plan[];
}

export interface Insurance {
    id: number;
    description: string;
    status: InsuranceStatus;
    insuranceType: InsuranceType;
    inclusionDate: string;
    ansCode?: string;
    legalEntity: LegalEntity;
    categories?: Category[];
}

// ─── API Response ────────────────────────────────────────

export interface InsuranceApiResponse {
    content: Insurance[];
    totalElements: number;
    totalPages: number;
    number: number; // current page (0-indexed)
    size: number;
}

// ─── Filter Params ───────────────────────────────────────

export interface InsuranceFilters {
    page: number;
    size: number;
    status?: InsuranceStatus | '';
    insuranceType?: InsuranceType | '';
    id?: string;
    ansCode?: string;
}