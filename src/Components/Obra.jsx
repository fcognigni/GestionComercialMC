import { useEffect, useState } from "react";
import "../Styles/Cotizacion.css";

export default function FormObra({ onSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    cotizada: "", idCliente: "", idCotizacion: "", referencia: "",
    montoPactado: "", idMoneda: "1"
  });

  useEffect(() => { cargarClientes(); }, []);
  useEffect(() => {
    if (formData.cotizada !== "si" || !formData.idCliente) {
      setCotizaciones([]);
      return;
    }
    cargarCotizaciones(formData.idCliente);
  }, [formData.idCliente, formData.cotizada]);

  const cargarClientes = async () => {
    try {
      const response = await fetch("https://localhost:7208/api/Cliente");
      if (!response.ok) throw new Error("Error cargando clientes");
      setClientes(await response.json());
    } catch { setError("No se pudieron cargar los clientes"); }
  };

  const cargarCotizaciones = async (idCliente) => {
    try {
      const response = await fetch(`https://localhost:7208/api/Cotizacion?idCliente=${idCliente}`);
      if (!response.ok) throw new Error("Error cargando cotizaciones");
      const data = await response.json();
      setCotizaciones((data.items || []).filter(c => !c.idObra));
    } catch { setError("No se pudieron cargar las cotizaciones"); }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCotizacionChange = ({ target: { value } }) => {
    const cotizacion = cotizaciones.find(c => c.id === Number(value));
    setFormData(prev => ({
      ...prev,
      idCotizacion: value,
      referencia: cotizacion?.referencia || prev.referencia,
      montoPactado: cotizacion ? String(cotizacion.monto) : prev.montoPactado,
      idMoneda: cotizacion ? String(cotizacion.idMoneda) : prev.idMoneda
    }));
    if (errors.idCotizacion) setErrors(prev => ({ ...prev, idCotizacion: "" }));
  };

  const validarFormulario = () => {
    const errores = {};
    if (!formData.cotizada) errores.cotizada = "* Campo obligatorio";
    if (!formData.idCliente) errores.idCliente = "* Seleccione cliente";
    if (formData.cotizada === "si" && !formData.idCotizacion) errores.idCotizacion = "* Seleccione cotización";
    if (formData.cotizada === "no" && !formData.referencia.trim()) errores.referencia = "* Campo obligatorio";
    if (formData.referencia.length > 100) errores.referencia = "* Máximo 100 caracteres";
    if (!formData.montoPactado || Number(formData.montoPactado) <= 0) errores.montoPactado = "* Monto inválido";
    return errores;
  };

  const limpiarFormulario = () => {
    setFormData({ cotizada: "", idCliente: "", idCotizacion: "", referencia: "", montoPactado: "", idMoneda: "1" });
    setErrors({}); setCotizaciones([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();
    if (Object.keys(nuevosErrores).length) return setErrors(nuevosErrores);
    const cotizacion = cotizaciones.find(c => c.id === Number(formData.idCotizacion));
    const body = {
      referencia: formData.cotizada === "si" ? cotizacion.referencia : formData.referencia.trim(),
      idCliente: Number(formData.idCliente),
      montoPactado: Number(formData.montoPactado),
      idMoneda: Number(formData.idMoneda),
      idSolicitante: cotizacion?.idSolicitante ?? null,
      idCotizacion: formData.cotizada === "si" ? Number(formData.idCotizacion) : null,
      idEstadoComercial: formData.cotizada === "si" ? 2 : 1
    };
    try {
      setLoading(true); setError("");
      const response = await fetch("https://localhost:7208/api/Obra", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.mensaje || "Error al crear obra");
      limpiarFormulario(); onSuccess?.(); alert("Obra creada correctamente");
    } catch (err) { setError(err.message || "Error inesperado"); }
    finally { setLoading(false); }
  };

  return <div className="content-card">
    <h3>Nueva Obra</h3>
    {error && <div className="error-msg">{error}</div>}
    <form onSubmit={handleSubmit} className="form-cotizacion" noValidate>
      <div className="form-grid">
        <div className="form-group"><label>¿Está Cotizada?</label><select name="cotizada" value={formData.cotizada} onChange={handleChange}><option value="">Seleccione...</option><option value="si">Sí</option><option value="no">No</option></select>{errors.cotizada && <span className="error-msg">{errors.cotizada}</span>}</div>
        <div className="form-group"><label>Cliente</label><select name="idCliente" value={formData.idCliente} onChange={handleChange}><option value="">Seleccione...</option>{clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select>{errors.idCliente && <span className="error-msg">{errors.idCliente}</span>}</div>
        {formData.cotizada === "si" ? <div className="form-group"><label>Cotización vinculada</label><select name="idCotizacion" value={formData.idCotizacion} onChange={handleCotizacionChange} disabled={!formData.idCliente}><option value="">Seleccione...</option>{cotizaciones.map(c => <option key={c.id} value={c.id}>{c.prefijo}-{c.numero} - {c.referencia}</option>)}</select>{errors.idCotizacion && <span className="error-msg">{errors.idCotizacion}</span>}</div> : <div className="form-group col-span-2"><label>Referencia de obra</label><input type="text" name="referencia" value={formData.referencia} onChange={handleChange} />{errors.referencia && <span className="error-msg">{errors.referencia}</span>}</div>}
        <div className="form-group"><label>Monto pactado</label><input type="number" step="0.01" name="montoPactado" value={formData.montoPactado} onChange={handleChange} />{errors.montoPactado && <span className="error-msg">{errors.montoPactado}</span>}</div>
        <div className="form-group"><label>Moneda</label><select name="idMoneda" value={formData.idMoneda} onChange={handleChange}><option value="1">ARS ($)</option><option value="2">USD (US$)</option></select></div>
      </div><div className="form-actions"><button type="submit" className="btn-submit" disabled={loading}>{loading ? "Guardando..." : "Guardar obra"}</button></div>
    </form>
  </div>;
}