import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import api from '../../../service/api';
import ReceitaCard from '../cards/ReceitaCard';

function Feed() {
    const [receitas, setReceitas] = useState([]);

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const response = await api.get(`/receitas`);
                setReceitas(response.data);
            } catch (error) {
                console.error('Erro ao buscar receitas:', error);
            }
        };

        fetchReceitas();
    }, []);

    return (
        <Container fluid className='mt-4'>
            <Row xs={1} md={2} lg={3} className='g-2'>
                {receitas.map((receita) => (
                    <Col key={receita.id}>
                        <ReceitaCard receita={receita} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Feed;
