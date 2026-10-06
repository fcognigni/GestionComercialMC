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

export default function TablaEstadisticasCotizaciones({
    datos = []
}) {
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                    <tr>
                        <th>Período</th>
                        <th>Cliente</th>
                        <th>Cotizaciones</th>
                        <th>Monto cotizado</th>
                        <th>% del mes</th>
                        <th>Llevadas a obra</th>
                        <th>% conversión</th>
                        <th>Ranking</th>
                    </tr>
                </thead>

                <tbody>
                    {datos.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
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
                                        {item.cantidadCotizaciones}
                                    </span>

                                    <small className="text-muted d-block">
                                        de {item.totalCotizacionesMes}
                                    </small>
                                </td>

                                <td>
                                    {formatoPesos(item.montoCotizadoPesos)}
                                </td>

                                <td>
                                    {porcentaje(item.porcentajeCotizacionesMes)}
                                </td>

                                <td>
                                    {item.cotizacionesLlevadasAObra}
                                </td>

                                <td>
                                    <span className="fw-semibold">
                                        {porcentaje(item.porcentajeLlevadasAObra)}
                                    </span>
                                </td>

                                <td>
                                    {item.rankingCantidadMes <= 10 ? (
                                        <span className="badge bg-success">
                                            #{item.rankingCantidadMes}
                                        </span>
                                    ) : (
                                        <span>
                                            #{item.rankingCantidadMes}
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