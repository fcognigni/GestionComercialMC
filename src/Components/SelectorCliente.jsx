
import { useEffect, useRef, useState } from "react";
import "../Styles/Selector.css"

export default function SelectorCliente({
    clientes,
    value,
    onSeleccionar
}) {
    const [abierto, setAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);

    const inputRef = useRef(null);
    const listaRef = useRef(null);

    // Cliente actualmente seleccionado
    const clienteActual = clientes.find(c => c.id === value);

    // Filtramos según lo escrito
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    // Abrir el selector
    const abrir = () => {
        setBusqueda("");
        setIndiceSeleccionado(0);
        setAbierto(true);
    };

    // Cerrar
    const cerrar = () => {
        setAbierto(false);
        setBusqueda("");
    };

    // Seleccionar cliente
    function seleccionar(cliente) {

        const evento = {
            target: {
                name: "idCliente",
                value: cliente.id
            }
        };

        onSeleccionar(evento);

        cerrar();
    };

    // Cuando se abre, ponemos el foco en el buscador
    useEffect(() => {
        if (abierto) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [abierto]);

    // Teclado
    const manejarTeclado = (e) => {

        if (e.key === "Escape") {
            e.preventDefault();
            cerrar();
            return;
        }


        console.log("esta por retornar")
        if (clientesFiltrados.length === 0)
            return;

        console.log("no retornó")

        if (e.key === "ArrowDown") {
            e.preventDefault();

            setIndiceSeleccionado(prev =>
                Math.min(prev + 1, clientesFiltrados.length - 1)
            );

            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();

            if (clientesFiltrados.length === 0)
                return;

            setIndiceSeleccionado(prev =>
                Math.max(prev - 1, 0)
            );

            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();

            if (clientesFiltrados.length === 0)
                return;

            const cliente = clientesFiltrados[indiceSeleccionado];

            if (cliente) {
                seleccionar(cliente);
            }
        }
    };

    // Cuando cambia el texto, volvemos al primer resultado
    useEffect(() => {
        setIndiceSeleccionado(0);
    }, [busqueda]);

    // Mantener visible el elemento seleccionado
    useEffect(() => {

        if (!listaRef.current)
            return;

        const elemento =
            listaRef.current.children[indiceSeleccionado];

        elemento?.scrollIntoView({
            block: "nearest"
        });

    }, [indiceSeleccionado]);

    return (
        <>
            {/* Campo que se ve en el formulario */}
            <div
                className="form-control"
                onClick={abrir}
                style={{
                    cursor: "pointer",
                    backgroundColor: "white"
                }}
            >
                {clienteActual
                    ? clienteActual.nombre
                    : "Seleccione un cliente..."}
            </div>


            {/* MODAL */}
            {abierto && (
                <div
                    className="selector-overlay"
                    onMouseDown={(e) => {
                        // Si se hace click fuera del modal, cerrar
                        if (e.target === e.currentTarget) {
                            cerrar();
                        }
                    }}
                >

                    <div className="selector-modal">

                        {/* Título */}
                        <div className="selector-header">
                            <h5>Seleccionar cliente</h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={cerrar}
                            />
                        </div>


                        {/* Buscador */}
                        <div className="selector-buscador">

                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control"
                                placeholder="Buscar cliente..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                onKeyDown={
                                    manejarTeclado}
                            />

                        </div>


                        {/* Lista */}
                        <div
                            ref={listaRef}
                            className="selector-lista"
                        >

                            {clientesFiltrados.length === 0 ? (

                                <div className="selector-sin-resultados">
                                    No se encontraron clientes
                                </div>

                            ) : (

                                clientesFiltrados.map((cliente, index) => (

                                    <div
                                        key={cliente.id}
                                        className={`selector-item ${index === indiceSeleccionado
                                            ? "selector-item-activo"
                                            : ""
                                            }`}
                                        onMouseEnter={() =>
                                            setIndiceSeleccionado(index)
                                        }
                                        onClick={() =>
                                            seleccionar(cliente)
                                        }
                                    >
                                        {cliente.nombre}
                                    </div>

                                ))

                            )}

                        </div>


                        {/* Pie */}
                        <div className="selector-footer">
                            <small>
                                ↑ ↓ para navegar · Enter para seleccionar · Esc para cerrar
                            </small>
                        </div>

                    </div>

                </div>
            )}
        </>
    );
}

