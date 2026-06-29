import { useEffect, useState } from "react";
import '../Styles/Cliente.css'

export default function ListCliente({
    refreshKey,
    onEditar
}) {

    const [clientes, setClientes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const cargarClientes = async () => {

        try {

            setLoading(true);

            const response =
                await fetch(
                    "https://localhost:7208/api/Cliente"
                );

            if (!response.ok) {
                throw new Error(
                    "Error al obtener clientes"
                );
            }

            const data =
                await response.json();

            console.log(data)
            setClientes(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        cargarClientes();

    }, [refreshKey]);

    if (loading)
        return <p>Cargando...</p>;

    return (
        <>
            <h3>Clientes</h3>

            <div className="table-responsive">
                <table className="table table-hover align-middle">

                    <thead>

                        <tr>
                            <th>Nombre</th>
                            <th>CUIT</th>
                            <th>Localidad</th>
                            <th></th>
                        </tr>

                    </thead>

                    <tbody>

                        {clientes.map(cliente => (

                            <tr key={cliente.id}>

                                <td>
                                    {cliente.nombre}
                                </td>

                                <td>
                                    {cliente.cuit}
                                </td>

                                <td>
                                    {cliente.localidad}
                                </td>

                                <td>

                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() =>
                                            onEditar(cliente)
                                        }
                                    >
                                        ✏️
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {error &&
                    <div className="error-msg">
                        {error}
                    </div>
                }
            </div>
        </>
    );
}