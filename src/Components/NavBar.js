import React from "react";
import '../App.css';
import { Link } from "react-router-dom";
import './NavBar.css'; // CSS-bestand importeren
// import logo from "../Homepage/CarAndAllFoto.png";

export function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className="navbar-title">
                    <Link to="/" className="navbar-logo">Car And All</Link>
                </h1>

                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-links">Home</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/Contact/Contact" className="navbar-links">Contact</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/vehicles" className="navbar-links">Vehicles</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/Login/LoginScherm" className="navbar-links">Login</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/schadeclaims" className="navbar-links">Schadeclaims</Link>
                    </li>
                    <li className="navbar-item"></li>
                    <li>
                        <Link to="/subscriptions" className="navbar-links">Subscriptions</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
