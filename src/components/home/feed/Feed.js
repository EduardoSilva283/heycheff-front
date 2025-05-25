import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import InfiniteScroll from 'react-infinite-scroller';

import api from '../../../service/api';
import { useModal } from '../../shared/modal/ModalContext';
import ReceitaCard from '../cards/ReceitaCard';

function Feed() {
    const [receitas, setReceitas] = useState([]);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { openModal } = useModal();

    const pageSize = 6;
    const total0 = totalReceitas === 0;

    async function loadReceipt() {
        try {
            const response = await api.get('/receitas', {
                params: {
                    pageNum,
                    pageSize
                }
            });

            if (total0)
                setTotalReceitas(response.data.count);

            setReceitas(prev => [...prev, ...response.data.items]);
            setPageNum(prev => prev + 1);

            if (!total0 && totalReceitas === receitas.length)
                setHasMore(false);
            if (response.data.items.length < pageSize) setHasMore(false);

        } catch (error) {
            console.error('Erro ao buscar receitas:', error);
        }
    }

    return (
        <Container fluid className='d-flex flex-column mt-4 mb-4'>
            <InfiniteScroll
                loadMore={loadReceipt}
                hasMore={hasMore}
                useWindow={false}
                loader={<Spinner
                    key={pageNum}
                    className='d-flex mt-3 mx-auto'
                    animation='border'
                    variant='warning' />}>
                <Row xs={1} md={2} lg={3} className='g-2 align-items-center'>
                    {receitas.map((receita) => (
                        <Col key={receita.id} onClick={() => openModal(receita)}>
                            <ReceitaCard receita={receita} />
                        </Col>
                    ))}
                </Row>
            </InfiniteScroll>
            {!total0 && totalReceitas === receitas.length
                ? <span className='text-muted mt-3 mx-auto'>Sem mais receitas</span>
                : ''}
        </Container>
    );
}

export default Feed;
