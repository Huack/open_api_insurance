import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { AdditionalInformation, AdditionalInfoRequest } from '../types/naturalPerson';

// GET /api/natural-person/{code}/additional-information
async function fetchAdditionalInfo(personCode: string): Promise<AdditionalInformation[]> {
    const { data } = await apiClient.get<AdditionalInformation[]>(
        `/natural-person/${personCode}/additional-information`
    );
    return Array.isArray(data) ? data : [];
}

export function useAdditionalInfo(personCode: string | undefined) {
    return useQuery({
        queryKey: ['additional-info', personCode],
        queryFn: () => fetchAdditionalInfo(personCode!),
        enabled: !!personCode, // Só busca se tiver um código
        staleTime: 1000 * 60 * 3, // 3 min cache
        retry: 1,
    });
}

// POST /api/natural-person/{code}/additional-information/{contactType}
async function createAdditionalInfo(
    personCode: string,
    contactType: string,
    body: AdditionalInfoRequest
): Promise<void> {
    await apiClient.post(`/natural-person/${personCode}/additional-information/${contactType}`, body);
}

// PUT /api/natural-person/{code}/additional-information/{contactType}
async function updateAdditionalInfo(
    personCode: string,
    contactType: string,
    body: AdditionalInfoRequest
): Promise<void> {
    await apiClient.put(`/natural-person/${personCode}/additional-information/${contactType}`, body);
}

// DELETE /api/natural-person/{code}/additional-information/{contactType}
async function deleteAdditionalInfo(
    personCode: string,
    contactType: string
): Promise<void> {
    await apiClient.delete(`/natural-person/${personCode}/additional-information/${contactType}`);
}

// ─── Mutations ───────────────────────────────────────────

export function useCreateAdditionalInfo(personCode: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ contactType, body }: { contactType: string; body: AdditionalInfoRequest }) =>
            createAdditionalInfo(personCode, contactType, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['additional-info', personCode] });
        },
    });
}

export function useUpdateAdditionalInfo(personCode: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ contactType, body }: { contactType: string; body: AdditionalInfoRequest }) =>
            updateAdditionalInfo(personCode, contactType, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['additional-info', personCode] });
        },
    });
}

export function useDeleteAdditionalInfo(personCode: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ contactType }: { contactType: string }) =>
            deleteAdditionalInfo(personCode, contactType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['additional-info', personCode] });
        },
    });
}
