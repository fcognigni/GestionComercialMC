import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import "../Styles/Landing.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const API_URL = "https://localhost:7208";

export default function Landing({ autenticado }) {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState("");
  const anio = new Date().getFullYear();

  useEffect(() => {
    if (!autenticado) return;
    const cargar = async () => {
      try {
        const response = await fetch(`${API_URL}/api/Estadisticas/obras`);
        if (!response.ok) throw new Error("No se pudieron cargar los montos de obras.");
        setDatos(await response.json());
      } catch (err) { setError(err.message); }
    };
    cargar();
  }, [autenticado]);

  const chart = useMemo(() => {
    const acumulado = new Map();
    datos.filter(item => item.anio === anio).forEach(item => {
      acumulado.set(item.nombreCliente, (acumulado.get(item.nombreCliente) || 0) + Number(item.montoObrasPesos || 0));
    });
    return {
      labels: [...acumulado.keys()],
      datasets: [{ label: `Monto de obras ${anio} (ARS)`, data: [...acumulado.values()], backgroundColor: "#6b46c1", borderRadius: 8, maxBarThickness: 54 }]
    };
  }, [datos, anio]);

  return <main className="landing-page">
    <section className="landing-hero"><span className="landing-kicker">GesCom</span><h1>Gestión comercial clara, desde la primera decisión.</h1><p>Obras acumuladas por cliente durante {anio}.</p></section>
    <section className="landing-chart-card"><h2>Montos de obras por cliente</h2>{error ? <p className="landing-error">{error}</p> : chart.labels.length ? <Bar data={chart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(context.raw) } } }, scales: { y: { ticks: { callback: value => new Intl.NumberFormat("es-AR", { notation: "compact" }).format(value) } } } }} /> : <p>{autenticado ? "No hay obras del año actual para mostrar." : "El gráfico estará disponible al iniciar sesión."}</p>}</section>
  </main>;
}