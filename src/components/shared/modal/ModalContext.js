import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [contextObject, setContextObject] = useState({});
  const [contextList, setContextList] = useState([]);
  const [contextMap, setContextMap] = useState(new Map());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false)
  };

  return (
    <ModalContext.Provider value={{
      isModalOpen, openModal,
      closeModal, modalData,
      contextObject, setContextObject,
      contextList, setContextList,
      contextMap, setContextMap
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);