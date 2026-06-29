import { useEffect, useMemo, useState } from "react";
import "../Styles/Cotizacion.css";

export default function WorkflowEstadoComercial({
    onSuccess,
    onObraSeleccionada
}) {

    const [clientes, setClientes] = useState([]);
    const [obras, setObras] = useState([]);
    const [estados, setEstados] = useState([]);
    const [historialObra, setHistorialObra] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingDatos, setLoadingDatos] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});


    const [formData, setFormData] = useState({
        idCliente: "",
        idObra: "",
        idEstadoComercial: "",
        observaciones: ""
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (!formData.idObra) {
            setHistorialObra([]);

            if (onObraSeleccionada) {
                onObraSeleccionada(null);
            }

            return;
        }

        cargarHistorialObra(formData.idObra);

        if (onObraSeleccionada) {
            onObraSeleccionada(formData.idObra);
        }
    }, [formData.idObra]);

    const cargarDatos = async () => {
        try {
            setLoadingDatos(true);
            setError("");

            const [resClientes, resObras, resEstados] = await Promise.all([
                fetch("https://localhost:7208/api/Cliente"),
                fetch("https://localhost:7208/api/Obra"),
                fetch("https://localhost:7208/api/EstadoComercial")
            ]);

            if (!resClientes.ok) throw new Error("Error cargando clientes");
            if (!resObras.ok) throw new Error("Error cargando obras");
            if (!resEstados.ok) throw new Error("Error cargando estados comerciales");

            const [dataClientes, dataObras, dataEstados] = await Promise.all([
                resClientes.json(),
                resObras.json(),
                resEstados.json()
            ]);

            setClientes(dataClientes || []);
            setObras(dataObras || []);
            setEstados(dataEstados || []);
        }
        catch (err) {
            console.error(err);
            setError(err.message || "Error cargando datos");
        }
        finally {
            setLoadingDatos(false);
        }
    };

    const cargarHistorialObra = async (idObra) => {
        try {
            const response = await fetch(
                `https://localhost:7208/api/ObraEstadoComercial/${idObra}`
            );

            if (!response.ok) {
                throw new Error("Error cargando historial de la obra");
            }

            const data = await response.json();
            setHistorialObra(data || []);
        }
        catch (err) {
            console.error(err);
            setError(err.message || "No se pudo cargar el historial");
            setHistorialObra([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setError("");

        setFormData(prev => {
            const next = {
                ...prev,
                [name]: value
            };

            if (name === "idCliente") {
                next.idObra = "";
                next.idEstadoComercial = "";
                setHistorialObra([]);
            }

            if (name === "idObra") {
                next.idEstadoComercial = "";
            }

            return next;
        });

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const obrasCliente = useMemo(() => {
        return obras.filter(o =>
            String(o.idCliente) === String(formData.idCliente)
        );
    }, [obras, formData.idCliente]);

    const ultimoEstado = historialObra.length > 0
        ? historialObra[0]
        : null;

    const estadoActual = useMemo(() => {
        if (!ultimoEstado) return null;

        return estados.find(e =>
            Number(e.id) === Number(ultimoEstado.idEstadoComercial)
        ) || null;
    }, [estados, ultimoEstado]);

    const sucesoresIds = useMemo(() => {
        if (!estadoActual?.sucesores) return [];

        return estadoActual.sucesores
            .split(",")
            .map(x => Number(x.trim()))
            .filter(n => !Number.isNaN(n));
    }, [estadoActual]);

    const sucesores = useMemo(() => {
        return estados.filter(e =>
            sucesoresIds.includes(Number(e.id))
        );
    }, [estados, sucesoresIds]);

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.idCliente) {
            nuevosErrores.idCliente = "* Debe seleccionar un cliente";
        }

        if (!formData.idObra) {
            nuevosErrores.idObra = "* Debe seleccionar una obra";
        }

        if (!formData.idObra) {
            nuevosErrores.idEstadoComercial = "* Debe seleccionar una obra primero";
        }
        else if (!estadoActual) {
            nuevosErrores.idEstadoComercial = "* No se pudo determinar el estado actual de la obra";
        }
        else if (sucesores.length === 0) {
            nuevosErrores.idEstadoComercial = "* El estado actual no tiene sucesores";
        }
        else if (!formData.idEstadoComercial) {
            nuevosErrores.idEstadoComercial = "* Debe seleccionar un nuevo estado comercial";
        }

        if (!formData.observaciones.trim()) {
            nuevosErrores.observaciones = "* Las observaciones son obligatorias";
        }
        else if (formData.observaciones.length > 500) {
            nuevosErrores.observaciones = "* Máximo 500 caracteres";
        }

        return nuevosErrores;
    };

    const limpiarFormulario = () => {
        setFormData({
            idCliente: "",
            idObra: "",
            idEstadoComercial: "",
            observaciones: ""
        });

        setErrors({});
        setHistorialObra([]);

        if (onObraSeleccionada) {
            onObraSeleccionada(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const nuevosErrores = validarFormulario();

        if (Object.keys(nuevosErrores).length > 0) {
            setErrors(nuevosErrores);
            return;
        }

        setErrors({});

        try {
            setLoading(true);

            const body = {
                idObra: Number(formData.idObra),
                idEstadoComercial: Number(formData.idEstadoComercial),
                observaciones: formData.observaciones.trim()
            };

            const response = await fetch(
                "https://localhost:7208/api/ObraEstadoComercial",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                let mensaje = "";

                try {
                    mensaje = await response.text();
                }
                catch {
                    mensaje = "";
                }

                throw new Error(
                    mensaje || "Error guardando el cambio de estado"
                );
            }

            await cargarHistorialObra(formData.idObra);

            if (onSuccess) {
                onSuccess();
            }

            limpiarFormulario();
        }
        catch (err) {
            console.error(err);

            if (err.name === "TypeError") {
                setError(
                    "No se pudo conectar con el servidor."
                );
            }
            else {
                setError(
                    err.message || "Error inesperado"
                );
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h3>Cambio de Estado Comercial</h3>

            {error && (
                <div className="error-msg">
                    {error}
                </div>
            )}

            {loadingDatos && (
                <div className="info-msg">
                    Cargando datos...
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-cotizacion" noValidate>
                <div className="form-grid">

                    <div className="form-group">
                        <label>Cliente</label>
                        <select
                            name="idCliente"
                            value={formData.idCliente}
                            onChange={handleChange}
                            className={errors.idCliente ? "input-error" : ""}
                        >
                            <option value="">Seleccione un cliente...</option>
                            {clientes.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.idCliente && <span className="error-msg">{errors.idCliente}</span>}
                    </div>

                    <div className="form-group">
                        <label>Obra</label>
                        <select
                            name="idObra"
                            value={formData.idObra}
                            onChange={handleChange}
                            className={errors.idObra ? "input-error" : ""}
                            disabled={!formData.idCliente}
                        >
                            <option value="">Seleccione una obra...</option>
                            {obrasCliente.map(obra => (
                                <option key={obra.id} value={obra.id}>
                                    {obra.descripcion}
                                </option>
                            ))}
                        </select>
                        {errors.idObra && <span className="error-msg">{errors.idObra}</span>}
                    </div>

                    {ultimoEstado && (
                        <div className="form-group col-span-2">
                            <div className="estado-actual">
                                Estado actual:
                                <strong> {ultimoEstado.Nombre || ultimoEstado.nombreEstadoComercial || "Sin nombre"}</strong>
                            </div>
                        </div>
                    )}

                    <div className="form-group col-span-2">
                        <label>Nuevo Estado Comercial</label>
                        <select
                            name="idEstadoComercial"
                            value={formData.idEstadoComercial}
                            onChange={handleChange}
                            className={errors.idEstadoComercial ? "input-error" : ""}
                            disabled={!formData.idObra || sucesores.length === 0}
                        >
                            <option value="">
                                {sucesores.length === 0
                                    ? "Sin sucesores disponibles"
                                    : "Seleccione un estado..."}
                            </option>

                            {sucesores.map(estado => (
                                <option key={estado.id} value={estado.id}>
                                    {estado.Nombre || estado.nombreEstadoComercial}
                                </option>
                            ))}
                        </select>

                        {errors.idEstadoComercial && (
                            <span className="error-msg">
                                {errors.idEstadoComercial}
                            </span>
                        )}
                    </div>

                    <div className="form-group col-span-2">
                        <label>Observaciones</label>
                        <textarea
                            name="observaciones"
                            rows="4"
                            value={formData.observaciones}
                            onChange={handleChange}
                            placeholder="Observaciones del cambio de estado..."
                            className={errors.observaciones ? "input-error" : ""}
                        />
                        {errors.observaciones && (
                            <span className="error-msg">
                                {errors.observaciones}
                            </span>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading || loadingDatos}
                    >
                        {loading
                            ? "Guardando..."
                            : "Registrar Cambio"}
                    </button>
                </div>
            </form>
        </>
    );
}