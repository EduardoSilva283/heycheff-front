import { useEffect, useState } from "react";
import { Accordion, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

import api from "../../../service/api";
import { displayMedia, getBlobMedia } from "../../../service/media";
import CustomToast from "../toast/CustomToast";
import { useModal } from "./ModalContext";
import styles from "./modalReviewReceita.module.css";

function ModalReviewReceita() {
    const { isModalOpen, closeModal, modalData } = useModal();
    const [receita, setReceita] = useState({});
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (modalData) {
            (async () => {
                try {
                    const response = await api.get(`/receitas/${modalData?.id}`);
                    const { steps } = response.data;
                    const tags = modalData.tags;
                    const thumb = await displayMedia(modalData.thumb);
                    setReceita({ ...modalData, steps, tags, thumb });
                } catch (error) {
                    console.error('Erro ao buscar receita:', error);
                }
            })();
        }
    }, [modalData]);

    return (<>
        < Modal show={isModalOpen} onHide={closeModal} centered={true} scrollable={false} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>Receita {receita.titulo ?? ""}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col className={styles["col-lg-3-review"]} lg={3} md={12}>
                            <InputGroup className="mb-3 align-items-center justify-content-center">
                                <InputGroup.Text style={{ maxWidth: '300px' }}>
                                    <img
                                        src={receita.thumb}
                                        alt="Preview"
                                        onChange={() => URL.revokeObjectURL(receita.thumb)}
                                        style={{ maxWidth: '100%' }}
                                    />
                                </InputGroup.Text>
                            </InputGroup>
                        </Col>
                        <Col>
                            <Row>
                                <Col lg={12}>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Categoria{receita?.tags && receita.tags.length > 1 ? "s" : ""}</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            disabled={true}
                                            style={{ backgroundColor: '#ffffff' }}
                                            value={receita?.tags && receita.tags.length > 0 ? receita.tags.map(a => a.tag).join(' / ') : ""}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Accordion defaultActiveKey="0">
                                        {!receita?.steps || receita?.steps.map((step, index) => {
                                            console.log({ step, index })
                                            return (
                                                <Accordion.Item key={`accordion-step-${index}`} eventKey={index}>
                                                    <Accordion.Header>Passo #{index + 1}</Accordion.Header>
                                                    <AccordionBody step={step} index={index} />
                                                </Accordion.Item>
                                            );
                                        })}
                                    </Accordion>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body >
        </Modal >
        <CustomToast
            show={showToast}
            onClose={() => setShowToast(false)}
            message="Testando!"
        />
    </>)
}
export default ModalReviewReceita;

function AccordionBody({ step }) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [videoType, setVideoType] = useState(null)

    const handleEntering = async () => {
        const reader = new FileReader();
        const promiseOnLoad = new Promise(resolve => {
            reader.onloadend = () => {
                resolve();
            }
        })
        const blob = await getBlobMedia(step.path);
        reader.readAsDataURL(blob);
        await promiseOnLoad;
        setVideoSrc(reader.result);
        setVideoType(blob.type);
    };

    return (
        <Accordion.Body onEntering={handleEntering}>
            <div className="text-center">
                <video width="100%" controls
                    style={{ minWidth: '300px', maxWidth: '600px', maxHeight: '600px' }}
                >
                    {videoSrc && <source src={videoSrc} type={videoType} />}
                    Seu navegador não suporta vídeos HTML5.
                </video>
            </div>
            <hr />
            <Table>
                <thead className="justify-content-center">
                    <tr>
                        <th>#</th>
                        <th>Ingrediente</th>
                        <th>Unidade</th>
                        <th>Medida</th>
                    </tr>
                </thead>
                <tbody>
                    {step.produtos.map((produto, index) => (
                        <tr key={`ingrediente-${index}`}>
                            <td>{index + 1}</td>
                            <td>{produto.desc}</td>
                            <td>{produto.unidMedida}</td>
                            <td>{produto.medida}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Table>
                <thead className="justify-content-center">
                    <tr>
                        <th>Mode de Prepado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{step.modoPreparo}</td>
                    </tr>
                </tbody>
            </Table>
        </Accordion.Body>
    );
}
