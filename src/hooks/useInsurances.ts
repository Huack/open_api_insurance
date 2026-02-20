import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { InsuranceApiResponse, InsuranceFilters } from '../types/insurance';

async function fetchInsurances(filters: InsuranceFilters): Promise<InsuranceApiResponse> {
    const params: Record<string, string | number> = {
        page: filters.page,
        size: filters.size,
    };

    if (filters.status) params.status = filters.status;
    if (filters.insuranceType) params.insuranceType = filters.insuranceType;
    if (filters.id) params.id = filters.id;
    if (filters.ansCode) params.ansCode = filters.ansCode;

    const { data } = await apiClient.get<InsuranceApiResponse>('/insurances', { params });
    return data;
}

export function useInsurances(filters: InsuranceFilters) {
    return useQuery({
        queryKey: ['insurances', filters],
        queryFn: () => fetchInsurances(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 2,
        retry: 2,
    });
}