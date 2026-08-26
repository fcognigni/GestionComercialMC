import React, { use, useEffect, useState } from "react";
import '../Styles/Cardpanel.css'

export default function Informes() {

    const API_URL = 'https://localhost:7208/'

    const [estadosPendientes, setEstadosPendientes] = useState([])
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
    const [loading, setLoading] = useState(false);

    const [filtros, setFiltros] = useState({
        idCliente: null,
        idEstadoComercial: null,
        fechaDesde: null,
        fechaHasta: null
    });

    const [estados, setEstados] = useState([]);

    const [totalRegistros, setTotalRegistros] =
        useState(0);

    const [pagina, setPagina] =
        useState(1);

    async function cargarEstados({
        idCliente,
        idEstadoComercial,
        page = 1,
        pageSize = 50
    } = {}) {

        const params = new URLSearchParams();

        if (idObra) {
            params.append("idObra", idObra);
        }

        if (idEstadoComercial) {
            params.append(
                "idEstadoComercial",
                idEstadoComercial
            );
        }

        params.append("page", page);
        params.append("pageSize", pageSize);

        const response = await fetch(
            `${API_URL}/api/ObraEstadoComercial?${params}`
        );

        if (!response.ok) {
            throw new Error(
                "Error al cargar los estados comerciales"
            );
        }

        return await response.json();
    }


    async function cargarDatos() {

        const data =
            await cargarEstados({
                ...filtros,
                page: pagina,
                pageSize: 50
            });

        setEstados(data.items);

        setTotalRegistros(
            data.totalRegistros
        );
    }

    const actualizarFiltro = (e) => {

        const { name, value } = e.target;

        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));

        setPagina(1);
    }


    useEffect(() => {

        cargarDatos();

    }, [
        pagina,
        filtros
    ]);


    return (
        <main className="main-content container-fluid py-4">

            {loading && (
                <div className="info-msg">
                    Cargando historial...
                </div>
            )}

            {!loading && estadosPendientes.length === 0 && (
                <div className="historial-vacio">
                    No hay historial de estados comerciales aun.
                </div>
            )}

            <div className="contenedor-filtros">
            <div className="filtro">
                <label htmlFor="idEstados">Estado comercial</label>
                <select
                    name="idEstadoComercial"
                    value={filtros.idEstadoComercial}
                    onChange={actualizarFiltro}>

                    <option value="">
                        "Seleccione estado comercial"
                    </option>

                    {
                        estados.map(
                            e => (
                                <option
                                    key={e.id}
                                    value={e.id}
                                >
                                    {e.nombre}
                                </option>
                            )
                        )
                    }

                </select>
            </div>
            <div className="filtro">
                    <label htmlFor="idCliente">Cliente</label>
                    <select 
                    name="idCliente"
                    value={filtros.idCliente}
                    onChange={actualizarFiltro}>
                    

                    </select>
            </div>
            </div>

            <div className="content-card">
                <h3>Obras sin cotizacion</h3>
                <table>
                    <thead>
                        <tr>
                        <th>Referencia</th>
                        <th>Cliente</th>
                        <th>Fecha Inicio</th>
                        <th>Observaciones</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </main>
    )
}