import Modal from 'react-bootstrap/Modal';
import { Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useModal } from './ModalContext';
import { useEffect, useState } from 'react';
import { API_URL } from '../../constants/const';
import axios from 'axios';


function ModalCadReceita() {
    const { isModalOpen, closeModal } = useModal();
    const [categorias, setCategorias] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [selectedCategorias, setSelectedCategorias] = useState([]);
    const [file, setFile] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const categorias = await axios.get(API_URL + '/tags')
                setCategorias(categorias.data);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchAll();

    }, []);

    const handleCategoriaChange = (e, categoria) => {

        const { checked } = e.target;

        setSelectedCategorias((prev) => {

            if (checked) {

                return [...prev, categoria];

            } else {

                return prev.filter((c) => c.id !== categoria.id);
            }
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('tags', JSON.stringify(selectedCategorias));
        formData.append('thumb', file);


        try {
            const response = await axios.post(API_URL + '/receitas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Success:', response.data);
            setShowToast(true); // Exibir o Toast de sucesso
            setIsSubmitting(true);
            //closeModal(); // Fecha o modal após o sucesso
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Modal show={isModalOpen} onHide={closeModal} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Receita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formTitulo">
                            <Form.Label>Título da Receita</Form.Label>
                            <Form.Control
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCategorias">
                            <Form.Label>Escolha as Categorias:</Form.Label>
                            {categorias.map((c) => (
                                <Form.Check
                                    key={c.id}
                                    inline
                                    label={c.tag}
                                    value={c.tag}
                                    name="categorias"
                                    type="checkbox"
                                    onChange={(e) => handleCategoriaChange(e, c)}
                                />
                            ))}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formThumb">
                            <Form.Label>Selecione a Thumb</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="warning" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Receita Salva' : 'Salvar Receita'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Sucesso</strong>
                    </Toast.Header>
                    <Toast.Body>Receita cadastrada com sucesso!</Toast.Body>
                </Toast>
            </ToastContainer>
        </>


    );
}
export default ModalCadReceita;