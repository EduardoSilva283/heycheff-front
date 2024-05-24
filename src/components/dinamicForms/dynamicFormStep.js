import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function DynamicForm() {
  const [steps, setSteps] = useState([{ description: '' }]);

  const handleStepChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index][event.target.name] = event.target.value;
    setSteps(newSteps);
  };
  const handleAddStep = () => {
    setSteps([...steps, { description: '' }]);
  };

  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((step, i) => i !== index);
    setSteps(newSteps);
  };
  const handleStepSubmit = (event) => {
    event.preventDefault();
    // Process the form submission
    console.log('Steps:', steps);
  };

  return (
    <Form onSubmit={handleStepSubmit}>
      <Form.Group>
        <Form.Label>Steps</Form.Label>
        {steps.map((step, index) => (
          <div key={index} className="mb-3">
            <Form.Control type="text" name="description" value={step.description} onChange={(event) => handleStepChange(index, event)}
              placeholder={`Step ${index + 1} Description`}
            />
            <Button variant="danger" onClick={() => handleRemoveStep(index)} className="mt-2"> Remove Step </Button>
          </div>
        ))}
        <Button variant="primary" onClick={handleAddStep}>
          Adicionar Step
        </Button>
        
      </Form.Group>
      <Button variant="warning" type="submit">
        Finalizar Cadastro
      </Button>
    </Form>
  );
}

export default DynamicForm;
