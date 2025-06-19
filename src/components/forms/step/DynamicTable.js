import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import api from '../../../service/api';
import { displayMediaType, getBlobMedia } from '../../../service/media';
import { useModal } from '../../shared/modal/ModalContext';

import '../receita/cadReceita.css';

function DynamicTable({ idReceita }) {
	const {
		openModal: openCadStepModal,
		setContextObject: setCurrentStep,
		contextList: stepList,
		setContextList: setStepList,
		contextMap: videoThumbs
	} = useModal();

	const navigate = useNavigate();

	const handleEditStep = async (step) => {
		try {
			const stepData = (await api.get(`/receitas/${idReceita}/steps/${step.stepNumber}`)).data;
			const [video, type] = await displayMediaType(stepData.path);
			const blobVideo = await getBlobMedia(stepData.path);
			setCurrentStep({
				stepNumber: stepData.stepNumber,
				modoPreparo: stepData.modoPreparo,
				produtos: stepData.produtos || [],
				timeMinutes: stepData.timeMinutes, 
				isEditing: true,
				selectedVideo: { video: video, type: type },
				video: blobVideo
			});
			openCadStepModal();
		} catch (error) {
			console.error('Error fetching step details:', error);
		}
	};

	const handleDeleteStep = async (stepNumber) => {
		try {
			await api.delete(`/receitas/${idReceita}/steps/${stepNumber}`);
			setStepList(stepList.filter(step => step.stepNumber !== stepNumber));
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
			navigate("/");
		} catch (error) {
			console.error('Error finalizing receipt:', error);
			alert('Erro ao finalizar o cadastro.');
		}
	};

	return (
		<>
			<DataTable value={stepList} rowHover stripedRows size='large'
				emptyMessage='Não há steps cadastrados'>
				<Column header='#' className='px-3' align='center' alignHeader='center'
					body={(_step, { rowIndex }) => rowIndex + 1} />
				<Column header='Vídeo' className='p-2' align='center' alignHeader='center'
					body={(_step, { rowIndex }) => {
						const thumb = videoThumbs.get(rowIndex + 1);
						return thumb
							? <img className='thumb' src={thumb} alt='video-thumb' />
							: <span style={{color: '#bbb'}}>Sem miniatura</span>;
					}} />
				<Column field='modoPreparo' header='Modo de Preparo' className='px-3'
					style={{ textAlign: 'justify', width: '100%', maxWidth: '50%' }}
					align='center' alignHeader='center' />
				<Column header="Ações" align='center' alignHeader='center' body={
					(step, { rowIndex }) => <div>
						<Button variant="warning" className='btn-edit'
							onClick={() => handleEditStep(step)}>
							Editar
						</Button>
						<Button variant="danger" onClick={() => handleDeleteStep(step.stepNumber)}>
							Excluir
						</Button>
					</div>
				} />
			</DataTable>

			<div>
				<Button className='mt-3' variant="warning" onClick={openCadStepModal}>Adicionar Step</Button>
			</div>

			<div className='d-flex justify-content-end'>
				{stepList.length > 1 && (
					<Button variant="warning" onClick={handleFinalize} className="mt-4">
						Finalizar Cadastro
					</Button>
				)}
			</div>
		</>
	);
}

export default DynamicTable;
