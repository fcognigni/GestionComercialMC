import { useEffect, useState } from "react";
import "../Styles/Cotizacion.css";

export default function FormCliente({
    onSuccess,
    clienteSeleccionado,
    limpiarSeleccion
}) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        id: 0,
        nombre: "",
        cuit: "",
        localidad: "",
        calle: "",
        numero: "",
        activo: true
    });

    useEffect(() => {

        if (!clienteSeleccionado) return;

        setFormData({
            id: clienteSeleccionado.id,
            nombre: clienteSeleccionado.nombre || "",
            cuit: clienteSeleccionado.cuit || "",
            localidad: clienteSeleccionado.localidad ?? null,
            calle: clienteSeleccionado.calle ?? null,
            numero: clienteSeleccionado.numero ?? null,
            activo: clienteSeleccionado.activo
        });

    }, [clienteSeleccionado]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const validarCUIT = (cuit) => {

        const cuitLimpio =
            cuit.replace(/[-\s]/g, "");

        if (!/^\d{11}$/.test(cuitLimpio)) {
            return false;
        }

        const multiplicadores =
            [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

        let suma = 0;

        for (let i = 0; i < 10; i++) {

            suma +=
                Number(cuitLimpio[i]) *
                multiplicadores[i];
        }

        let resto =
            11 - (suma % 11);

        if (resto === 11) {
            resto = 0;
        }

        if (resto === 10) {
            resto = 9;
        }

        return (
            resto ===
            Number(cuitLimpio[10])
        );
    };

    const validar = () => {

        const nuevosErrores = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre =
                "* El nombre es obligatorio";
        }

        if (/[^a-zA-Z0-9.\s&]/.test(formData.nombre) === true) {
            nuevosErrores.nombre =
                "* Solo letras, números, o caracteres como . - & se permiten en el nombre"
        }

        if (!validarCUIT(formData.cuit)) {

            nuevosErrores.cuit =
                "* CUIT inválido";
        }

        if (
            formData.numero &&
            isNaN(formData.numero)
        ) {
            nuevosErrores.numero =
                "* Debe ser numérico";
        }

        return nuevosErrores;
    };

    const limpiarFormulario = () => {

        setFormData({
            id: 0,
            nombre: "",
            cuit: "",
            localidad: "",
            calle: "",
            numero: "",
            activo: true
        });

        setErrors({});

        if (limpiarSeleccion) {
            limpiarSeleccion();
        }
    };


    const handleEliminar = async () => {

        if (!formData.id) {
            return;
        }


        const confirmar = window.confirm(
            "¿Está seguro que desea eliminar este cliente?"
        );


        if (!confirmar) {
            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `https://localhost:7208/api/Cliente/Eliminar/${formData.id}`,
                {
                    method: "PUT"
                }
            );


           if (!response.ok) {

    const errorData = await response.text();

    console.log("Respuesta API:", errorData);

    throw new Error(errorData);

}


            const data = await response.json();


            alert(data.mensaje);
            limpiarFormulario();


        }
        catch (error) {

            setError(error.message);

        }
        finally {

            setLoading(false);

        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const nuevosErrores =
            validar();

        if (
            Object.keys(nuevosErrores).length > 0
        ) {
            setErrors(nuevosErrores);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const esEdicion =
                formData.id > 0;

            const response =
                await fetch(
                    esEdicion
                        ? "https://localhost:7208/api/Cliente/Modificar"
                        : "https://localhost:7208/api/Cliente",
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
                            id:
                                formData.id,
                            nombre:
                                formData.nombre,
                            cuit:
                                formData.cuit,
                            localidad:
                                formData.localidad,
                            calle:
                                formData.calle,
                            numero:
                                formData.numero
                                    ? Number(formData.numero)
                                    : null,
                            activo:
                                formData.activo
                        })
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Error al guardar cliente"
                );
            }

            limpiarFormulario();

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="content-card">
            <h3>
                {formData.id > 0
                    ? "Editar Cliente"
                    : "Nuevo Cliente"}
            </h3>

            {error &&
                <div className="error-msg">
                    {error}
                </div>
            }

            <form
                onSubmit={handleSubmit}
                className="form-cotizacion"
            >

                <div className="form-grid">

                    <div className="form-group">
                        <label>Nombre</label>

                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />

                        {errors.nombre &&
                            <span className="error-msg">
                                {errors.nombre}
                            </span>
                        }
                    </div>

                    <div className="form-group">
                        <label>CUIT</label>

                        <input
                            name="cuit"
                            type="text"
                            value={formData.cuit}
                            onChange={handleChange}
                        />

                        {errors.cuit &&
                            <span className="error-msg">
                                {errors.cuit}
                            </span>
                        }
                    </div>

                    <div className="form-group">
                        <label>Localidad</label>

                        <input
                            name="localidad"
                            value={formData.localidad}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Calle</label>

                        <input
                            name="calle"
                            value={formData.calle}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Número</label>

                        <input
                            type="number"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                        />
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
                            : formData.id > 0
                                ? "Actualizar Cliente"
                                : "Guardar Cliente"}
                    </button>

                    {
                        formData.id > 0 &&
                        (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleEliminar}
                                disabled={loading}
                            >
                                Eliminar
                            </button>
                        )
                    }

                </div>

            </form>
        </div>
    );
}