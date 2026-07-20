import { type ApiResponse } from '../types';

export const fetchCharacters = async (searchTerm: string = ''): Promise<ApiResponse> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const response = await fetch(`https://swapi.dev/api/people/${query}`);
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  
  return response.json();
};