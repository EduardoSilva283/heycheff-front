import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReceitaCard from '../cards/ReceitaCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

const API_URL = 'http://localhost:6015';

function Grid() {
    const [receitas, setReceitas] = useState([]);

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const response = await axios.get(`${API_URL}/heycheff/receitas`);
                setReceitas(response.data);
            } catch (error) {
                console.error('Erro ao buscar receitas:', error);
            }
        };

        fetchReceitas();
    }, []);

    return (
        <Container fluid style={{marginTop: '10px'}}>
            <Row xs={1} md={4} className="g-2">
                {receitas.map((receita) => (
                    <Col key={receita.id}>
                        <ReceitaCard receita={receita} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Grid;
