import { type ApiResponse, type Character } from '../types';

export async function getCharacters(searchTerm: string = '', page: number = 1): Promise<ApiResponse> {
  const queryParams = new URLSearchParams();
  if (searchTerm) {
    queryParams.append('search', searchTerm);
  }
  if (page > 1) {
    queryParams.append('page', page.toString());
  }
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const res = await fetch(`https://swapi.py4e.com/api/people/${query}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}

export async function getCharacter(id: string): Promise<Character> {
  const res = await fetch(`https://swapi.py4e.com/api/people/${id}/`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}
