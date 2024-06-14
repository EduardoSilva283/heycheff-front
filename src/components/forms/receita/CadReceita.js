import { faEdit, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import api from '../../../service/api';
import CustomToast from '../../shared/toast/CustomToast';

import DynamicTable from '../step/DynamicTable';
import './cadReceita.css';
import { ModalProvider } from '../../shared/modal/ModalContext';
import CadStepModal from '../step/CadStepModal';

function CadReceita() {
    const [categorias, setCategorias] = useState([]);
    const [selectedCategorias, setSelectedCategorias] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDynamicTable, setShowDynamicTable] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [idReceita, setIdReceita] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const refInputThumb = useRef();

    useEffect(() => {
        (async () => {
            try {
                const categorias = await api.get('/tags');
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

        if (!titulo || !file || selectedCategorias.length === 0) {
            setShowErrorToast(true); // Exibir o Toast de erro
            return;
        }
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('tags', JSON.stringify(selectedCategorias));
        formData.append('thumb', file);

        //TODO: adicionar verificação para os valores
        try {
            const response = await api.post('/receitas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { seqId } = response.data;
            setIdReceita(seqId);
            setShowSuccessToast(true); // Exibir o Toast de sucesso
            setIsSubmitting(true);
            setShowDynamicTable(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredCategorias = categorias.filter(categoria =>
        categoria.tag.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <>
            <Container>
                <h1 className='mt-4 mb-4'>Cadastrar Receita</h1>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col lg="2" className='mb-3'>
                            <div className='d-flex align-items-center justify-content-center border rounded p-2 ps-3 pe-3 w-100 h-100'>
                                <Form.Group controlId="addThumb" className="heycheffButton text-center">
                                    <Form.Label hidden={selectedImage} className='input-file text-center w-100 m-0' style={{ maxWidth: '170px' }}>
                                        <FontAwesomeIcon icon={faImage} className="me-2" />
                                        Adicionar Capa
                                        <Form.Control ref={refInputThumb} type='file' hidden accept='image/*' onChange={handleFileChange} />
                                    </Form.Label>
                                    {selectedImage && (
                                        <div className='image-container'>
                                            <img
                                                src={selectedImage}
                                                className={`${isSubmitting ? 'disable-opacity' : ''} thumb`}
                                                alt="Preview"
                                                onClick={() => (isSubmitting ? null : refInputThumb.current.click())}
                                            />
                                            {!isSubmitting && (
                                                <div className="edit-icon">
                                                    <FontAwesomeIcon icon={faEdit} onClick={() => refInputThumb.current.click()} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        </Col>
                        <Col lg="10">
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Título da Receita</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3 categories">
                                <InputGroup.Text>Categorias</InputGroup.Text>
                                <Form.Control as="div" className='row'>
                                    {filteredCategorias.map((c) => (
                                        <Form.Check
                                            className='col-xl-2 col-lg-3 col-md-4 col-sm-5'
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
                                <InputGroup.Text className='search-bar'>
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
                    <Button className='mt-3 mb-3' variant="warning" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Receita Salva' : 'Salvar Receita'}
                    </Button>
                </Form>

                <ModalProvider>
                    {showDynamicTable && <DynamicTable idReceita={idReceita} />}
                    <CadStepModal />
                </ModalProvider>
            </Container>

            <CustomToast
                show={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                type="success"
                message="Receita cadastrada com sucesso!"
            />

            <CustomToast
                show={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                type="error"
                message="Por favor, preencha todos os campos obrigatórios."
            />
        </>
    );
}

export default CadReceita;