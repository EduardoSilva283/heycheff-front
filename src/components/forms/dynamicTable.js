import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';

import api from '../../service/api';
import AddDeleteTableRows from '../forms/AddDeleteTableRows';

import '../shared/modal/modalCadReceita.module.css';

function DynamicTable({ idReceita }) {
	const [steps, setSteps] = useState([]);
	const [listSteps, setListSteps] = useState([]);
	const [currentStep, setCurrentStep] = useState({ stepNumber: null, modoPreparo: '', index: null, path: null, produtos: [] });
	const [isEditing, setIsEditing] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [file, setFile] = useState(null);
	const [modoPreparo, setModoPreparo] = useState('');
	const [rowsData, setRowsData] = useState([]); // State para os ingredientes
	const [selectedVideo, setSelectedVideo] = useState(null);
	const refInputVideo = useRef();

	useEffect(() => {
		// Load steps from the API when the component mounts
		const fetchSteps = async () => {
			try {
				const response = await api.get(`/receitas/${idReceita}`);
				setListSteps(response.data.steps);
			} catch (error) {
				console.error('Error fetching steps:', error);
			}
		};

		fetchSteps();
	}, [idReceita]);

	const createVideoThumb = (event) => {
		const video = event.target;
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext('2d');
		context?.drawImage(video, 0, 0, canvas.width, canvas.height);
		context?.canvas.toBlob(blob => { setSelectedVideo((current) => current.img = blob) }, 'image/jpeg', 1);
	};
	const handleFileChange = (e) => {
		const arquivo = e.target.files[0];
		setFile(e.target.files[0]);
		if (arquivo) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedVideo({
					video: reader.result,
					type: arquivo.type,
				});
			}
			reader.readAsDataURL(arquivo);
			console.log(e, reader);
		}
	};
	const handleShowModal = (step = { stepNumber: null, modoPreparo: '', index: steps.length + 1, path: null, produtos: [] }) => {
		setFile(null);
		setSelectedVideo(null);
		setCurrentStep(step);
		setModoPreparo(step.modoPreparo);
		if (step.index !== null) {

			setRowsData(step.produtos || []);
		} else {
			setRowsData([]);
		}
		//setRowsData(step.produtos || []);
		setIsEditing(false);
		setShowModal(true);
		handleListStep()
	};
	const handleEditStep = async (step) => {
		try {
			const response = await api.get(`/receitas/${idReceita}/steps/${step.stepNumber}`);
			const stepData = response.data;
			setCurrentStep({ id: stepData.stepNumber, modoPreparo: stepData.modoPreparo, index: stepData.stepNumber, stepNumber: stepData.stepNumber });
			setFile(stepData.path)
			setModoPreparo(stepData.modoPreparo);
			setRowsData(stepData.produtos || []);
			setIsEditing(true);
			setShowModal(true);
		} catch (error) {
			console.error('Error fetching step details:', error);
		}
	};

	const handleListStep = async (step) => {
		try {
			const response = await api.get(`/receitas/${idReceita}`);
			setListSteps(response.data.steps);

		} catch (error) {
			console.error('Error fetching steps:', error);
		}
	};
	const handleCloseModal = () => {
		setShowModal(false);
		setCurrentStep({ id: null, modoPreparo: '', index: null, });
		setModoPreparo('');
		setRowsData([]);
		setFile(null);

	};
	const handleAddStep = async () => {
		const formData = new FormData();
		if (file) {
			formData.append('video', file);
		}
		formData.append('modoPreparo', modoPreparo);
		formData.append('produtos', JSON.stringify(rowsData));
		formData.append('stepNumber', currentStep.index);

		try {
			if (isEditing) {
				await api.patch(`/receitas/${idReceita}/steps/${currentStep.index}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});

				setSteps(steps.map(step => (step.id === currentStep.id ? { ...step, modoPreparo: modoPreparo } : step)));

			}
			if (!isEditing) {
				const response = await api.post(`/receitas/${idReceita}/steps`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				const newStep = response.data;
				setSteps([...steps, { id: newStep.id, modoPreparo: modoPreparo, index: steps.length + 1 }]);
			}
		} catch (error) {
			console.error('Error:', error);
		}
		handleListStep();
		handleCloseModal();

	};

	const handleDeleteStep = async (stepNumber) => {
		try {
			await api.delete(`/receitas/${idReceita}/steps/${stepNumber}`);
			setListSteps(listSteps.filter(step => step.stepNumber !== stepNumber));
		} catch (error) {
			console.error('Error:', error);
		}
	};
	const handleFinalize = async () => {
		try {
			await api.patch(`/receitas/${idReceita}`, {
				status: true
			}, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			handleCloseModal();


		} catch (error) {
			console.error('Error finalizing the cadastro:', error);
			alert('Erro ao finalizar o cadastro.');
		}
	};

	const [contextMenu, setContextMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
	});
	const handleContextMenu = (event) => {
		event.preventDefault();
		setContextMenu({
			x: event.pageX,
			y: event.pageY,
			visible: true,
		});
		console.log(contextMenu, event, 2);
	};
	const handleClick = () => {
		setContextMenu({
			...contextMenu,
			visible: false,
		});
		console.log(contextMenu, 1)
	};

	return (
		<>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Video</th>
						<th>Modo de Preparo</th>
						<th>Ações</th>
					</tr>
				</thead>
				<tbody>
					{listSteps.map((step) => (
						<tr key={step.stepNumber}>
							<td>{step.stepNumber}</td>
							<td>{step.path}</td>
							<td>{step.modoPreparo}</td>
							<td>
								<Button variant="warning" onClick={() => handleEditStep(step)}>Editar</Button>{' '}
								<Button variant="danger" onClick={() => handleDeleteStep(step.stepNumber)}>Excluir</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<Button variant="warning" onClick={() => handleShowModal()}>Adicionar Step</Button>

			<p></p>

			{listSteps.length >= 2 && (
				<Button variant="warning" onClick={handleFinalize} className="mt-3">
					Finalizar Cadastro
				</Button>
			)}


			<Modal show={showModal} onHide={handleCloseModal} fullscreen={true}>
				<Modal.Header closeButton>
					<Modal.Title>{isEditing ? 'Editar Step' : 'Cadastrar Step'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="addVideoStep" className="heycheffButton">
							<Form.Label hidden={selectedVideo} className='input-file'>
								<FontAwesomeIcon icon={faVideo} className="me-2" />
								Adicionar Vídeo
								<Form.Control ref={refInputVideo} type='file' hidden accept='video/*' onChange={handleFileChange} />
							</Form.Label>
							{selectedVideo && (
								<div onClick={handleClick} style={{ textAlign: "center", position: 'relative' }}>
									<video
										width="100%"
										controls
										style={{ minWidth: "400px", maxWidth: "600px" }}
										onLoadedMetadata={createVideoThumb}
										onContextMenu={handleContextMenu}
									>
										<source src={selectedVideo.video} type={selectedVideo.type} />
										Your browser does not support HTML5 video.
									</video>

									{contextMenu.visible && (
										<ul
											style={{
												position: 'absolute',
												top: `${contextMenu.y}px`,
												left: `${contextMenu.x}px`,
												background: 'white',
												border: '1px solid #ccc',
												listStyle: 'none',
												padding: '10px',
												margin: 0,
												zIndex: 1000,
											}}
										>
											<li onClick={() => alert('Opção 1 selecionada')}>Opção 1</li>
										</ul>
									)}
								</div>
							)}
						</Form.Group>

						<AddDeleteTableRows rowsData={rowsData} setRowsData={setRowsData} />

						<Form.Group controlId="addModoPreparo">
							<Form.Label>Modo de Preparo</Form.Label>
							<Form.Control
								type="text"
								value={modoPreparo}
								onChange={(e) => setModoPreparo(e.target.value)}
							/>
						</Form.Group>

						<br></br>

						<Button variant="warning" onClick={handleAddStep}>Salvar Step</Button>
					</Form>
				</Modal.Body>
			</Modal >
		</>
	);
}

export default DynamicTable;
