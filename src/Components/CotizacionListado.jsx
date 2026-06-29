import React from "react";
import { useEffect, useState } from "react";

export default function ListCotizacion({
    refreshKey,
    onEditar
}) {

    const [cotizaciones, setCotizaciones] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [clientes, setClientes] =
        useState([]);

    const cargarCotizaciones = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    "https://localhost:7208/api/Cotizacion"
                );

            if (!response.ok) {

                throw new Error(
                    "Error al obtener cotizaciones"
                );
            }

            const data =
                await response.json();

            setCotizaciones(data);

        }
        catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Error al cargar cotizaciones"
            );
        }
        finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        cargarCotizaciones();

    }, [refreshKey]);

    const cargarClientes = async () => {

        try {

            const response =
                await fetch(
                    "https://localhost:7208/api/Cliente"
                );

            if (!response.ok)
                throw new Error(
                    "Error cargando clientes"
                );

            const data =
                await response.json();

            setClientes(data);

        }
        catch (err) {

            setError(err.message);

        }
    };

    useEffect(() => {

        cargarClientes();

    }, []);

    const cliente =
        clientes.find(
            c => c.id === cotizaciones.idCliente
        );


    if (loading) {

        return (
            <p>Cargando cotizaciones...</p>
        );
    }

    if (error) {

        return (
            <div className="error-msg">
                {error}
            </div>
        );
    }

    return (
        <>
            <h3>Listado de Cotizaciones</h3>

            <table className="table table-hover align-middle">

                <thead>

                    <tr>
                        <th>Número</th>
                        <th>Cliente</th>
                        <th>Referencia</th>
                        <th>Fecha</th>
                        <th></th>
                    </tr>

                </thead>

                <tbody>

                    {cotizaciones.length === 0 ? (

                        <tr>
                            <td colSpan="5">
                                No existen cotizaciones cargadas
                            </td>
                        </tr>

                    ) : (

                        cotizaciones.map(cotizacion => (

                            <tr key={cotizacion.id}>

                                <td>
                                    {cotizacion.numero}
                                </td>

                                <td>
                                    {cliente?.nombre}
                                </td>

                                <td>
                                    {cotizacion.referencia}
                                </td>

                                <td>
                                    {
                                        new Date(
                                            cotizacion.fecha
                                        )
                                            .toLocaleDateString(
                                                "es-AR"
                                            )
                                    }
                                </td>

                                <td>

                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() =>
                                            onEditar(
                                                cotizacion
                                            )
                                        }
                                    >
                                        ✏️
                                    </button>

                                </td>

                            </tr>

                        ))
                    )}

                </tbody>

            </table>
        </>
    );
}