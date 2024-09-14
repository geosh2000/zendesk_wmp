import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const DataContext = createContext();

// Crear un proveedor para el contexto
export const DataProvider = ({ children }) => {
  const [modalData, setModalData] = useState({});
  console.log('new data context', modalData)

  // Función para actualizar los datos
  const updateData = (data) => {
    console.log('set Data', data)
    setModalData(data);
  };

  // Función para obtener los datos
  const getData = () => {
    return modalData;
  };

  return (
    <DataContext.Provider value={{ updateData, getData }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook para usar el contexto
export const useData = () => {
  return useContext(DataContext);
};