import { faEdit, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

import api from '../../../service/api';
import DynamicTable from '../../forms/dynamicTable';
import CustomToast from '../toast/CustomToast';
import { useModal } from './ModalContext';

import styles from './modalCadReceita.module.css';

function ModalCadReceita({ onRefresh }) {
    const { isModalOpen, closeModal } = useModal();
    const [categorias, setCategorias] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [selectedCategorias, setSelectedCategorias] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDynamicTable, setShowDynamicTable] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [idReceita, setIdReceita] = useState(null);
    const refInputThumb = useRef();
    const [toastOptions, setToastOptions] = useState({ show: false })

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

    const resetForm = () => {
        setTitulo('');
        setSelectedCategorias([]);
        setFile(null);
        setSelectedImage(null);
        setIsSubmitting(false);
        setShowDynamicTable(false);
        setSearchTerm('');
        setIdReceita(null);
        setToastOptions({ show: false });
        setCategorias((elements) => {
            elements.forEach(cat => (cat.checked = false));
            return elements;
        })
    };

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

        console.log(Object.fromEntries(formData))
        //TODO: adicionar verificação para os valores
        try {
            const response = await api.post('/receitas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Success:', response.data);
            const { seqId } = response.data;
            setIdReceita(seqId);
            console.log(idReceita);
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
                                    <Form.Group controlId="addThumb" className={`${styles.heycheffButton} text-center`}>
                                        <Form.Label hidden={selectedImage} className={`${styles["input-file"]} text-center w-100 m-0`} style={{ maxWidth: '170px' }}>
                                            <FontAwesomeIcon icon={faImage} className="me-2" />
                                            Adicionar Capa
                                            <Form.Control ref={refInputThumb} type='file' hidden accept='image/*' onChange={handleFileChange} />
                                        </Form.Label>
                                        {selectedImage && (
                                            <div className={styles["image-container"]}>
                                                <img
                                                    src={selectedImage}
                                                    className={`${isSubmitting ? `${styles["image-container"]}` : ''} ${styles.thumb}`}
                                                    alt="Preview"
                                                    onClick={() => (isSubmitting ? null : refInputThumb.current.click())}
                                                />
                                                {!isSubmitting && (
                                                    <div className={styles["edit-icon"]}>
                                                        <FontAwesomeIcon icon={faEdit} onClick={() => refInputThumb.current.click()} />
                                                    </div>
                                                )}
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
                        <Button className='mb-3' variant="warning" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Receita Salva' : 'Salvar Receita'}
                        </Button>
                    </Form>
                    {showDynamicTable &&
                        <DynamicTable
                            idReceita={idReceita}
                            closeModalCadReceita={() => {
                                onRefresh();
                                closeModal();
                                setToastOptions({
                                    show: true,
                                    type: "success",
                                    message: "Parabéns, receita cadastrada com sucesso!",
                                });
                                resetForm();
                            }}
                        />}
                </Modal.Body>
            </Modal>

            <CustomToast
                show={toastOptions?.show}
                onClose={() => setToastOptions({ show: false, })}
                type={toastOptions?.type}
                message={toastOptions?.message}
            />
        </>
    );
}

export default ModalCadReceita;