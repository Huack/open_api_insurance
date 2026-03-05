// Tipos gerados com base no Swagger Tasy (Natural Person API)

export enum Gender {
    FEMALE = 'FEMALE',
    MALE = 'MALE',
    UNDETERMINED = 'UNDETERMINED',
    DIVERSE = 'DIVERSE',
}

export enum BloodType {
    A = 'A',
    AB = 'AB',
    B = 'B',
    O = 'O',
}

export enum MaritalStatus {
    SINGLE = 'SINGLE',
    MARRIED = 'MARRIED',
    DIVORCED = 'DIVORCED',
    LEGALLY_SEPARATED = 'LEGALLY_SEPARATED',
    WIDOW = 'WIDOW',
    SEPARATED = 'SEPARATED',
    CIVIL_UNION = 'CIVIL_UNION',
    OTHERS = 'OTHERS',
}

export interface PersonNameEntity {
    firstLastName?: string;
    firstName?: string;
    lastUpdate?: number;
    lastUpdatedBy?: string;
    middleName?: string;
    secondLastName?: string;
}

export interface NaturalPerson {
    naturalPersonCode: string;
    personName: string; // Full name usually here
    firstName?: string;
    lastName?: string;
    taxpayerId?: string; // CPF
    civilId?: string; // RG
    birthDate?: string; // YYYY-MM-DD
    gender?: Gender;
    blood?: BloodType;
    bloodRhFactor?: string;
    bloodWeakRh?: string;
    maritalStatus?: MaritalStatus;
    susCard?: string; // Cartão SUS
    mobilePhone?: string;
    dateOfDeath?: string;
    height?: number;
    weight?: number;
    weightBirth?: number;
    personType?: string;
    medicalRecord?: number;
    personNameInfo?: PersonNameEntity;
    lastUpdate?: number;
    lastUpdatedBy?: string;
}

export interface NaturalPersonFilters {
    'taxpayer-id'?: string;
    'name'?: string;
    'civil-id'?: string;
    'medical-record'?: number;
    'page'?: number;
    'size'?: number;
}

// ─── Additional Information (Contatos e Endereços) ───────

export enum ContactType {
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    MOBILE_PHONE = 'MOBILE_PHONE',
    COMMERCIAL_PHONE = 'COMMERCIAL_PHONE',
    FAX = 'FAX',
    RESIDENTIAL_ADDRESS = 'RESIDENTIAL_ADDRESS',
    COMMERCIAL_ADDRESS = 'COMMERCIAL_ADDRESS',
    BILLING_ADDRESS = 'BILLING_ADDRESS',
    OTHER = 'OTHER',
}

export interface AdditionalInformation {
    contactType: string;
    contactTypeDescription?: string;
    typeAdditionalId?: string;
    typeAdditionalDescription?: string;
    value?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    cityId?: number;
    state?: string;
    stateId?: number;
    zipCode?: string;
    country?: string;
    countryId?: number;
    observation?: string;
    lastUpdate?: number;
    lastUpdatedBy?: string;
}

export interface AdditionalInfoRequest {
    value: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    cityId?: number;
    state?: string;
    stateId?: number;
    zipCode?: string;
    country?: string;
    countryId?: number;
    observation?: string;
}
