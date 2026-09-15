import { useEffect, useState } from "react";
import "../Styles/Cotizacion.css";

export default function ListObra({ refreshKey }) {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ESTADO DE FILTROS
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroReferencia, setFiltroReferencia] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const cargarObras = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://localhost:7208/api/Obra");
      if (!response.ok) throw new Error("Error al obtener las obras");
      const data = await response.json();
      setObras(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarObras();
  }, [refreshKey]);

  // FILTRADO DINÁMICO
  const obrasFiltradas = obras.filter((obra) => {
    const coincideCliente = (obra.nombreCliente || "")
      .toLowerCase()
      .includes(filtroCliente.toLowerCase());

    const coincideReferencia = (obra.referencia || "")
      .toLowerCase()
      .includes(filtroReferencia.toLowerCase());

    const coincideFecha = filtroFecha
      ? obra.fechaCreacion?.startsWith(filtroFecha)
      : true;

    return coincideCliente && coincideReferencia && coincideFecha;
  });

  if (loading) return <p>Cargando obras...</p>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <>
      <h3>Listado de Obras</h3>

      {/* PANEL DE FILTROS */}
      <div className="filtros-grid">
        <div className="form-group">
          <label>Filtrar por Cliente</label>
          <input
            type="text"
            placeholder="Nombre del cliente..."
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Filtrar por Referencia</label>
          <input
            type="text"
            placeholder="Buscar referencia..."
            value={filtroReferencia}
            onChange={(e) => setFiltroReferencia(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Filtrar por Fecha</label>
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Referencia</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Estado Comercial</th>
            </tr>
          </thead>
          <tbody>
            {obrasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No se encontraron obras con los criterios ingresados
                </td>
              </tr>
            ) : (
              obrasFiltradas.map((obra) => (
                <tr key={obra.id}>
                  <td className="col-numero">{obra.id}</td>
                  <td>{obra.referencia}</td>
                  <td>{obra.nombreCliente ?? "-"}</td>
                  <td className="monto">
                    $
                    {Number(obra.montoPactado).toLocaleString("es-AR", {
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td>
                    <span className="badge-estado">
                      {obra.estadoComercial}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}