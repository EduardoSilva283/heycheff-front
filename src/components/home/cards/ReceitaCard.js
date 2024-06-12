import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

import { displayMedia } from '../../../service/media';

function ReceitaCard({ receita }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => setImageUrl(await displayMedia(receita.thumb));
    fetchImageUrl();
  }, [receita.thumb]);

  return (
    <Card>
      <Card.Img variant="top" src={imageUrl} alt={receita.titulo}
        onChange={() => URL.revokeObjectURL(imageUrl)} />
      <Card.Body>
        <Card.Title variant="bottom">{receita.titulo}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default ReceitaCard;
