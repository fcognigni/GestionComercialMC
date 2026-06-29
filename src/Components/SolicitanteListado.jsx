import { useEffect, useState } from "react";
import '../Styles/Cliente.css'

export default function ListSolicitante({
    refreshKey,
    onEditar
}) {

    const [solicitantes, setSolicitantes] =
        useState([]);

    const [clientes, setClientes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                setLoading(true);

                const [
                    clientesResponse,
                    solicitantesResponse
                ] = await Promise.all([

                    fetch(
                        "https://localhost:7208/api/Cliente"
                    ),

                    fetch(
                        "https://localhost:7208/api/Solicitante"
                    )

                ]);


                if (!clientesResponse.ok ||
                    !solicitantesResponse.ok) {

                    throw new Error(
                        "Error cargando datos"
                    );
                }


                const clientesData =
                    await clientesResponse.json();


                const solicitantesData =
                    await solicitantesResponse.json();


                setClientes(clientesData);
                setSolicitantes(solicitantesData);
                console.log(clientesData)


            }
            catch (err) {

                setError(err.message);

            }
            finally {

                setLoading(false);

            }

        };


        cargarDatos();

        console.log(clientes)
        console.log(solicitantes)

    }, [refreshKey]);


    if (loading) {

        return (
            <p>
                Cargando solicitantes...
            </p>
        );
    }

    return (
        <>
            <h3>
                Solicitantes
            </h3>

            {
                error &&
                <div className="error-msg">
                    {error}
                </div>
            }

            <div className="table-responsive">
                <table className="table table-hover align-middle">

                    <thead>

                        <tr>

                            <th>
                                Nombre
                            </th>

                            <th>
                                Cliente
                            </th>

                            <th>
                                Teléfono
                            </th>

                            <th>
                                Email
                            </th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            solicitantes.length === 0
                                ? (
                                    <tr>
                                        <td colSpan="5">
                                            No existen solicitantes
                                        </td>
                                    </tr>
                                )
                                : (
                                    solicitantes.map(s => (

                                        <tr key={s.id}>

                                            <td>
                                                {s.nombre}
                                            </td>

                                            <td>
                                                
                                                    {
                                                        clientes.find(
                                                            c => c.id === Number(s.idCliente)
                                                        )?.nombre
                                                    }
                                                
                                            </td>

                                            <td>
                                                {s.telefono}
                                            </td>

                                            <td>
                                                {s.email}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        onEditar(s)
                                                    }
                                                >
                                                    ✏️
                                                </button>

                                            </td>

                                        </tr>

                                    ))
                                )
                        }

                    </tbody>

                </table>
            </div>
        </>
    );
}