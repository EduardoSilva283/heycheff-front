import { Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import AddDeleteTableRows from '../dinamicForms/AddDeleteTableRows';
import { useModal } from './ModalContext';
import './modalCadReceita.css';

function ModalCadStep() {
    const { showModalStep, closeModal } = useModal();

    return (
        <>
            <Modal show={showModalStep} onHide={closeModal} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Step</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {<AddDeleteTableRows />}
                    <Form>
                        <Form.Group className="mb-3" controlId="formTitulo">
                            <Form.Control type="file" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTitulo">
                            <Form.Label>Título da Receita</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalCadStep;