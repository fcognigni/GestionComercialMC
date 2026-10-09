import React, { use, useEffect, useState } from "react";
import SelectorCliente from "./SelectorCliente";
import TablaEstadisticasCotizaciones from "./TablaEstadisticasCotizacion"
import TablaEstadisticasObras from './TablaEstadisticasObra'
import '../Styles/Cardpanel.css'

export default function Estadisticas() {

    const [estadisticasCotizaciones, setEstadisticasCotizaciones] = useState([]);
    const [estadisticasObras, setEstadisticasObras] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const cargarEstadisticas = async () => {
            try {

                const [resCotizaciones, resObras] = await Promise.all([
                    fetch("https://localhost:7208/api/Estadisticas/cotizaciones"),
                    fetch("https://localhost:7208/api/Estadisticas/obras")
                ]);

                const cotizaciones = await resCotizaciones.json();
                const obras = await resObras.json();

                setEstadisticasCotizaciones(cotizaciones);
                setEstadisticasObras(obras);

            } catch (error) {
                console.error("Error cargando estadísticas:", error);
            }
        };

        cargarEstadisticas();

    }, []);

    return (
        <main className="main-content container-fluid py-4">

              {/* <SelectorCliente 
                    clientes={clientes}
                    value={filtros.idCliente}
                    onSeleccionar={actualizarFiltro}
                 />
              */}

            <div className="content-card">
                <TablaEstadisticasCotizaciones
                    datos={estadisticasCotizaciones}
                />

                <TablaEstadisticasObras
                    datos={estadisticasObras}
                />            </div>
        </main>
    )
}
