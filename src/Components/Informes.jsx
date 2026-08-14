import React from "react";
import '../Styles/Cardpanel.css'

export default function Informes() {
    return (
            <div className="content-card">
                <h3>Informes</h3>
                <h2>Obras sin cotizacion</h2>
                <table>
                    <thead>
                        <th>Referencia</th>
                        <th>Cliente</th>
                        <th>Fecha Inicio</th>
                        <th>Observaciones</th>
                    </thead>
                </table>
            </div>
    )
}