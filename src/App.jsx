import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import CardpanelABM from "./Components/CardpanelABM";
import CardpanelCotizacion from "./Components/CardpanelCotizacion";
import FormCliente from "./Components/Cliente";
import ListCotizacion from "./Components/CotizacionListado";
import CardpanelSolicitante from "./Components/CardpanelSolicitante";
import FormSolicitante from "./Components/Solicitante";
import ListSolicitante from "./Components/SolicitanteListado";
import EstadoComercialPage from "./Components/EstadoComercialPage";
import Informes from "./Components/Informes";
import ObrasPage from "./Components/ObrasPage";
import Estadisticas from "./Components/Informes2";
import ListCliente from "./Components/ClienteListado";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Landing from "./Components/Landing";
import LoginModal from "./Components/LoginModal";

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("gescom_token"));
  useEffect(() => {
    const cerrarSesion = () => setToken(null);
    window.addEventListener("gescom:session-expired", cerrarSesion);
    return () => window.removeEventListener("gescom:session-expired", cerrarSesion);
  }, []);

  const rutas = <Routes>
    <Route path="/" element={<Landing autenticado />} />
    <Route path="/cotizacion" element={<CardpanelCotizacion />} />
    <Route path="/obra" element={<ObrasPage />} />
    <Route path="/solicitante" element={<CardpanelSolicitante Form={FormSolicitante} Listado={ListSolicitante} />} />
    <Route path="/cliente" element={<CardpanelABM Form={FormCliente} Listado={ListCliente} />} />
    <Route path="/avances" element={<EstadoComercialPage />} />
    <Route path="/informes" element={<Informes />} />
    <Route path="/estadisticas" element={<Estadisticas />} />
  </Routes>;

  return <Router>{token ? <><Header /><Navbar /><div className="body-layout"><Sidebar />{rutas}</div><Footer /></> : <><div className="app-locked"><Landing autenticado={false} /></div><LoginModal onLogin={setToken} /></>}</Router>;
}