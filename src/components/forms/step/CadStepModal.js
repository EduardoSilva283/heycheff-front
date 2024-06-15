import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import api from '../../../service/api';
import { useModal } from '../../shared/modal/ModalContext';
import AddDeleteTableRows from './AddDeleteTableRows';

import '../receita/cadReceita.css';

function CadStepModal({ idReceita }) {
    const {
        isModalOpen,
        closeModal,
        contextObject: currentStep,
        setContextObject: setCurrentStep,
        contextList: stepList,
        setContextList: setStepList,
        setContextMap: setVideoThumbs
    } = useModal();

    const [contextMenu, setContextMenu] = useState({
        visible: false, x: 0, y: 0
    });

    const refInputVideo = useRef();
    const stepReset = useMemo(() => ({
        stepNumber: stepList.length + 1,
        modoPreparo: '',
        produtos: [{
            desc: '',
            unidMedida: '',
            medida: ''
        }],
        isEditing: false,
        selectedVideo: null,
        video: null
    }), [stepList]);

    useEffect(() => {
        if (Object.keys(currentStep).length === 0) {
            setCurrentStep(stepReset);
        }
    }, [currentStep, setCurrentStep, stepList, stepReset]);

    const createVideoThumb = (event) => {
        const video = event.target;
        const jpeg = 'image/jpeg';

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const thumbnail = canvas.toDataURL(jpeg);
        setThumbnail(thumbnail);

        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        context?.canvas.toBlob(
            blob => setSelectedVideo(current => current.img = blob), jpeg, 1
        );
    };

    const setThumbnail = (thumbnail) => {
        setVideoThumbs(prevThumbs => new Map(prevThumbs)
            .set(currentStep.stepNumber, thumbnail));
    }

    const handleFileChange = (e) => {
        resetVideo();
        const file = e.target.files[0];
        setVideo(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedVideo({
                video: reader.result,
                type: file.type
            });
            reader.readAsDataURL(file);
        }
    };

    const resetVideo = () => {
        setVideo(null);
        setSelectedVideo(null);
    }

    const setVideo = (video) => {
        setCurrentStep(step => ({ ...step, video: video }));
    }

    const setSelectedVideo = (defVideo) => {
        setCurrentStep(step => ({ ...step, selectedVideo: defVideo }));
    }

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            visible: true
        });
    };

    const handleClick = () => {
        setContextMenu({
            ...contextMenu,
            visible: false
        });
    };

    const handleAddStep = async () => {
        const formData = new FormData();
        if (currentStep.video) {
            const filename = `receitaStep_${idReceita}_${currentStep.stepNumber}`;
            formData.append('video', currentStep.video, filename);
        }
        formData.append('modoPreparo', currentStep.modoPreparo);
        formData.append('produtos', JSON.stringify(currentStep.produtos));
        formData.append('stepNumber', currentStep.stepNumber);

        try {
            if (currentStep.isEditing) {
                await api.patch(`/receitas/${idReceita}/steps/${currentStep.stepNumber}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

            } else {
                await api.post(`/receitas/${idReceita}/steps`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }

        handleListStep();
        resetStep();
        closeModal();
    };

    const handleListStep = async () => {
        try {
            const response = (await api.get(`/receitas/${idReceita}`));
            setStepList(response.data.steps);
        } catch (error) {
            console.error('Error fetching steps:', error);
        }
    };

    const resetStep = () => {
        setCurrentStep(stepReset);
    }

    const setModoPreparo = (modoPreparo) => {
        setCurrentStep(step => ({ ...step, modoPreparo: modoPreparo }));
    }

    return (
        <Modal show={isModalOpen} onHide={() => {
            closeModal();
            resetStep();
        }} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>{currentStep.isEditing ? 'Editar Step' : 'Cadastrar Step'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="addVideoStep" className="heycheffButton">
                        <Form.Label hidden={currentStep.video} className='input-file m-0'>
                            <FontAwesomeIcon icon={faVideo} className="me-2" /> Adicionar Vídeo
                            <Form.Control ref={refInputVideo} type='file' hidden accept='video/*'
                                onChange={handleFileChange} className='input-video' />
                        </Form.Label>
                        {currentStep.selectedVideo && (
                            <div onClick={handleClick} className='video'>
                                <video
                                    controls
                                    className='step-video'
                                    onLoadedData={createVideoThumb}
                                    onContextMenu={handleContextMenu}
                                >
                                    <source src={currentStep.selectedVideo.video}
                                        type={currentStep.selectedVideo.type} />
                                    Your browser does not support HTML5 video.
                                </video>

                                {contextMenu.visible && (
                                    <ul style={{
                                        position: 'absolute',
                                        top: `${contextMenu.y}px`,
                                        left: `${contextMenu.x}px`,
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        listStyle: 'none',
                                        padding: '10px',
                                        margin: 0,
                                        zIndex: 1000,
                                    }} >
                                        <li onClick={() => document.querySelector('.input-video').click()}
                                            className='input-file'>
                                            Novo Upload
                                        </li>
                                    </ul>
                                )}
                                <span className='hint-menu'>
                                    Clique com o botão direito do mouse para abrir o menu
                                </span>
                            </div>
                        )}
                    </Form.Group>

                    <AddDeleteTableRows rowsData={currentStep.produtos} setRowsData={setCurrentStep} />

                    <Form.Group controlId="addModoPreparo">
                        <Form.Label>Modo de Preparo</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={currentStep.modoPreparo}
                            onChange={(e) => setModoPreparo(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="warning" className='mt-4' onClick={handleAddStep}>
                        Salvar Step
                    </Button>
                </Form>
            </Modal.Body>
        </Modal >
    );
}

export default CadStepModal;