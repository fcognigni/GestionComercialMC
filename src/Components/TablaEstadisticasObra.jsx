import React from "react";

const meses = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const formatoPesos = (valor) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(valor ?? 0);

const porcentaje = (valor) =>
    `${Number(valor ?? 0).toFixed(1)} %`;

export default function TablaEstadisticasObras({
    datos = []
}) {
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                    <tr>
                        <th>Período</th>
                        <th>Cliente</th>
                        <th>Obras</th>
                        <th>Monto</th>
                        <th>Facturadas</th>
                        <th>Pendientes</th>
                        <th>% facturadas</th>
                        <th>Con O.C.</th>
                        <th>% O.C.</th>
                        <th>Ranking</th>
                    </tr>
                </thead>

                <tbody>
                    {datos.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="text-center py-4">
                                No hay datos para mostrar
                            </td>
                        </tr>
                    ) : (
                        datos.map((item, index) => (
                            <tr
                                key={`${item.anio}-${item.mes}-${item.idCliente}-${index}`}
                            >
                                <td>
                                    <div className="fw-semibold">
                                        {meses[item.mes]}
                                    </div>

                                    <small className="text-muted">
                                        {item.anio}
                                    </small>
                                </td>

                                <td>
                                    <div className="fw-semibold">
                                        {item.nombreCliente}
                                    </div>
                                </td>

                                <td>
                                    <span className="fw-semibold">
                                        {item.cantidadObras}
                                    </span>

                                    <small className="text-muted d-block">
                                        de {item.totalObrasMes}
                                    </small>
                                </td>

                                <td>
                                    {formatoPesos(item.montoObrasPesos)}
                                </td>

                                <td>
                                    <span className="text-success fw-semibold">
                                        {item.cantidadFacturadas}
                                    </span>

                                    <small className="text-muted d-block">
                                        {porcentaje(item.porcentajeFacturadas)}
                                    </small>
                                </td>

                                <td>
                                    <span className="text-warning fw-semibold">
                                        {item.cantidadPendientesFacturar}
                                    </span>

                                    <small className="text-muted d-block">
                                        {porcentaje(
                                            item.porcentajePendientesFacturar
                                        )}
                                    </small>
                                </td>

                                <td>
                                    {porcentaje(item.porcentajeFacturadas)}
                                </td>

                                <td>
                                    {item.totalObrasConOCCliente}
                                </td>

                                <td>
                                    {porcentaje(
                                        item.porcentajeObrasConOrdenCompra
                                    )}
                                </td>

                                <td>
                                    {item.rankingObrasMes <= 10 ? (
                                        <span className="badge bg-success">
                                            #{item.rankingObrasMes}
                                        </span>
                                    ) : (
                                        <span>
                                            #{item.rankingObrasMes}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>
        </div>
    );
}