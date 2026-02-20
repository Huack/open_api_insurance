// ─── Enums ───────────────────────────────────────────────

export enum InsuranceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum InsuranceType {
    SELF_PAYMENT = 'SELF_PAYMENT',
    PRIVATE = 'PRIVATE',
    SUS = 'SUS',
    PRO_BONOPHILANTHROPIC = 'PRO_BONOPHILANTHROPIC',
    OWN = 'OWN',
    SELFMANAGEMENT = 'SELFMANAGEMENT',
    OPERATING_COST = 'OPERATING_COST',
    EXCHANGE = 'EXCHANGE',
    PREPAYMENT = 'PREPAYMENT',
    IAMSPE = 'IAMSPE',
    PUBLIC = 'PUBLIC',
    MEDICARE = 'MEDICARE',
    DVA = 'DVA',
    HEALTH_INSURANCE = 'HEALTH_INSURANCE',
    TRADE_INSURANCE = 'TRADE_INSURANCE',
    ANNUITY_INSURANCE = 'ANNUITY_INSURANCE',
    CARE_INSURANCE = 'CARE_INSURANCE',
    WORKER_S_COMPENSATION_INSURANCE = 'WORKER_S_COMPENSATION_INSURANCE',
}

export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

// ─── Interfaces ──────────────────────────────────────────

export interface AccommodationType {
    accommodationTypeId: number;
    accommodationTypeDescription: string;
    accommodationLevel: number;
    status: string;
}

export interface InsuranceCategoryPlan {
    sequenceId: number;
    establishmentId: string;
    planId: string;
    planDescription: string;
    updateDate: string;
    expirationDate: string;
    initialDate: string;
    status: string;
    ansPlanCode: string;
}

export interface InsuranceCategory {
    categoryId: string;
    categoryDescription: string;
    status: CategoryStatus;
    accommodation: AccommodationType;
    insuranceCategoryPlan: InsuranceCategoryPlan[];
}

export interface InsurancePlan {
    insurancePlanId: string;
    planDescription: string;
    status: string;
    ansPlanCode: string;
}

export interface Insurance {
    insuranceId: number;
    insuranceDescription: string;
    status: InsuranceStatus;
    ansCode: string;
    insuranceType: InsuranceType;
    inclusionDate: string;
    cancellationDate?: string;
    legalEntityCode: string;
    corporateName: string;
    commercialName: string;
    personType: string;
    categories: InsuranceCategory[];
    plans: InsurancePlan[];
}

// ─── API Response ────────────────────────────────────────

export interface InsuranceApiResponse {
    results: Insurance[];
    total: number;
}

// ─── Filter Params ───────────────────────────────────────

export interface InsuranceFilters {
    page: number;
    size: number;
    status?: InsuranceStatus | '';
    insuranceType?: InsuranceType | '';
    insuranceId?: string;
    ansCode?: string;
}