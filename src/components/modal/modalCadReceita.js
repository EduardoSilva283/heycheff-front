import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
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
            //closeModal(); // Fecha o modal após o sucesso
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
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
                    <Button variant="warning" type="submit">
                        Salvar Receita
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>

    )
}
export default ModalCadReceita;