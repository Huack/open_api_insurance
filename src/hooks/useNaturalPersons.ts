import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { NaturalPerson, NaturalPersonFilters } from '../types/naturalPerson';

// Definindo a interface baseada na resposta paginada que assumimos.
// Se a Tasy retornar um array direto, o axios retornaria os dados como T[].
// Pelo padrão, vamos assumir que pode ser um array direto.
export type NaturalPersonApiResponse = NaturalPerson[];

async function fetchNaturalPersons(filters: NaturalPersonFilters): Promise<NaturalPersonApiResponse> {
    const params: Record<string, string | number> = {
        page: filters.page || 1,
        // Usar size alto por padrão ou o fornecido
        size: filters.size || 50,
    };

    if (filters['taxpayer-id']) params['taxpayer-id'] = filters['taxpayer-id'];
    if (filters.name) params.name = filters.name;
    if (filters['civil-id']) params['civil-id'] = filters['civil-id'];
    if (filters['medical-record']) params['medical-record'] = filters['medical-record'];

    const { data } = await apiClient.get<NaturalPersonApiResponse>('/natural-person', { params });
    // Alguns endpoints da Sensedia Tasy retornam o array diretamente.
    // Se vier embrulhado, teríamos que adaptar, mas o tipo assumido é o array de NaturalPerson.
    return data;
}

export function useNaturalPersons(filters: NaturalPersonFilters) {
    return useQuery({
        queryKey: ['natural-persons', filters],
        queryFn: () => fetchNaturalPersons(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
        retry: 2,
    });
}
