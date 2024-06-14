import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import api from '../../../service/api';
import ReceitaCard from '../cards/ReceitaCard';
import { useModal } from '../../shared/modal/ModalContext';

function Feed() {
    const [receitas, setReceitas] = useState([]);
    const { openModal } = useModal();

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(`/receitas`);
                setReceitas(response.data);
            } catch (error) {
                console.error('Erro ao buscar receitas:', error);
            }
        })();
    }, []);

    return (<>
        <Container fluid className='mt-4'>
            <Row xs={1} md={2} lg={3} className='g-2'>
                {receitas.map((receita) => (
                    <Col key={receita.id} onClick={() => openModal(receita)}>
                        <ReceitaCard receita={receita} />
                    </Col>
                ))}
            </Row>
        </Container>
    </>);
}

export default Feed;
