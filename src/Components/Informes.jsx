import React, { use, useEffect, useState } from "react";
import '../Styles/Cardpanel.css'

export default function Informes() {

    const API_URL = 'https://localhost:7208/'

    const [estadosPendientes, setEstadosPendientes] = useState([])
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
    const [loading, setLoading] = useState(false);

    const [filtros, setFiltros] = useState({
        idObra: null,
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
        idObra,
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

    function actualizarFiltro(campo, valor) {

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

    const handleSeleccion = (estado) => {
        setEstadoSeleccionado(estado)
    }


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

            <div className="filtros">
                <label htmlFor="idEstados">Estado comercial</label>
                <select
                    name="idEstados"
                    onChange={handleSeleccion}>

                    <option value="">
                        "Seleccione estado comercial"
                    </option>

                    {
                        estadosPendientes.map(
                            ep => (
                                <option
                                    key={ep.id}
                                    value={ep.id}
                                >
                                    {ep.nombre}
                                </option>
                            )
                        )
                    }

                </select>
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