import { useConfigStore } from './useConfigStore';
import { useState } from 'react';

export function ConfigScreen() {
  const { apiUrl, setApiUrl } = useConfigStore();
  const [inputUrl, setInputUrl] = useState(apiUrl);

  const handleSave = () => {
    setApiUrl(inputUrl);
    alert('¡URL actualizada con éxito!');
  };

  return (
    <div>
      <h3>Configurar Servidor Local</h3>
      <input 
        type="text" 
        value={inputUrl} 
        onChange={(e) => setInputUrl(e.target.value)} 
        placeholder="Ej: http://192.168.1.50:4000"
      />
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}