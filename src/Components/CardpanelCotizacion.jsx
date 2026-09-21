import React, { useEffect, useState } from "react";
import '../Styles/Cardpanel.css'
import ClienteForm from '../Funciones/ClienteForm'
import ListCotizacion from "./CotizacionListado";
import FormCotizacion from "./Cotizacion";

const CardpanelCotizacion = ({ Form, Listado }) => {

    const [refreshKey, setRefreshKey] =
        useState(0);

    const actualizarListado = () => {
        setRefreshKey(prev => prev + 1);
    };

    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);

    return (
        <main className="main-content">

            <div className="obras-container">

                

                    <div className="content-card">

                        <FormCotizacion
                            onSuccess={actualizarListado}
                            cotizacionSeleccionada={
                                cotizacionSeleccionada
                            }
                            limpiarSeleccion={() =>
                                setCotizacionSeleccionada(null)
                            }
                        />

                    </div>

                    <div className="content-card">

                        <ListCotizacion
                            refreshKey={refreshKey}
                            onEditar={
                                setCotizacionSeleccionada
                            }
                        />

                    </div>

                </div>

        </main>
    );
};

export default CardpanelCotizacion;