import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    return (
      <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
        {children}
      </ModalContext.Provider>
    );
  };

  export const useModal = () => useContext(ModalContext);