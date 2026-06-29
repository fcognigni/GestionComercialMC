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
        <main className="main-content container-fluid py-4">

            <div className="row g-4">

                <div className="col-12 col-lg-6">

                    <div className="content-card">

                        <ListCotizacion
                            refreshKey={refreshKey}
                            onEditar={
                                setCotizacionSeleccionada
                            }
                        />

                    </div>

                </div>

                <div className="col-12 col-lg-6">

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

                </div>

            </div>

        </main>
    );
};

export default CardpanelCotizacion;