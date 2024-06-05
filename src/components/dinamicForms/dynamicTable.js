import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import AddDeleteTableRows from '../dinamicForms/AddDeleteTableRows';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { API_URL } from '../../constants/const';

function DynamicTable({ idReceita }) {
  const [steps, setSteps] = useState([]);
  const [listSteps, setListSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({ stepNumber: null, modoPreparo: '', index: null, path: null, produtos: [] });
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
        setListSteps(response.data.steps);
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    fetchSteps();
  }, [idReceita]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0])
  };

  const handleShowModal = (step = { stepNumber: null, modoPreparo: '', index: steps.length + 1, path: null, produtos: [] }) => {
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
      const response = await axios.get(`${API_URL}/receitas/${idReceita}/steps/${step.stepNumber}`);
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
      const response = await axios.get(`${API_URL}/receitas/${idReceita}`);
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

        setSteps(steps.map(step => (step.id === currentStep.id ? { ...step, modoPreparo: modoPreparo } : step)));

      } else {
        const response = await axios.post(`${API_URL}/receitas/${idReceita}/steps`, formData, {
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
    handleListStep()
    handleCloseModal();
  };

  const handleDeleteStep = async (stepNumber) => {
    try {
      await axios.delete(`${API_URL}/receitas/${idReceita}/steps/${stepNumber}`);
      //setSteps(steps.filter(step => step.index !== index).map((step, idx) => ({ ...step, index: idx + 1 })));
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
