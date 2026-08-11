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
        idSolicitante: null
    });

    // -----------------------------
    // CLIENTES
    // -----------------------------
    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {

            const response = await fetch(
                "https://localhost:7208/api/Cliente"
            );

            if (!response.ok)
                throw new Error("Error cargando clientes");

            const data = await response.json();

            setClientes(data);

        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los clientes");
        }
    };

    // -----------------------------
    // COTIZACIONES POR CLIENTE
    // -----------------------------
    useEffect(() => {

        if (
            formData.cotizada !== "si" ||
            !formData.idCliente
        ) {
            setCotizaciones([]);
            return;
        }

        cargarCotizaciones(formData.idCliente);

    }, [formData.idCliente, formData.cotizada]);

    const cargarCotizaciones = async (idCliente) => {

        try {

            const response = await fetch(
                `https://localhost:7208/api/cotizacion`
            );

            if (!response.ok)
                throw new Error("Error cargando cotizaciones");

            const data = await response.json();

            setCotizaciones(data);

        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar las cotizaciones");
        }
    };

    // -----------------------------
    // HANDLE CHANGE
    // -----------------------------
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // -----------------------------
    // VALIDACIONES
    // -----------------------------
    const validarFormulario = () => {

        const nuevosErrores = {};

        if (!formData.cotizada) {
            nuevosErrores.cotizada =
                "* Debe indicar si la obra está cotizada";
        }

        if (
            formData.cotizada === "si" &&
            !formData.idCliente
        ) {
            nuevosErrores.idCliente =
                "* Debe seleccionar un cliente";
        }

        if (
            formData.cotizada === "si" &&
            !formData.idCotizacion
        ) {
            nuevosErrores.idCotizacion =
                "* Debe seleccionar una cotización";
        }

        if (
            formData.cotizada === "no" &&
            !formData.referencia.trim()
        ) {
            nuevosErrores.referencia =
                "* La descripción es obligatoria";
        }

        if (formData.referencia.length > 100) {
            nuevosErrores.referencia =
                "* Máximo 100 caracteres";
        }

        if (
            !formData.montoPactado ||
            Number(formData.montoPactado) <= 0
        ) {
            nuevosErrores.montoPactado =
                "* Debe ingresar un monto válido";
        }

        return nuevosErrores;
    };

    // -----------------------------
    // LIMPIAR FORM
    // -----------------------------
    const limpiarFormulario = () => {

        setFormData({
            cotizada: "",
            idCliente: "",
            idCotizacion: "",
            referencia: "",
            montoPactado: "",
            idSolicitante: ""
        });

        setErrors({});
        setCotizaciones([]);
    };

    // -----------------------------
    // SUBMIT
    // -----------------------------
    const handleSubmit = async (e) => {

        e.preventDefault();


        const nuevosErrores =
            validarFormulario();

        console.log(
            "Errores:",
            nuevosErrores
        );

        if (
            Object.keys(nuevosErrores).length > 0
        ) {
            setErrors(nuevosErrores);
            return;
        }

        setLoading(true);
        setError("");

        const cotizacionSeleccionada =
            cotizaciones.find(
                c => c.id === Number(formData.idCotizacion)
            );

        try {
            const body = {
                referencia: formData.cotizada === "si"
                    ? cotizacionSeleccionada?.referencia
                    : formData.referencia,
                idCliente:
                    formData.idCliente,
                montoPactado:
                    Number(formData.montoPactado),
                idSolicitante:
                    null
            };

            const idEstadoComercial =
                formData.cotizada === "si"
                    ? 2 : 1

            const response = await fetch(
                `https://localhost:7208/api/Obra?id=${idEstadoComercial}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(body)
                }
            )

            if (!response.ok) {

                const mensaje =
                    await response.text();

                throw new Error(
                    mensaje ||
                    "Error al crear obra"
                );
            }

            limpiarFormulario();

            // refresca listado padre
            if (response.ok) {

                limpiarFormulario();

                if (onSuccess) onSuccess();
            }

            alert("Obra creada correctamente");

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Error inesperado"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-card">

            <h3>Nueva Obra</h3>

            {error && (
                <div className="error-msg">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="form-cotizacion"
                noValidate
            >

                <div className="form-grid">

                    {/* COTIZADA */}

                    <div className="form-group">
                        <label>Cotizada</label>

                        <select
                            name="cotizada"
                            value={formData.cotizada}
                            onChange={handleChange}
                        >
                            <option value="">
                                Seleccione...
                            </option>

                            <option value="si">
                                Sí
                            </option>

                            <option value="no">
                                No
                            </option>

                        </select>

                        {errors.cotizada &&
                            <span className="error-msg">
                                {errors.cotizada}
                            </span>
                        }

                    </div>

                    {/* CLIENTE */}



                    <div className="form-group">

                        <label>Cliente</label>

                        <select
                            name="idCliente"
                            value={formData.idCliente}
                            onChange={handleChange}
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

                        {errors.idCliente &&
                            <span className="error-msg">
                                {errors.idCliente}
                            </span>
                        }

                    </div>


                    {/* COTIZACION */}

                    {formData.cotizada === "si" && (

                        <div className="form-group">

                            <label>Cotización</label>

                            <select
                                name="idCotizacion"
                                value={formData.idCotizacion}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Seleccione...
                                </option>

                                {cotizaciones.map(c => (

                                    <option
                                        key={c.id}
                                        value={c.id}
                                    >
                                        {c.prefijo}-{c.numero} - {c.referencia}
                                    </option>

                                ))}

                            </select>

                            {errors.idCotizacion &&
                                <span className="error-msg">
                                    {errors.idCotizacion}
                                </span>
                            }

                        </div>
                    )}

                    {/* DESCRIPCION */}

                    {formData.cotizada === "no" && (
                        <div className="form-group col-span-2">

                            <label>
                                Referencia de Obra Iniciada
                            </label>

                            <input
                                type="text"
                                name="referencia"
                                value={formData.referencia}
                                onChange={handleChange}
                            />

                            {errors.referencia &&
                                <span className="error-msg">
                                    {errors.referencia}
                                </span>
                            }

                        </div>
                    )}

                    {/* MONTO */}

                    <div className="form-group">

                        <label>
                            Monto Pactado
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            name="montoPactado"
                            value={formData.montoPactado}
                            onChange={handleChange}
                        />

                        {errors.montoPactado &&
                            <span className="error-msg">
                                {errors.montoPactado}
                            </span>
                        }

                    </div>


                </div>

                <div className="form-actions">

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Guardando..."
                            : "Guardar Obra"}
                    </button>

                </div>

            </form>

        </div>
    );
}