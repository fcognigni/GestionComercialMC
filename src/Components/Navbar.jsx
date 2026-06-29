import React from "react";
import '../Styles/Navbar.css'
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="top-navbar px-3 py-3">
            <div className="container-fluid">
                <div className="row g-3">

                    <div className="col-12 col-md-6 col-lg-3">
                        <Link to='/cotizacion' className="nav-custom-btn nav-link text-center">
                            +Cotización
                        </Link>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <Link to='/obra' className="nav-custom-btn nav-link text-center">
                            +Obra
                        </Link>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <Link to='/avances' className="nav-custom-btn nav-link text-center">
                            +Avances
                        </Link>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <Link to='/informes' className="nav-custom-btn nav-link text-center">
                            Informes
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar;