import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import AddDeleteTableRows from '../dinamicForms/AddDeleteTableRows';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { API_URL } from '../../constants/const';

function DynamicTable({ idReceita }) {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({ id: null, description: '', index: null });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [modoPreparo, setModoPreparo] = useState('');
  const [rowsData, setRowsData] = useState([]); // State para os ingredientes

  useEffect(() => {
    // Load steps from the API when the component mounts
    const fetchSteps = async () => {
      try {
        const response = await axios.get(`${API_URL}/receitas/${idReceita}`);
        setSteps(response.data.steps);
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    fetchSteps();
  }, [idReceita]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleShowModal = (step = { id: null, description: '', index: steps.length + 1 }) => {
    setCurrentStep(step);
    setModoPreparo(step.description);
    if (step.id !== null) {

      setRowsData(step.ingredientes || []);
    } else {
      setRowsData([]);
    }
    setIsEditing(step.id !== null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep({ id: null, description: '', index: null });
    setModoPreparo('');
    setRowsData([]);
    setFile(null);
  };

  const handleAddOrEditStep = async () => {
    const formData = new FormData();
    if (file) {
      formData.append('video', file);
    }
    formData.append('modoPreparo', modoPreparo);
    formData.append('produtos', JSON.stringify(rowsData));
    formData.append('stepNumber', currentStep.index);

    try {
      if (isEditing) {
        await axios.patch(`${API_URL}/receitas/${idReceita}/steps/${currentStep.index}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSteps(steps.map(step => (step.id === currentStep.id ? { ...step, description: modoPreparo } : step)));
      } else {
        const response = await axios.post(`${API_URL}/receitas/${idReceita}/steps`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const newStep = response.data;
        setSteps([...steps, { id: newStep.id, description: modoPreparo, index: steps.length + 1 }]);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    handleCloseModal();
  };

  const handleDeleteStep = async (id) => {
    try {
      await axios.delete(`${API_URL}/receitas/${idReceita}/steps/${id}`);
      setSteps(steps.filter(step => step.id !== id).map((step, idx) => ({ ...step, index: idx + 1 })));
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
            <th>Modo de Preparo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step.index}>
              <td>{step.index}</td>
              <td>{step.description}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(step)}>Editar</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteStep(step.index)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="warning" onClick={() => handleShowModal()}>Adicionar Step</Button>

      <Modal show={showModal} onHide={handleCloseModal} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Step' : 'Cadastrar Step'}</Modal.Title>
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
