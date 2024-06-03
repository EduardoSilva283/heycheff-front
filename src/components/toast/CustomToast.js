import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function CustomToast({ show, onClose, type, message }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={onClose} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">{type === 'success' ? 'Sucesso' : 'Erro'}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default CustomToast;
