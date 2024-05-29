import { faImage, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Button, Form, InputGroup, Row, Col, Toast, ToastContainer, Container } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { API_URL } from '../../constants/const';
import { useModal } from './ModalContext';
import './modalCadReceita.css';
import DynamicTable from '../dinamicForms/dynamicTable';
import { height } from '@fortawesome/free-brands-svg-icons/fa42Group';

function ModalCadReceita() {
    const { isModalOpen, closeModal } = useModal();
    const [categorias, setCategorias] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [selectedCategorias, setSelectedCategorias] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDynamicTable, setShowDynamicTable] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModalStep, setShowModalStep] = useState(false);
    const refInputThumb = useRef();

    useEffect(() => {
        (async () => {
            try {
                const categorias = await axios.get(API_URL + '/tags');
                categorias.data.forEach(element => {
                    element.checked = false;
                });
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
        setCategorias((elements) => {
            const categoriaFind = elements.find(a => a.id === categoria.id);
            categoriaFind.checked = checked;
            return elements;
        })
    };

    const handleFileChange = (e) => {
        const arquivo = e.target.files[0];
        setFile(e.target.files[0]);
        if (arquivo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(arquivo);
        }
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
            setShowDynamicTable(true);
            setShowModalStep(true);
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
                        <Row>
                            <Col className='mb-3'>
                                <div className='d-flex align-items-center justify-content-center border rounded p-2 ps-3 pe-3 w-100 h-100'>
                                    <Form.Group controlId="formFile" className="heycheffButton text-center">
                                        <Form.Label hidden={selectedImage} className='input-file text-center w-100 m-0' style={{ maxWidth: '170px' }}>
                                            <FontAwesomeIcon icon={faImage} className="me-2" />
                                            Adicionar Capa
                                            <Form.Control ref={refInputThumb} type='file' hidden accept='image/*' onChange={handleFileChange} />
                                        </Form.Label>
                                        {selectedImage && (
                                            <div className='image-container'>
                                                <img
                                                    src={selectedImage}
                                                    className='thumb'
                                                    alt="Preview"
                                                    onClick={() => refInputThumb.current.click()}
                                                />
                                                <div className="edit-icon">
                                                    <FontAwesomeIcon icon={faEdit} onClick={() => refInputThumb.current.click()} />
                                                </div>
                                            </div>
                                        )}
                                    </Form.Group>
                                </div>
                            </Col>
                            <Col md="12" lg="10">
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Título da Receita</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-lg-0 mb-3">
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
                                                checked={c.checked}
                                                onChange={(e) => handleCategoriaChange(e, c)}
                                            />
                                        ))}
                                    </Form.Control>
                                    <InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Pesquisar"
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setSearchTerm(value);
                                            }}
                                        />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Button variant="warning" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Receita Salva' : 'Salvar Receita'}
                        </Button>
                    </Form>
                    {showDynamicTable && <DynamicTable />}
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