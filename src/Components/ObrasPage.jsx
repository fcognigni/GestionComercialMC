import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import '../Styles/Cardpanel.css'
import Obra from "./Obra.jsx";
import ObraListado from "./ObraListado.jsx";

export default function ObrasPage() {

    const [refreshKey, setRefreshKey] = useState(0);
    const [formAbierto, setFormAbierto] = useState(true);

    const handleSuccess = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const alternarFormulario = () => {
        setFormAbierto(prev => !prev);
    };

    return (
        <div className="main-content">

            <div className="obras-container">

                {/* CARD FORMULARIO */}
                <div
                    className={`content-card obra-form-card ${
                        formAbierto ? "obra-form-abierto" : "obra-form-cerrado"
                    }`}
                >

                    {/* Encabezado siempre visible */}
                    <div
                        className="obra-form-header"
                        onClick={alternarFormulario}
                    >
                        <h3>Formulario de obra</h3>

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
                            <Obra onSuccess={handleSuccess} />
                        </div>
                    </div>

                </div>


                {/* CARD LISTADO */}
                <div className="content-card">
                    <ObraListado refreshKey={refreshKey} />
                </div>

            </div>

        </div>
    );
}
