import { useEffect, useState } from "react";
import "../Styles/Cotizacion.css";

export default function FormObra({ onSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    cotizada: "",
    idCliente: "",
    idCotizacion: "",
    referencia: "",
    montoPactado: "",
    moneda: "ARS",
    formaPago: "",
    idSolicitante: null
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await fetch("https://localhost:7208/api/Cliente");
      if (!response.ok) throw new Error("Error cargando clientes");
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los clientes");
    }
  };

  useEffect(() => {
    if (formData.cotizada !== "si" || !formData.idCliente) {
      setCotizaciones([]);
      return;
    }
    cargarCotizaciones(formData.idCliente);
  }, [formData.idCliente, formData.cotizada]);

  const cargarCotizaciones = async (idCliente) => {
    try {
      const response = await fetch(`https://localhost:7208/api/cotizacion`);
      if (!response.ok) throw new Error("Error cargando cotizaciones");
      const data = await response.json();
      setCotizaciones(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las cotizaciones");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.cotizada) nuevosErrores.cotizada = "* Campo obligatorio";
    if (formData.cotizada === "si" && !formData.idCliente) nuevosErrores.idCliente = "* Seleccione cliente";
    if (formData.cotizada === "si" && !formData.idCotizacion) nuevosErrores.idCotizacion = "* Seleccione cotización";
    if (formData.cotizada === "no" && !formData.referencia.trim()) nuevosErrores.referencia = "* Campo obligatorio";
    if (formData.referencia.length > 100) nuevosErrores.referencia = "* Máximo 100 caracteres";
    if (!formData.montoPactado || Number(formData.montoPactado) <= 0) nuevosErrores.montoPactado = "* Monto inválido";
    if (!formData.formaPago) nuevosErrores.formaPago = "* Seleccione forma de pago";

    return nuevosErrores;
  };

  const limpiarFormulario = () => {
    setFormData({
      cotizada: "",
      idCliente: "",
      idCotizacion: "",
      referencia: "",
      montoPactado: "",
      moneda: "ARS",
      formaPago: "",
      idSolicitante: ""
    });
    setErrors({});
    setCotizaciones([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    setLoading(true);
    setError("");

    const cotizacionSeleccionada = cotizaciones.find(
      (c) => c.id === Number(formData.idCotizacion)
    );

    try {
      const body = {
        referencia: formData.cotizada === "si" ? cotizacionSeleccionada?.referencia : formData.referencia,
        idCliente: formData.idCliente,
        montoPactado: Number(formData.montoPactado),
        moneda: formData.moneda,
        formaPago: formData.formaPago,
        idSolicitante: null
      };

      const idEstadoComercial = formData.cotizada === "si" ? 2 : 1;

      const response = await fetch(
        `https://localhost:7208/api/Obra?id=${idEstadoComercial}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje || "Error al crear obra");
      }

      limpiarFormulario();
      if (onSuccess) onSuccess();
      alert("Obra creada correctamente");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card">
      <h3>Nueva Obra</h3>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="form-cotizacion" noValidate>
        <div className="form-grid">
          {/* FILA 1 */}
          <div className="form-group">
            <label>¿Está Cotizada?</label>
            <select name="cotizada" value={formData.cotizada} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
            {errors.cotizada && <span className="error-msg">{errors.cotizada}</span>}
          </div>

          <div className="form-group">
            <label>Cliente</label>
            <select name="idCliente" value={formData.idCliente} onChange={handleChange}>
              <option value="">Seleccione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errors.idCliente && <span className="error-msg">{errors.idCliente}</span>}
          </div>

          {formData.cotizada === "si" ? (
            <div className="form-group">
              <label>Cotización vinculada</label>
              <select name="idCotizacion" value={formData.idCotizacion} onChange={handleChange}>
                <option value="">Seleccione...</option>
                {cotizaciones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.prefijo}-{c.numero} - {c.referencia}
                  </option>
                ))}
              </select>
              {errors.idCotizacion && <span className="error-msg">{errors.idCotizacion}</span>}
            </div>
          ) : (
            <div className="form-group col-span-2">
              <label>Referencia de Obra</label>
              <input
                type="text"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
                placeholder="Ej. Remodelación Oficina Central"
              />
              {errors.referencia && <span className="error-msg">{errors.referencia}</span>}
            </div>
          )}

          {/* FILA 2 */}
          <div className="form-group">
            <label>Monto Pactado</label>
            <input
              type="number"
              step="0.01"
              name="montoPactado"
              value={formData.montoPactado}
              onChange={handleChange}
            />
            {errors.montoPactado && <span className="error-msg">{errors.montoPactado}</span>}
          </div>

          <div className="form-group">
            <label>Moneda</label>
            <select name="moneda" value={formData.moneda} onChange={handleChange}>
              <option value="ARS">ARS ($)</option>
              <option value="USD">USD (US$)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Forma de Pago</label>
            <select name="formaPago" value={formData.formaPago} onChange={handleChange}>
              <option value="">Seleccione...</option>
              <option value="Contado">Contado</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Cheque">Cheque</option>
              <option value="Financiado">Financiado / Cuotas</option>
            </select>
            {errors.formaPago && <span className="error-msg">{errors.formaPago}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Obra"}
          </button>
        </div>
      </form>
    </div>
  );
}