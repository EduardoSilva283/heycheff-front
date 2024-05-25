import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import ModalCadStep from '../modal/modalCadStep';
import AddDeleteTableRows from '../dinamicForms/AddDeleteTableRows';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function DynamicTable() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({ id: null, description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleShowModal = (step = { id: null, description: '' }) => {

    setCurrentStep(step);
    setIsEditing(step.id !== null);
    setShowModal(true);

    { showModal && <ModalCadStep /> }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep({ id: null, description: '' });
  };

  const handleChange = (e) => {
    setCurrentStep({ ...currentStep, [e.target.name]: e.target.value });
  };

  const handleAddOrEditStep = () => {
    if (isEditing) {
      setSteps(steps.map(step => (step.id === currentStep.id ? currentStep : step)));
    } else {
      setSteps([...steps, { ...currentStep, id: steps.length + 1 }]);
    }
    handleCloseModal();
  };

  const handleDeleteStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
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
      <Button variant="primary" onClick={() => handleShowModal()}>Adicionar Step</Button>

      <Modal show={showModal} onHide={handleCloseModal} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Step</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>
            <Form.Group controlId="formFile" className="heycheffButton">
              <Form.Label className='input-file'>
                <FontAwesomeIcon icon={faVideo} className="me-2" />
                Adicionar Video
              </Form.Label>
              <Form.Control type='file' hidden accept='video/*' onChange={handleFileChange} />
            </Form.Group>
          </Form>
          {<AddDeleteTableRows />}

        </Modal.Body>

      </Modal>
    </>
  );
}

export default DynamicTable;