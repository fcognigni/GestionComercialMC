import React from "react";
import '../Styles/Header.css'
import Logo from '../assets/LogoNuevoMC.png'

const Header = () => {
    return(
    <header className="main-header d-flex justify-content-between align-items-center px-4">
        <a href="#" className="company-logo text-decoration-none">
            <div className="logo-box d-flex align-items-center justify-content-center">
                <img src={Logo} alt="Logo" width={50}/>
            </div>
        </a>

        <div className="user-text">
            Usuario:
        </div>
    </header>
    )
}

export default Header;