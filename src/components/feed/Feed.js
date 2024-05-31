import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../cards/Card'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { API_URL } from '../../constants/const';

function Grid() {
    const [receitas, setReceitas] = useState([]);

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const response = await axios.get(API_URL + '/receitas');
                setReceitas(response.data);
            } catch (error) {
                console.error('Erro ao buscar receitas:', error);
            }
        };

        fetchReceitas();
    }, []);

    return (
        <Row xs={1} md={2} className="g-4">
            {Array.from({ length: 4 }).map((_, idx) => (
                <Col key={idx}>
                    {receitas.map((receita) => (
                        <Card key={receita.id} receita={receita} />
                    ))}
                </Col>
            ))}
        </Row>
    );
}





export default Grid;
