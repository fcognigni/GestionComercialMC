import { create } from 'zustand';

export const useConfigStore = create((set) => ({
  // Valor por defecto (puedes cambiarlo según tu entorno inicial)
  apiUrl: 'http://localhost:7208', 
  
  // Acción para actualizar la URL y guardarla (opcionalmente en localStorage para que persista)
  setApiUrl: (newUrl) => {
    localStorage.setItem('api_url', newUrl); // Si es React Native, usarías AsyncStorage
    set({ apiUrl: newUrl });
  },
}));