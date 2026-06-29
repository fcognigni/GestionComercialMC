import { useEffect, useState } from "react";
import "../Styles/Cotizacion.css";

export default function FormSolicitante({
    onSuccess,
    solicitanteSeleccionado,
    limpiarSeleccion
}) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const [clientes, setClientes] =
        useState([]);

    const [formData, setFormData] =
        useState({
            id: 0,
            nombre: "",
            idCliente: "",
            telefono: "",
            email: ""
        });

    // ------------------------
    // CARGAR CLIENTES
    // ------------------------

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

            console.log(clientes)

        }
        catch (err) {

            setError(err.message);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    // ------------------------
    // MODO EDICION
    // ------------------------

    useEffect(() => {

        if (!solicitanteSeleccionado)
            return;

        setFormData({

            id:
                solicitanteSeleccionado.id,

            nombre:
                solicitanteSeleccionado.nombre,

            idCliente:
                solicitanteSeleccionado.idCliente,

            telefono:
                solicitanteSeleccionado.telefono ?? null,

            email:
                solicitanteSeleccionado.email ?? null
        });

    }, [solicitanteSeleccionado]);

    // ------------------------
    // HANDLE CHANGE
    // ------------------------

    const handleChange = (e) => {

        const { name, value } =
            e.target;

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

    // ------------------------
    // VALIDAR
    // ------------------------

    const validar = () => {

        const nuevosErrores = {};

        if (!formData.nombre.trim()) {

            nuevosErrores.nombre =
                "* Nombre obligatorio";
        }

        if (/[^a-zA-Z0-9\s]+$/.test(formData.nombre) === true) {
            nuevosErrores.nombre =
                "* Solo letras se permiten en el nombre"
        }

        if (!formData.idCliente) {

            nuevosErrores.idCliente =
                "* Debe seleccionar un cliente";
        }

        if (!formData.telefono.trim()) {

            nuevosErrores.telefono =
                "* Teléfono obligatorio";
        }

        if (!formData.email.trim()) {

            nuevosErrores.email =
                "* Email obligatorio";
        }
        else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(formData.email)
        ) {

            nuevosErrores.email =
                "* Email inválido";
        }

        return nuevosErrores;
    };

    // ------------------------
    // LIMPIAR
    // ------------------------

    const limpiarFormulario = () => {

        setFormData({
            id: 0,
            nombre: "",
            idCliente: "",
            telefono: "",
            email: ""
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
            "¿Está seguro que desea eliminar este solicitante?"
        );


        if (!confirmar) {
            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `https://localhost:7208/api/Solicitante/Eliminar/${formData.id}`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Error eliminando solicitante"
                );

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


    // ------------------------
    // SUBMIT
    // ------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log("enviando")

        const nuevosErrores =
            validar();

        if (
            Object.keys(
                nuevosErrores
            ).length > 0
        ) {

            setErrors(
                nuevosErrores
            );

            return;
        }

        try {

            setLoading(true);

            const esEdicion =
                formData.id > 0;

            const response =
                await fetch(

                    esEdicion
                        ? "https://localhost:7208/api/Solicitante/Modificar"
                        : "https://localhost:7208/api/Solicitante",

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
                            id: formData.id,
                            nombre:
                                formData.nombre,

                            idCliente:
                                Number(
                                    formData.idCliente
                                ),

                            telefono:
                                formData.telefono,

                            email:
                                formData.email
                        })
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Error guardando solicitante"
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
        <>
            <h3>
                {
                    formData.id > 0
                        ? `Editando Solicitante #${formData.id}`
                        : "Nuevo Solicitante"
                }
            </h3>

            {
                error &&
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

                        <label>
                            Nombre
                        </label>

                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />

                        {
                            errors.nombre &&
                            <span className="error-msg">
                                {errors.nombre}
                            </span>
                        }

                    </div>

                    <div className="form-group">

                        <label>
                            Cliente
                        </label>

                        <select
                            name="idCliente"
                            value={formData.idCliente}
                            onChange={handleChange}
                        >

                            <option value="">
                                Seleccione...
                            </option>

                            {
                                clientes.map(c => (

                                    <option
                                        key={c.id}
                                        value={c.id}
                                    >
                                        {c.nombre}
                                    </option>

                                ))
                            }

                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Teléfono
                        </label>

                        <input
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <div className="form-actions">

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

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Guardando..."
                                : formData.id > 0
                                    ? "Actualizar Solicitante"
                                    : "Guardar Solicitante"
                        }

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
        </>
    );
}