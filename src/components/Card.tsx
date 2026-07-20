import React from 'react';
import { type Character } from '../types';

interface Props {
  character: Character;
}

class Card extends React.Component<Props> {
  render() {
    const { character } = this.props;
    return (
      <div style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
        <strong>Name:</strong> {character.name} | <strong>Birth Year:</strong> {character.birth_year}
      </div>
    );
  }
}

export default Card;