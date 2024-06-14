import { useEffect, useState } from "react";
import { useModal } from "./ModalContext";
import Modal from 'react-bootstrap/Modal';
import CustomToast from "../toast/CustomToast";
import api from "../../../service/api";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { displayMedia } from "../../../service/media";

function ModalReviewReceita() {
    const { isModalOpen, closeModal, modalData } = useModal();
    const [receita, setReceita] = useState({});
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (modalData) {
            (async () => {
                try {
                    const response = await api.get(`/receitas/${modalData?.id}`);
                    const { steps, tags } = response.data;
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
                <Row>
                    <Col md={12} lg={4}>
                        <InputGroup className="mb-3 align-items-center justify-content-center">
                            <InputGroup.Text style={{ maxWidth: "300px" }}>
                                <img
                                    src={receita.thumb}
                                    alt="Preview"
                                    onChange={() => URL.revokeObjectURL(receita.thumb)}
                                    style={{ maxWidth: "100%" }}
                                />
                            </InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col>
                    Teste
                    </Col>
                </Row>
                {JSON.stringify(receita) ?? 'erro'}
            </Modal.Body>
        </Modal>
        <CustomToast
            show={showToast}
            onClose={() => setShowToast(false)}
            message="Testando!"
        />
    </>)
}
export default ModalReviewReceita;