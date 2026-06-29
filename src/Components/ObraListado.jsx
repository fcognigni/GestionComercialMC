import { useEffect, useState } from "react";

export default function ListObra({ refreshKey }) {

    const [obras, setObras] = useState([]);
    const [OEC, setOEC] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const cargarObras = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "https://localhost:7208/api/Obra"
            );

            if (!response.ok) {
                throw new Error(
                    "Error al obtener las obras"
                );
            }

            const data = await response.json();

            setObras(data);

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Ocurrió un error"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        cargarObras();

    }, [refreshKey]);




    if (loading) {
        return <p>Cargando obras...</p>;
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
            <h3>Listado de Obras</h3>

            <table className="table table-hover align-middle">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Cliente</th>
                        <th>Monto</th>
                        <th>Estado Comercial</th>
                    </tr>
                </thead>

                <tbody>

                    {obras.length === 0 ? (

                        <tr>
                            <td colSpan="5">
                                No existen obras cargadas
                            </td>
                        </tr>

                    ) : (

                        obras.map((obra) => (

                            <tr key={obra.id}>

                                <td>
                                    {obra.id}
                                </td>

                                <td>
                                    {obra.descripcion}
                                </td>

                                <td>
                                    {obra.NombreCliente ?? "-"}
                                </td>

                                <td>
                                    $
                                    {Number(
                                        obra.montoPactado
                                    ).toLocaleString(
                                        "es-AR",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </td>

                                <td>
                                    {obra.NombreCliente}
                                </td>

                            </tr>

                        ))
                    )}

                </tbody>

            </table>
        </>
    );
}