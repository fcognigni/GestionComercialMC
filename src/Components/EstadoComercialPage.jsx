import { useState } from "react";
import Cardpanel from "./Cardpanel";
import WorkflowEstadoComercial from "./WorkflowEstadoComercial";
import HistorialEstadoComercial from "./HistorialEstadoComercial";

export default function EstadoComercialPage() {

    const [refreshKey, setRefreshKey] =
        useState(0);

    const [obraSeleccionada, setObraSeleccionada] =
        useState(null);

    const actualizarListado = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Cardpanel
            Form={() => (
                <WorkflowEstadoComercial
                    onSuccess={actualizarListado}
                    onObraSeleccionada={setObraSeleccionada}
                />
            )}
            Listado={() => (
                <HistorialEstadoComercial
                    obraSeleccionada={obraSeleccionada}
                    refreshKey={refreshKey}
                />
            )}
        />
    );
}