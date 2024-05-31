import React from 'react';
import { Card } from 'react-bootstrap'; // Importando o componente Card do React-Bootstrap

function ReceitaCard({ receita }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={receita.thumb} alt={receita.titulo} />
      <Card.Body>
        <Card.Title>{receita.titulo}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default ReceitaCard;
