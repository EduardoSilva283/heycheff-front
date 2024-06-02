import React from 'react';
import { Card } from 'react-bootstrap';
import { API_URL_MEDIA } from '../../constants/const';
import './ReceitaCard.css'


function ReceitaCard({ receita }) {
  const imageUrl = `${API_URL_MEDIA}${receita.thumb}`;

  return (
    <Card className="receita-card">
      <Card.Img variant="top" src={imageUrl} alt={receita.titulo} />
      <Card.Body>
        <Card.Title variant="bottom">{receita.titulo}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default ReceitaCard;
