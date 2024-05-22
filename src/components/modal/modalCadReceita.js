import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useModal } from './ModalContext';
import { useEffect, useState } from 'react';


function ModalCadReceita() {
    const { isModalOpen, closeModal } = useModal();
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            const categorias = ['Japão', 'China'];
            setCategorias(categorias);
        }
        fetchAll();
    }, []);


    return (
        <Modal show={isModalOpen} onHide={closeModal} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>Cadastrar Receita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Titulo da Receita</Form.Label>
                        <Form.Control type="text" />
                        <Form.Label>Escolha as Categorias:</Form.Label>
                        {
                            categorias.map(c => {
                                return (
                                    <Form.Check
                                        inline
                                        label= {c}
                                        name="group1"
                                        type='checkbox'
                                    />
                                )
                            })
                        }
                        <Form.Label>Selecione a Thumb</Form.Label>
                        <Form.Control type="file" />

                        <Button variant='warning'>Salvar Receita</Button>

                    </Form.Group>
                </Form>

            </Modal.Body>
        </Modal>

    )
}
export default ModalCadReceita;