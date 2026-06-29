import React, { useEffect, useState } from "react";
import '../Styles/Cardpanel.css'
import ClienteForm from '../Funciones/ClienteForm'

const Cardpanel = ({ Form, Listado }) => {

    const [refreshKey, setRefreshKey] =
        useState(0);

    const actualizarListado = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <main className="main-content container-fluid py-4">

            <div className="row g-4">

                <div className="col-12 col-lg-6">

                    <div className="content-card">

                        <Listado
                            refreshKey={refreshKey}
                        />

                    </div>

                </div>

                <div className="col-12 col-lg-6">

                    <div className="content-card">

                        <Form
                            onSuccess={
                                actualizarListado
                            }
                        />

                    </div>

                </div>

            </div>

        </main>
    );
};

export default Cardpanel;