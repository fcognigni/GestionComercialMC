import React, { useEffect, useState } from "react";
import '../Styles/Cardpanel.css'
import ClienteForm from '../Funciones/ClienteForm'
import FormSolicitante from "./Solicitante";
import ListSolicitante from "./SolicitanteListado";

const CardpanelSolicitante = ({ Form, Listado }) => {

    const [refreshKey, setRefreshKey] =
        useState(0);

    const actualizarListado = () => {
        setRefreshKey(prev => prev + 1);
    };

    const [solicitanteSeleccionado, setSolicitanteSeleccionado] = useState(null);

    return (
        <main className="main-content container-fluid py-4">

            <div className="row g-4">

                <div className="col-12 col-lg-7">

                    <div className="content-card">

                        <ListSolicitante
                            refreshKey={refreshKey}
                            onEditar={
                                setSolicitanteSeleccionado
                            }
                        />

                    </div>

                </div>

                <div className="col-12 col-lg-5">

                    <div className="content-card">

                        <FormSolicitante
                            onSuccess={actualizarListado}
                            solicitanteSeleccionado={
                                solicitanteSeleccionado
                            }
                            limpiarSeleccion={() =>
                                setSolicitanteSeleccionado(null)
                            }
                        />

                    </div>

                </div>

            </div>

        </main>
    );
};

export default CardpanelSolicitante;