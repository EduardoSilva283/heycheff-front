import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [contextObject, setContextObject] = useState({});
  const [contextList, setContextList] = useState([]);
  const [contextMap, setContextMap] = useState(new Map());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{
      isModalOpen, openModal, closeModal,
      contextObject, setContextObject,
      contextList, setContextList,
      contextMap, setContextMap
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);