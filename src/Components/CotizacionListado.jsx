import { useEffect, useState } from "react";
import SelectorCliente from "./SelectorCliente";
import DateFilterInput from "./DateFilterInput";
import "../Styles/Cotizacion.css";
import "../Styles/Cliente.css";

const API_URL = "https://localhost:7208";

export default function ListCotizacion({ refreshKey, onEditar }) {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtros, setFiltros] = useState({ idCliente: "", fechaDesde: "", fechaHasta: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/Cliente`);
        if (!response.ok) throw new Error("No se pudieron cargar los clientes.");
        setClientes(await response.json());
      } catch (err) { setError(err.message); }
    };
    cargarClientes();
  }, []);

  useEffect(() => {
    const cargarCotizaciones = async () => {      if ((filtros.fechaDesde && !filtros.fechaHasta) || (!filtros.fechaDesde && filtros.fechaHasta)) {
        setLoading(false);
        return;
      }
      if (filtros.fechaDesde && filtros.fechaHasta && filtros.fechaDesde > filtros.fechaHasta) {
        setLoading(false);
        setError("La fecha desde no puede ser posterior a la fecha hasta.");
        return;
      }
      const params = new URLSearchParams({ page: "1", pageSize: "50" });
      if (filtros.idCliente) params.set("idCliente", filtros.idCliente);
      if (filtros.fechaDesde) params.set("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.set("fechaHasta", filtros.fechaHasta);

      try {
        setLoading(true); setError("");
        const response = await fetch(`${API_URL}/api/Cotizacion?${params}`);
        if (!response.ok) throw new Error("No se pudieron cargar las cotizaciones.");
        const data = await response.json();
        setCotizaciones(data.items || []);
      } catch (err) { setError(err.message || "Error al cargar cotizaciones."); setCotizaciones([]); }
      finally { setLoading(false); }
    };
    cargarCotizaciones();
  }, [refreshKey, filtros]);

  const actualizarFiltro = ({ target: { name, value } }) => setFiltros(prev => ({ ...prev, [name]: value }));
  const formatoMonto = monto => Number(monto || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return <>
    <h3>Listado de Cotizaciones</h3>
    <div className="filtros-grid">
      <div className="form-group"><label>Cliente</label><SelectorCliente clientes={clientes} value={filtros.idCliente} onSeleccionar={actualizarFiltro} /></div>
      <div className="form-group"><label>Desde</label><DateFilterInput name="fechaDesde" value={filtros.fechaDesde} onChange={actualizarFiltro} /></div>
      <div className="form-group"><label>Hasta</label><DateFilterInput name="fechaHasta" value={filtros.fechaHasta} onChange={actualizarFiltro} /></div>
    </div>
    {error && <div className="error-msg">{error}</div>}
    <div className="table-container"><table className="custom-table"><thead><tr><th>Número</th><th>Cliente</th><th>Referencia</th><th>Fecha</th><th>Monto</th><th>Acciones</th></tr></thead>
      <tbody>{loading ? <tr><td colSpan="6" className="text-center">Cargando cotizaciones...</td></tr> : cotizaciones.length === 0 ? <tr><td colSpan="6" className="text-center">No se encontraron cotizaciones con los criterios ingresados.</td></tr> : cotizaciones.map(cotizacion => <tr key={cotizacion.id}><td className="col-numero">{cotizacion.prefijo}-{cotizacion.numero}</td><td>{cotizacion.nombreCliente || "-"}</td><td>{cotizacion.referencia}</td><td>{cotizacion.fecha ? new Date(cotizacion.fecha).toLocaleDateString("es-AR") : "-"}</td><td className="monto">{cotizacion.moneda || "$"} {formatoMonto(cotizacion.monto)}</td><td className="text-center"><button type="button" className="btn-edit" onClick={() => onEditar?.(cotizacion)} aria-label={`Editar cotización ${cotizacion.numero}`}>✏️</button></td></tr>)}</tbody>
    </table></div>
  </>;
}