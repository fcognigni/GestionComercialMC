import React from "react";
import { Link } from "react-router-dom";
import '../Styles/Sidebar.css'

const Sidebar = () => {
    return (
        <aside className="sidebar-vertical sidebar-collapsible d-none d-md-block">

            <ul className="nav flex-column nav-list pt-3">

                <li className="nav-item">
                    <Link to= '/cliente'className="nav-link d-flex align-items-center" href="#">
                        <span className="material-symbols-outlined">
                            add_business
                        </span>

                        <span className= "menu-text">
                            Cliente
                        </span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to= '/solicitante' className="nav-link d-flex align-items-center" href="#">
                        <span className="material-symbols-outlined">
                            support_agent
                        </span>

                        <span className="menu-text">
                            Solicitante
                        </span>
                    </Link>
                </li>

                <li className="nav-item">
                    <a className="nav-link d-flex align-items-center" href="#">
                        <span className="material-symbols-outlined">
                            settings
                        </span>

                        <span className="menu-text">
                            CONFIGURACIÓN
                        </span>
                    </a>
                </li>

            </ul>
        </aside>
    )
}

export default Sidebar;