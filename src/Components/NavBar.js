import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [typeKlant, setTypeKlant] = useState('');
    const [functie, setFunctie] = useState('');

    useEffect(() => {
        // Haal typeKlant en functie op uit localStorage
        const klantType = localStorage.getItem('Typeklant');
        const medewerkerFunctie = localStorage.getItem('functie');
        setTypeKlant(klantType);
        setFunctie(medewerkerFunctie);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('Typeklant');
        localStorage.removeItem('functie');
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">CarAndAll</Link>
                <ul className="navbar-menu">
                    {/* Altijd zichtbare opties */}
                    <li className="navbar-item"><Link to="/" className="navbar-links">Home</Link></li>
                    <li className="navbar-item"><Link to="/Vehicles" className="navbar-links">Vehicles</Link></li>
                    <li className="navbar-item"><Link to="/Contact" className="navbar-links">Contact</Link></li>

                    {isLoggedIn ? (
                        typeKlant === 'Werknemer' ? (
                            <>
                                {/* Verwijder de dropdown voor medewerkers, totdat je beslist welke pagina's te tonen */}
                                <li className="navbar-item"><Link to="/Profile" className="navbar-links">Profile</Link></li>
                                <li className="navbar-item">
                                    <button onClick={handleLogout} className="navbar-links logout-button">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Navbar voor klanten */}
                                <li className="navbar-dropdown">
                                    <span className="navbar-links">Account</span>
                                    <div className="navbar-dropdown-menu">
                                        <Link to="/Account">Profile</Link>
                                        <Link to="/Rentals">Rentals</Link>
                                        <Link to="/Notifications">Notifications</Link>
                                        {typeKlant === "Zakelijk" && (
                                            <>
                                                <Link to="/Employees">Employees</Link>
                                                <Link to="/Subscriptions">Subscriptions</Link>
                                            </>
                                        )}
                                    </div>
                                </li>
                                <li className="navbar-item">
                                    <button onClick={handleLogout} className="navbar-links logout-button">Logout</button>
                                </li>
                            </>
                        )
                    ) : (
                        // Alleen zichtbaar voor niet-ingelogde gebruikers
                        <li className="navbar-item"><Link to="/Login" className="navbar-links">Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};
