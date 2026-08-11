import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type ApiResponse, type Character } from '../types';

const cacheTTL = import.meta.env.VITE_CACHE_TTL ? parseInt(import.meta.env.VITE_CACHE_TTL, 10) : 60;

export const starWarsApi = createApi({
  reducerPath: 'starWarsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://swapi.py4e.com/api/' }),
  keepUnusedDataFor: cacheTTL,
  tagTypes: ['Character'],
  endpoints: (builder) => ({
    getCharacters: builder.query<ApiResponse, { searchTerm?: string; page?: number }>({
      query: ({ searchTerm = '', page = 1 }) => {
        const queryParams = new URLSearchParams();
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        if (page > 1) {
          queryParams.append('page', page.toString());
        }
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return `people/${query}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ name }) => ({ type: 'Character' as const, id: name })),
              { type: 'Character', id: 'LIST' },
            ]
          : [{ type: 'Character', id: 'LIST' }],
    }),
    getCharacter: builder.query<Character, string>({
      query: (id) => `people/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterQuery } = starWarsApi;