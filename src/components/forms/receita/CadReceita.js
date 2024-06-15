import { faEdit, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row, ToggleButton } from 'react-bootstrap';

import api from '../../../service/api';
import { ModalProvider } from '../../shared/modal/ModalContext';
import CustomToast from '../../shared/toast/CustomToast';
import CadStepModal from '../step/CadStepModal';
import DynamicTable from '../step/DynamicTable';

import './cadReceita.css';

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
    const [toastOptions, setToastOptions] = useState({ show: false })
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
        if (!isSubmitting) {
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
        }
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
            setToastOptions({
                show: true,
                type: "error",
                message: "Por favor, preencha todos os campos obrigatórios.",
            });
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
            setToastOptions({
                show: true,
                type: "success",
                message: "Receita cadastrada com sucesso!",
            });
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
        <Container className='mb-4 overflow-hidden'>
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
                            <Form.Control as='div' size='sm' className='row'>
                                {filteredCategorias.map((c) => (
                                    <ToggleButton
                                        className='m-0 p-1 col-xxl-2 col-lg-3 col-md-4 col-sm-6'
                                        id={c.id}
                                        type='checkbox'
                                        key={'tag-' + c.id}
                                        variant='outline-warning'
                                        checked={c.checked}
                                        value={c.tag}
                                        onChange={(e) => handleCategoriaChange(e, c)}
                                    >
                                        {c.tag}
                                    </ToggleButton>
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
                <CadStepModal idReceita={idReceita} />
            </ModalProvider>

            <CustomToast
                show={toastOptions?.show}
                onClose={() => setToastOptions({ show: false, })}
                type={toastOptions?.type}
                message={toastOptions?.message}
            />
        </Container>
    );
}

export default CadReceita;