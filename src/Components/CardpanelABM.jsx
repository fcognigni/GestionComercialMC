import React, { useEffect, useState } from "react";
import '../Styles/Cardpanel.css'
import ClienteForm from '../Funciones/ClienteForm'

const CardpanelABM = ({ Form, Listado }) => {

    const [refreshKey, setRefreshKey] =
        useState(0);

    const actualizarListado = () => {
        setRefreshKey(prev => prev + 1);
    };

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    return (
        <main className="main-content container-fluid py-4">

            <div className="row g-4">

                <div className="col-12 col-lg-7">

                    <div className="content-card">

                        <Listado
                            refreshKey={refreshKey}
                            onEditar={setClienteSeleccionado}
                        />

                    </div>

                </div>

                <div className="col-12 col-lg-5">

                    <div className="content-card">

                        <Form
                            onSuccess={
                                actualizarListado
                            }
                            clienteSeleccionado={clienteSeleccionado}
                            limpiarSeleccion={() => setClienteSeleccionado(null)}
                        />

                    </div>

                </div>

            </div>

        </main>
    );
};

export default CardpanelABM;