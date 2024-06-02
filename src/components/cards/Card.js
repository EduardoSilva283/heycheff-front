import React from 'react';
import { Card } from 'react-bootstrap'; 
import { API_URL } from '../../constants/const';

function ReceitaCard({ receita }) {
  const imageUrl = receita.thumb.startsWith('http') ? receita.thumb : `${API_URL}${receita.thumb}`;
  return (
    <Card style={{ width: '400px' }}>
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{receita.titulo}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default ReceitaCard;
