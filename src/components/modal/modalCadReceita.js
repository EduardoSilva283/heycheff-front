import Modal from 'react-bootstrap/Modal';
import { Form, Button, Toast, ToastContainer, Row, Col, InputGroup } from 'react-bootstrap';
import { useModal } from './ModalContext';
import { useEffect, useState } from 'react';
import { API_URL } from '../../constants/const';
import axios from 'axios';
import './modalCadReceita.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import AddDeleteTableRows from '../dinamicForms/AddDeleteTableRows';

function ModalCadReceita() {
    const { isModalOpen, closeModal } = useModal();
    const [categorias, setCategorias] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [selectedCategorias, setSelectedCategorias] = useState([]);
    const [file, setFile] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDynamicTable, setShowDynamicTable] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    //const [showModalStep, setShowModalStep] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const categorias = await axios.get(API_URL + '/tags')
                setCategorias(categorias.data);
            }
            catch (err) {
                console.log(err)
            }
        })();
    }, []);

    const handleCategoriaChange = (e, categoria) => {
        const { checked } = e.target;
        setSelectedCategorias((itemCategoria) => {
            if (checked) {
                return Array.from(new Set([...itemCategoria, categoria]));
            }
            return itemCategoria.filter(a => a.id !== categoria.id);
        })
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

        console.log(Object.fromEntries(formData))
        //TODO: adicionar verificação para os valores
        try {
            const response = await axios.post(API_URL + '/receitas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Success:', response.data);
            setShowToast(true); // Exibir o Toast de sucesso
            setIsSubmitting(true);
            setShowDynamicTable(true)
            //setShowModalStep(true)
            //closeModal(); // Fecha o modal após o sucesso
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredCategorias = categorias.filter(categoria =>
        categoria.tag.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

    return (
        <>
            <Modal show={isModalOpen} onHide={closeModal} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Receita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Título da Receita</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Categorias</InputGroup.Text>
                            <Form.Control as="div">
                                {filteredCategorias.map((c) => (
                                    <Form.Check
                                        className={'check' + c.id}
                                        id={'tag' + c.id}
                                        key={c.id}
                                        inline
                                        label={c.tag}
                                        value={c.tag}
                                        type="checkbox"
                                        onChange={(e) => handleCategoriaChange(e, c)}
                                    />
                                ))}
                            </Form.Control>
                            <InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Pesquisar"
                                    onChange={(e) => {
                                        const {value} = e.target;
                                        setSearchTerm(value);  
                                    }}
                                />
                            </InputGroup.Text>
                        </InputGroup>
                        <Form.Group controlId="formFile" className="heycheffButton">
                            <Form.Label className='input-file'>
                                <FontAwesomeIcon icon={faVideo} className="me-2" />
                                Adicionar Vídeo
                            </Form.Label>
                            <Form.Control type='file' hidden accept='video/*' onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="warning" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Receita Salva' : 'Salvar Receita'}
                        </Button>
                        <p></p>
                    </Form>

                    {<AddDeleteTableRows />}

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

export const CheckCategorias = (categorias, handle) => {
    return <>
        {categorias.map((c) => (
            <Form.Check
                id={'tag' + c.id}
                key={c.id}
                inline
                label={c.tag}
                value={c.tag}
                type="checkbox"
                onChange={(e) => handle(e, c)}
            />
        ))}
    </>
}