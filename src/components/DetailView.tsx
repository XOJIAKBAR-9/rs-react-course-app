import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetCharacterQuery } from '../services/api';

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { data: character, error: apiError, isFetching: isLoading } = useGetCharacterQuery(id as string, {
    skip: !id,
  });

  let error: string | null = null;
  if (apiError) {
    if ('status' in apiError) {
      error = `Server error: ${apiError.status}`;
    } else {
      error = apiError.message || 'Unknown error';
    }
  }

  const handleClose = () => {
    // Navigate back to the home page but preserve search params
    navigate({
      pathname: '/',
      search: searchParams.toString(),
    });
  };

  return (
    <div style={{ padding: '20px', borderLeft: '2px solid #ccc', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Details</h3>
        <button onClick={handleClose} style={{ padding: '5px 10px', cursor: 'pointer' }}>Close</button>
      </div>

      {isLoading && <div>Loading details... ⏳</div>}
      
      {!isLoading && error && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</div>
      )}

      {!isLoading && character && !error && (
        <div>
          <h4>{character.name}</h4>
          <p><strong>Birth Year:</strong> {character.birth_year}</p>
          <p><strong>Gender:</strong> {character.gender}</p>
          <p><strong>Height:</strong> {character.height} cm</p>
          <p><strong>Mass:</strong> {character.mass} kg</p>
          <p><strong>Hair Color:</strong> {character.hair_color}</p>
          <p><strong>Eye Color:</strong> {character.eye_color}</p>
        </div>
      )}
    </div>
  );
};

export default DetailView;
