import { useEffect, useState } from "react";
import SelectorCliente from "./SelectorCliente";
import DateFilterInput from "./DateFilterInput";
import "../Styles/Cotizacion.css";
import "../Styles/Cliente.css";

const API_URL = "https://localhost:7208";

export default function Informes() {
  const [clientes, setClientes] = useState([]);
  const [estadosComerciales, setEstadosComerciales] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({ idCliente: "", idEstadoComercial: "", fechaDesde: "", fechaHasta: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        const [clientesResponse, estadosResponse] = await Promise.all([
          fetch(`${API_URL}/api/Cliente`),
          fetch(`${API_URL}/api/EstadoComercial`)
        ]);
        if (!clientesResponse.ok || !estadosResponse.ok) throw new Error("No se pudieron cargar los filtros.");
        setClientes(await clientesResponse.json());
        setEstadosComerciales(await estadosResponse.json());
      } catch (err) { setError(err.message); }
    };
    cargarOpciones();
  }, []);

  useEffect(() => {
    const cargarMovimientos = async () => {      if ((filtros.fechaDesde && !filtros.fechaHasta) || (!filtros.fechaDesde && filtros.fechaHasta)) {
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
      if (filtros.idEstadoComercial) params.set("idEstadoComercial", filtros.idEstadoComercial);
      if (filtros.fechaDesde) params.set("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.set("fechaHasta", filtros.fechaHasta);

      try {
        setLoading(true); setError("");
        const response = await fetch(`${API_URL}/api/ObraEstadoComercial?${params}`);
        if (!response.ok) throw new Error("No se pudo cargar el historial comercial.");
        const data = await response.json();
        setMovimientos(data.items || []);
      } catch (err) { setError(err.message || "Error al cargar el historial comercial."); setMovimientos([]); }
      finally { setLoading(false); }
    };
    cargarMovimientos();
  }, [filtros]);

  const actualizarFiltro = ({ target: { name, value } }) => setFiltros(prev => ({ ...prev, [name]: value }));

  return <main className="main-content container-fluid py-4">
    <div className="content-card">
      <h3>Historial de estados comerciales</h3>
      <div className="filtros-grid">
        <div className="form-group"><label>Cliente</label><SelectorCliente clientes={clientes} value={filtros.idCliente} onSeleccionar={actualizarFiltro} /></div>
        <div className="form-group"><label>Estado comercial</label><select name="idEstadoComercial" value={filtros.idEstadoComercial} onChange={actualizarFiltro}><option value="">Todos los estados</option>{estadosComerciales.map(estado => <option key={estado.id} value={estado.id}>{estado.nombre}</option>)}</select></div>
        <div className="form-group"><label>Desde</label><DateFilterInput name="fechaDesde" value={filtros.fechaDesde} onChange={actualizarFiltro} /></div>
        <div className="form-group"><label>Hasta</label><DateFilterInput name="fechaHasta" value={filtros.fechaHasta} onChange={actualizarFiltro} /></div>
      </div>
      {error && <div className="error-msg">{error}</div>}
      <div className="table-container"><table className="custom-table"><thead><tr><th>Referencia</th><th>Cliente</th><th>Estado</th><th>Observaciones</th><th>Fecha</th><th>Vigencia</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan="6" className="text-center">Cargando historial...</td></tr> : movimientos.length === 0 ? <tr><td colSpan="6" className="text-center">No se encontraron movimientos con los criterios ingresados.</td></tr> : movimientos.map(movimiento => <tr key={movimiento.id}><td>{movimiento.referencia}</td><td>{movimiento.cliente}</td><td><span className="badge-estado">{movimiento.nombreEstadoComercial}</span></td><td>{movimiento.observaciones || "Sin observaciones"}</td><td>{movimiento.fecha ? new Date(movimiento.fecha).toLocaleString("es-AR") : "-"}</td><td>{movimiento.activo === false ? "Anulado" : "Vigente"}</td></tr>)}</tbody>
      </table></div>
    </div>
  </main>;
}