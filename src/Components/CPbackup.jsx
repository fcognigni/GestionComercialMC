import React, { useEffect, useState } from "react";
import '../Styles/Cardpanel.css'
import ClienteForm from '../Funciones/ClienteForm'

const Cardpanel = ({Form, Listado}) => {

    return (
        <main className="main-content container-fluid py-4">

            <div className="row g-4">

                <div className="col-12 col-lg-6">
                    <div className="content-card">
                        <div>
                            <Listado />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="content-card">
                        <div>
                            <Form />
                        </div>
                    </div>
                </div>

            </div>

        </main>
    )
}

export default Cardpanel;