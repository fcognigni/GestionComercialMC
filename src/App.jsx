import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import Header from "./Components/Header"
import Sidebar from './Components/Sidebar'
import CardpanelABM from './Components/CardpanelABM'
import Cardpanel from './Components/Cardpanel'
import Dashboard from './Components/Dashboard';
import Footer  from './Components/Footer'
import Navbar from './Components/Navbar'
import FormCliente from './Components/Cliente'
import ListadoCliente from './Components/ClienteListado';
import CardpanelCotizacion from './Components/CardpanelCotizacion';
import FormCotizacion from './Components/Cotizacion';
import ListCotizacion from './Components/CotizacionListado'
import FormObra from './Components/Obra';
import ListObra from './Components/ObraListado';
import ListCliente from './Components/ClienteListado';
import CardpanelSolicitante from './Components/CardpanelSolicitante';
import FormSolicitante from './Components/Solicitante'
import ListSolicitante from './Components/SolicitanteListado'
import EstadoComercialPage from './Components/EstadoComercialPage';


function App() {

return(
    <Router>
    <Header />
       <Navbar />
       <div className='body-layout'>
        <Sidebar />
        <Routes>
          <Route path= '/' element= {<Dashboard />} />
          <Route path= '/cotizacion' element= {<CardpanelCotizacion Form= {FormCotizacion} Listado= {ListCotizacion} />} />
          <Route path= '/obra' element= {<Cardpanel Form ={FormObra} Listado= {ListObra} />} />
          <Route path= '/solicitante' element= {<CardpanelSolicitante Form={FormSolicitante} Listado={ListSolicitante} />} />
          <Route path= '/cliente' element= {<CardpanelABM Form ={FormCliente} Listado= {ListCliente} />} />
          <Route path= '/avances' element= {<EstadoComercialPage/>} />
        </Routes>
        </div>
       <Footer />
    </Router>)
}

export default App
