import { useState } from "react";
import Obra from "./Obra.jsx";
import ObraListado from "./ObraListado.jsx";

export default function ObrasPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="main-content">
      <div className="obras-container">
        <div className="content-card">
          {/* Card Formulario (Arriba) */}
          <Obra onSuccess={handleSuccess} />
        </div>
        {/* Card Listado (Abajo) */}
        <div className="content-card">
          <ObraListado refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}