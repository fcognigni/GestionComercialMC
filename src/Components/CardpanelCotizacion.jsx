import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import '../Styles/Cardpanel.css'
import ClienteForm from '../Funciones/ClienteForm'
import ListCotizacion from "./CotizacionListado";
import FormCotizacion from "./Cotizacion";

const CardpanelCotizacion = () => {

    const [refreshKey, setRefreshKey] =
        useState(0);

    const actualizarListado = () => {
        setRefreshKey(prev => prev + 1);
    };

    const alternarFormulario = () => {
        setFormAbierto(prev => !prev);
    };

    const [formAbierto, setFormAbierto] = useState(false);

    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);

    return (
        <main className="main-content">

            <div className="obras-container">



                {/* CARD FORMULARIO */}
                <div
                    className={`content-card obra-form-card ${formAbierto ? "obra-form-abierto" : "obra-form-cerrado"
                        }`}
                >

                    {/* Encabezado siempre visible */}
                    <div
                        className="obra-form-header"
                        onClick={alternarFormulario}
                    >
                        <h3>Formulario cotización</h3>

                        <button
                            type="button"
                            className="obra-form-toggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                alternarFormulario();
                            }}
                            aria-label={
                                formAbierto
                                    ? "Plegar formulario"
                                    : "Desplegar formulario"
                            }
                        >
                            <FaChevronDown />
                        </button>
                    </div>


                    {/* Contenido animado */}
                    <div className="obra-form-contenido-wrapper">
                        <div className="obra-form-contenido">

                            <FormCotizacion
                                onSuccess={actualizarListado}
                                cotizacionSeleccionada={
                                    cotizacionSeleccionada
                                }
                                limpiarSeleccion={() =>
                                    setCotizacionSeleccionada(null)
                                }
                            />

                        </div>
                    </div>

                </div>

                <div className="content-card">

                    <ListCotizacion
                        refreshKey={refreshKey}
                        onEditar={
                            setCotizacionSeleccionada
                        }
                    />

                </div>

            </div>

        </main>
    );
};

export default CardpanelCotizacion;
