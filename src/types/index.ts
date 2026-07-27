export interface Character {
  name: string;
  birth_year: string;
  url: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  gender?: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}