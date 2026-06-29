import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import '../Styles/Cotizacion.css'

export default function FormCotizacion({
  onSuccess,
  cotizacionSeleccionada,
  limpiarSeleccion
}) {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [clientes, setClientes] =
    useState([]);

  const [formData, setFormData] =
    useState({
      id: 0,
      numero: "",
      idCliente: "",
      referencia: "",
      descripcion: "",
      fecha: "",
      monto: ""
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


  useEffect(() => {

    if (!cotizacionSeleccionada)
      return;

    setFormData({

      id:
        cotizacionSeleccionada.id,

      numero:
        cotizacionSeleccionada.numero,

      idCliente:
        cotizacionSeleccionada.idCliente,

      referencia:
        cotizacionSeleccionada.referencia,

      descripcion:
        cotizacionSeleccionada.descripcion || "",

      fecha:
        cotizacionSeleccionada.fecha
          ?.slice(0, 10),

      monto:
        cotizacionSeleccionada.monto
    });

  }, [cotizacionSeleccionada]);


  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

    if (errors[name]) {

      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const normalizarNumero = (numero) => {

    const soloDigitos =
      numero.replace("-", "");

    return Number(soloDigitos);
  };


  const validar = () => {

    const errores = {};

    // Número

    const regexNumero =
      /^\d+(-\d+)?$/;

    if (
      !regexNumero.test(
        formData.numero.trim()
      )
    ) {
      errores.numero =
        "* Formato inválido";
    }

    // Cliente
    if (!formData.idCliente) {
      errores.idCliente =
        "* Debe seleccionar un cliente";
    }

    // Referencia
    if (!formData.referencia.trim()) {
      errores.referencia =
        "* Referencia obligatoria";
    }
    else if (
      formData.referencia.length > 100
    ) {
      errores.referencia =
        "* Máximo 100 caracteres";
    }

    // Descripción
    if (
      formData.descripcion &&
      formData.descripcion.length > 1000
    ) {
      errores.descripcion =
        "* Máximo 1000 caracteres";
    }

    // Fecha
    if (!formData.fecha) {
      errores.fecha =
        "* Fecha obligatoria";
    }

    const montoTexto =
      formData.monto.trim();

    const regexMonto =
      /^\d+([.,]\d{1,2})?$/;

    if (
      !regexMonto.test(montoTexto) ||
      parseFloat(
        montoTexto.replace(",", ".")
      ) <= 0
    ) {

      errores.monto =
        "* Monto inválido";
    }

    return errores;
  };


  const limpiarFormulario = () => {

    setFormData({

      id: 0,
      numero: "",
      idCliente: "",
      idObra: "",
      referencia: "",
      descripcion: "",
      fecha: "",
      monto: "",
      formal: false
    });

    setErrors({});

    if (limpiarSeleccion) {
      limpiarSeleccion();
    }
  };

  let monto;

  const handleSubmit = async (e) => {

    e.preventDefault();

    const nuevosErrores =
      validar();

    if (
      Object.keys(nuevosErrores)
        .length > 0
    ) {

      setErrors(nuevosErrores);
      return;
    }

    try {

      setLoading(true);

      setError("");

      const esEdicion =
        formData.id > 0;

      const numeroNormalizado =
        normalizarNumero(
          formData.numero
        );

      const monto =
        parseFloat(
          formData.monto.replace(",", ".")
        );


      const response =
        await fetch(

          esEdicion
            ? `https://localhost:7208/api/Cotizacion/${formData.id}`
            : "https://localhost:7208/api/Cotizacion",

          {
            method:
              esEdicion
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              numero:
                numeroNormalizado,

              idCliente:
                Number(formData.idCliente),

              referencia:
                formData.referencia,

              descripcion:
                formData.descripcion,

              fecha:
                formData.fecha,

              monto:
                monto,

              formal:
                formData.formal
            })
          }
        );

      if (!response.ok) {

        throw new Error(
          "Error guardando cotización"
        );
      }

      limpiarFormulario();

      if (onSuccess) {
        onSuccess();
      }

    }
    catch (err) {

      setError(
        err.message
      );

    }
    finally {

      setLoading(false);

    }
  };


  return (

    <div className="content-card">
      <h3>Nueva Cotización</h3>

      <form onSubmit={handleSubmit} className="form-cotizacion" noValidate>
        <div className="form-grid">

          {/* Número */}
          <div className="form-group">
            <label htmlFor="numero">Número de Cotización</label>
            <input type="text" id="numero"
              value={formData.numero}
              onChange={handleChange}
              name="numero" className={errors.numero ? 'input-error' : ''} />
            {errors.numero && <span className="error-msg">{errors.numero}</span>}
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="fecha">Fecha y Hora</label>
            <input type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={errors.fecha ? 'input-error' : ''} />
            {errors.fecha && <span className="error-msg">{errors.fecha}</span>}
          </div>

          {/* IdCliente (Simulado con un select) */}
          <div className="form-group">
            <label htmlFor="idCliente">Cliente</label>
            <select
              name="idCliente"
              value={formData.idCliente}
              onChange={handleChange}
              className={
                errors.idCliente
                  ? "input-error"
                  : ""
              }
            >

              <option value="">
                Seleccione...
              </option>

              {clientes.map(cliente => (

                <option
                  key={cliente.id}
                  value={cliente.id}
                >
                  {cliente.nombre}
                </option>

              ))}

            </select>
            {errors.idCliente && <span className="error-msg">{errors.idCliente}</span>}
          </div>

          {/* Referencia */}
          <div className="form-group col-span-2">
            <label htmlFor="referencia">Referencia</label>
            <input type="text" id="referencia"
              value={formData.referencia}
              onChange={handleChange}
              name="referencia" placeholder="Ej: Materiales gruesos etapa 1" className={errors.referencia ? 'input-error' : ''} />
            {errors.referencia && <span className="error-msg">{errors.referencia}</span>}
          </div>

          {/* Monto */}
          <div className="form-group">
            <label htmlFor="monto">Monto ($)</label>
            <input type="number" step="0.01" id="monto"
              value={formData.monto}
              onChange={handleChange}
              name="monto" placeholder="0.00" className={errors.monto ? 'input-error' : ''} />
            {errors.monto && <span className="error-msg">{errors.monto}</span>}
          </div>

          {/* Descripción */}
          <div className="form-group col-span-2">
            <label htmlFor="descripcion">Descripción detallada</label>
            <textarea id="descripcion" name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3" placeholder="Detalles opcionales de la cotización..." className={errors.descripcion ? 'input-error' : ''}></textarea>
            {errors.descripcion && <span className="error-msg">{errors.descripcion}</span>}
          </div>

        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {
              loading
                ? "Guardando..."
                : formData.id > 0
                  ? "Actualizar Cotización"
                  : "Guardar Cotización"
            }
          </button>
          {
            formData.id > 0 &&
            (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={
                  limpiarFormulario
                }
              >
                Cancelar
              </button>
            )
          }
        </div>
      </form>
    </div>


  )


}