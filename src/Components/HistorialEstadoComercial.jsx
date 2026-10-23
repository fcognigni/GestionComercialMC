import { useEffect, useState } from "react";

export default function HistorialEstadoComercial({ obraSeleccionada, refreshKey }) {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!obraSeleccionada) { setHistorial([]); return; }
        const cargarHistorial = async () => {
            try {
                setLoading(true); setError("");
                const response = await fetch(`https://localhost:7208/api/ObraEstadoComercial?idObra=${obraSeleccionada}&pageSize=200`);
                if (!response.ok) throw new Error("Error cargando historial");
                const data = await response.json();
                setHistorial(data.items || []);
            } catch (err) { setError(err.message || "No se pudo cargar el historial"); setHistorial([]); }
            finally { setLoading(false); }
        };
        cargarHistorial();
    }, [obraSeleccionada, refreshKey]);

    if (!obraSeleccionada) return <div className="historial-vacio">Seleccione una obra para ver su historial.</div>;
    return <div className="historial-container">
        <h3>Historial de Estado Comercial</h3>
        {error && <div className="error-msg">{error}</div>}
        {loading && <div className="info-msg">Cargando historial...</div>}
        {!loading && historial.length === 0 && <div className="historial-vacio">No hay movimientos para esta obra.</div>}
        <div className="historial-lista">{historial.map(item => <div key={item.id} className={`estado-card estado-${item.idEstadoComercial}`}>
            <div className="estado-card-header"><strong>{item.nombreEstadoComercial || "Estado"}{item.activo === false && " (anulado)"}</strong><span className="estado-card-fecha">{item.fecha ? new Date(item.fecha).toLocaleString() : ""}</span></div>
            <div className="estado-card-body">{item.observaciones || "Sin observaciones"}</div>
        </div>)}</div>
    </div>;
}