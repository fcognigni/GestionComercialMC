import { useEffect, useState } from "react";
import SelectorCliente from "./SelectorCliente";
import "../Styles/Cotizacion.css";

export default function ListObra({ refreshKey }) {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [obrasFiltradas, setObrasfiltradas] = useState([])


  const [clientes, setClientes] = useState(obras);

  const [filtros, setFiltros] = useState({
    idCliente: "",
    referencia: "",
    fechaDesde: "",
    fechaHasta: ""
  });

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


  const actualizarFiltro = (e) => {

    const { name, value } = e.target;

    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));

    console.log(estados)

    setPagina(1);
  }

  const cargarObras = async ({
    idCliente,
    page = 1,
    pageSize = 50
  } = {}) => {

    const params = new URLSearchParams();

    if (idCliente) {
      params.append("IdCliente", idCliente)
    }

    params.append("page", page);
    params.append("pageSize", pageSize);

    console.log(params)

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
          `https://localhost:7208/api/Obra?${params}`
        );

      if (!response.ok) {

        throw new Error(
          "Error al obtener obras"
        );
      }

      const data =
        await response.json();

      console.log("DATA", JSON.stringify(data, null, 2))
      setObras(data.items);

    }
    catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Error al cargar obras"
      );
    }
    finally {

      setLoading(false);
    }
  };

  const filtrarObras = () => {
    
  }

  useEffect(() => {
    cargarObras();
  }, [refreshKey, filtros]);

  useEffect(() => {
    filtrarObras()
  }, [filtros]
  )


  if (loading) return <p>Cargando obras...</p>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <>
      <h3>Listado de Obras</h3>

      {/* PANEL DE FILTROS */}
      <div className="filtros-grid">
        <div className="form-group">
          <label>Filtrar por Cliente</label>
          <SelectorCliente
            clientes={clientes}
            value={filtros.idCliente}
            onSeleccionar={actualizarFiltro}
          />
        </div>

        <div className="form-group">
          <label>Filtrar por Referencia</label>
          <input
            type="text"
            placeholder="Buscar referencia..."
            value={filtros.referencia}
            onChange={(e) => setFiltroReferencia(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Desde</label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => setFiltros(e.target.value)}
          />
          <label>Hasta</label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => setFiltros(e.target.value)}
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
            {obras.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No se encontraron obras con los criterios ingresados
                </td>
              </tr>
            ) : (
              obras.map((obra) => (
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