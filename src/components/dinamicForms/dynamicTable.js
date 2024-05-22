import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';

function DynamicTable() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState({ id: null, description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (step = { id: null, description: '' }) => {
    setCurrentStep(step);
    setIsEditing(step.id !== null);
    setShowModal(true);
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Step' : 'Adicionar Step'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStepDescription">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={currentStep.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddOrEditStep}>
            {isEditing ? 'Salvar Alterações' : 'Adicionar Step'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DynamicTable;
