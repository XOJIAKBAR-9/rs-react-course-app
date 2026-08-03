import { type ApiResponse, type Character } from '../types';

export const fetchCharacters = async (searchTerm: string = '', page: number = 1): Promise<ApiResponse> => {
  const queryParams = new URLSearchParams();
  if (searchTerm) {
    queryParams.append('search', searchTerm);
  }
  if (page > 1) {
    queryParams.append('page', page.toString());
  }
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await fetch(`https://swapi.py4e.com/api/people/${query}`);
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  
  return response.json();
};

export const fetchCharacter = async (id: string): Promise<Character> => {
  const response = await fetch(`https://swapi.py4e.com/api/people/${id}/`);
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  
  return response.json();
};