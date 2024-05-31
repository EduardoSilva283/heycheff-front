import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import AddDeleteTableRows from '../dinamicForms/AddDeleteTableRows';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { API_URL } from '../../constants/const';

function DynamicTable({ idReceita }) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({ id: null, description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [modoPreparo, setModoPreparo] = useState('');
  const [rowsData, setRowsData] = useState([]); // State para os ingredientes

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleShowModal = (step = { id: null, description: '' }) => {
    setCurrentStep(step);
    setIsEditing(step.id !== null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep({ id: null, description: '' });
    setFile(null); // Reset file input when modal closes
  };

  const handleAddOrEditStep = async () => {
    const formData = new FormData();
    if (file) {
      formData.append('video', file);
    }
    formData.append('modoPreparo', modoPreparo);
    formData.append('produtos', JSON.stringify(rowsData)); // Adiciona os ingredientes ao FormData

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/steps/${currentStep.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSteps(steps.map(step => (step.id === currentStep.id ? currentStep : step)));
      } else {
        const response = await axios.post(`${API_URL}/receitas/${idReceita}/steps`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const newStep = response.data;
        setSteps([...steps, { ...currentStep, id: newStep.id }]);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    handleCloseModal();
  };

  const handleDeleteStep = async (id) => {
    try {
      await axios.delete(`${API_URL}/steps/${id}`);
      setSteps(steps.filter(step => step.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step, index) => (
            <tr key={step.id}>
              <td>{index + 1}</td>
              <td>{step.description}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(step)}>Editar</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteStep(step.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="warning" onClick={() => handleShowModal()}>Adicionar Step</Button>

      <Modal show={showModal} onHide={handleCloseModal} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Step</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="addVideoStep" className="heycheffButton">
              <Form.Label className='input-file'>
                <FontAwesomeIcon icon={faVideo} className="me-2" />
                Adicionar Vídeo
              </Form.Label>
              <Form.Control type='file' hidden accept='video/*' onChange={handleFileChange} />
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

            <Button variant="warning" onClick={handleAddOrEditStep}>Salvar Step</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DynamicTable;
