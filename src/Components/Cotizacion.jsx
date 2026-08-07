import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import '../Styles/Cotizacion.css'
import mammoth from 'mammoth'

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

  const handleNumeroChange = (e) => {

    const valor = formatearNumeroCotizacion(e.target.value);

    setFormData(prev => ({
      ...prev,
      numero: valor
    }));
  };

  const handleNumeroBlur = () => {

    let [prefijo = "", numero = ""] = formData.numero.split("-");

    prefijo = prefijo.padStart(4, "0");
    numero = numero.padStart(8, "0");

    setFormData(prev => ({
      ...prev,
      numero: `${prefijo}-${numero}`
    }));
  };

  const normalizarNumero = (numero) => {

    const soloDigitos =
      numero.replace("-", "");

    return Number(soloDigitos);
  };

  const formatearNumeroCotizacion = (texto) => {

    // dejamos únicamente números y un "-"
    texto = texto.replace(/[^\d-]/g, "");

    // sólo un guión
    const partes = texto.split("-");

    let prefijo = partes[0] || "";
    let numero = partes.slice(1).join("");

    // si todavía no escribió el guión
    if (partes.length === 1) {

      if (prefijo.length <= 4)
        return prefijo;

      numero = prefijo.substring(4);
      prefijo = prefijo.substring(0, 4);
    }

    prefijo = prefijo.substring(0, 4);
    numero = numero.substring(0, 8);

    if (texto.includes("-")) {
      return `${prefijo.padStart(4, "0")}-${numero}`;
    }

    return prefijo;
  }


  const validar = () => {

    const errores = {};

    // Número

    const regexNumero = /^\d{4}-\d{8}$/;

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

      const [prefijo, numero] =
        formData.numero.split("-");


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

              prefijo: Number(prefijo),

              numero:
                Number(numero),

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

  /* CARGA DE COTIZACION POR ARCHIVO */

  const [extractedData, setExtractedData] = useState({});

  function convertirFechaWord(fechaTexto) {

    const meses = {
      enero: "01",
      febrero: "02",
      marzo: "03",
      abril: "04",
      mayo: "05",
      junio: "06",
      julio: "07",
      agosto: "08",
      septiembre: "09",
      octubre: "10",
      noviembre: "11",
      diciembre: "12"
    };

    const match = fechaTexto.match(
      /(\d{1,2})\s+de\s+([A-Za-zÁÉÍÓÚáéíóú]+)\s+de\s+(\d{4})/
    );

    if (!match) return "";

    const dia = match[1].padStart(2, "0");
    const mes = meses[match[2].toLowerCase()];
    const anio = match[3];

    return `${anio}-${mes}-${dia}`;
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      try {
        // 1. Convertimos el archivo Word a HTML usando mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        const htmlContent = result.value;

        // 2. Usamos el DOMParser nativo del navegador para "leer" ese HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const bloques = [
          ...doc.querySelectorAll("p, td")
        ]
          .map(e => e.textContent.trim())
          .filter(t => t.length > 0);

        console.log(bloques);

        const presupuesto = bloques.find(t =>
          t.startsWith("Presupuesto")
        );

        let prefijo = "";
        let numero = "";

        if (presupuesto) {

          const match = presupuesto.match(/(\d{1,4})\s*-\s*(\d{1,8})/);

          if (match) {

            prefijo = match[1];

            numero = match[2];

          }

        }

        const regexFecha = /(?:.*?,\s*)?(\d{1,2})(?:\s+de)?\s+([A-Za-zÁÉÍÓÚáéíóú]+)\s+de\s+(\d{4})/

        const fechaTexto = bloques.find(t => regexFecha.test(t));

        let fecha;

        fecha = convertirFechaWord(fechaTexto)

        console.log(fecha)

        const indiceFecha =
          bloques.findIndex(t => t.includes("Córdoba"));

        const cliente =
          indiceFecha >= 0
            ? bloques[indiceFecha + 1]
            : "";

        const solicitante =
          bloques.find(t =>
            t.startsWith("Atte.:")
          )?.replace("Atte.:", "").trim();

        const referencia =
          bloques.find(t =>
            t.startsWith("REF:")
          )?.replace("REF:", "").trim();

        const indiceRef =
          bloques.findIndex(t =>
            t.startsWith("REF:")
          );

        let descripcion = "";

        if (
          indiceRef >= 0 &&
          indiceRef + 1 < bloques.length &&
          !bloques[indiceRef + 1].startsWith("TOTAL")
        ) {

          descripcion =
            bloques[indiceRef + 1];

        }

        const indiceMonto =
          bloques.findLastIndex(t =>
            t.startsWith("U$D") || t.startsWith("$") 
          );

        const montoTexto =
          indiceMonto >= 0
            ? bloques[indiceMonto]
            : "";

        const matchMonto =
          montoTexto.match(
            /^([A-Za-z$€U\$]+)\s*([\d.,]+)/
          );

        let moneda = "";
        let subtotal = "";

        if (matchMonto) {

          moneda = matchMonto[1];

          subtotal = matchMonto[2].replace(".", "").replace(",", ".")

        }

        const datosExtraidos = {

          prefijo,

          numero,

          fecha,

          cliente,

          solicitante,

          referencia,

          descripcion,

          subtotal,

          moneda

        };

        console.log(datosExtraidos);
        setExtractedData(datosExtraidos);

        // --- LÓGICA DE AUTOCOMPLETADO EN EL FORMULARIO ---
        // B) Buscar la coincidencia más cercana para el Cliente
        let idClienteDetectado = "";
        const clienteWord = datosExtraidos['cliente']?.toLowerCase() || "";

        if (clienteWord && clientes.length > 0) {
          // Buscamos un cliente en nuestro estado cuyo nombre esté incluido en el texto del Word o viceversa
          const clienteEncontrado = clientes.find(c =>
            c.nombre.toLowerCase().includes(clienteWord) ||
            clienteWord.includes(c.nombre.toLowerCase())
          );

          if (clienteEncontrado) {
            idClienteDetectado = clienteEncontrado.id.toString();
            console.log(idClienteDetectado) // Lo pasamos a string para el <select>
          }
        }

        // Actualizar el formData para que impacte en los inputs directamente
        setFormData(prev => ({

          ...prev,

          numero:
            formatearNumeroCotizacion(
              `${prefijo}-${numero}`
            ),

          fecha,

          referencia,

          descripcion,

          monto:
            subtotal,

          idCliente:
            idClienteDetectado

        }));

      } catch (error) {
        console.error("Error al procesar el archivo Word:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (

    <div className="content-card">
      <h3>Nueva Cotización</h3>

      <form onSubmit={handleSubmit} className="form-cotizacion" noValidate>
        <div className="form-grid">

          <div className="form-group">
            <input type="file" accept=".docx" onChange={handleFileUpload} />
            {/*
            <p>Datos de los Marcadores:</p>
            <pre>{JSON.stringify(extractedData, null, 1)}</pre>
            */}
          </div>

          {/* Número */}
          <div className="form-group">
            <label htmlFor="numero">Número de Cotización</label>
            <input type="text" id="numero"
              value={formData.numero}
              onChange={handleNumeroChange}
              onBlur={handleNumeroBlur}
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