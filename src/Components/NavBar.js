import React from "react";
import '../App.css';
import { Link, useNavigate } from "react-router-dom";
import './NavBar.css';

export function NavBar({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Verwijder de JWT-token uit localStorage
        localStorage.removeItem('authToken');
        // Zet de inlogstatus terug
        setIsLoggedIn(false);
        // Navigeer naar de inlogpagina
        navigate('/');
    };

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
                        <Link to="/Contact" className="navbar-links">Contact</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/vehicles" className="navbar-links">Vehicles</Link>
                    </li>

                    {/* Controleer of de gebruiker is ingelogd */}
                    {isLoggedIn ? (
                        <>
                            <li className="navbar-item">
                                <Link to="/Account" className="navbar-links">Account</Link>
                            </li>
                            <li className="navbar-item">
                                <button onClick={handleLogout} className="navbar-links logout-button">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="navbar-item">
                            <Link to="/Login" className="navbar-links">Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
