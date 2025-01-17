import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export const NavBar = ({ isLoggedIn, isEmployee, setIsLoggedIn }) => {
    const [menuActive, setMenuActive] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('functie');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">CarAndAll</Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    <i className={menuActive ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                <ul className={menuActive ? 'navbar-menu active' : 'navbar-menu'}>
                    <li className="navbar-item"><Link to="/" className="navbar-links">Home</Link></li>
                    {isLoggedIn ? (
                        isEmployee ? (
                            // Medewerker navigatie
                            <>
                                <li className="navbar-item"><Link to="/notifications"className="navbar-links">Notifications</Link></li>
                                <li className="navbar-item"><Link to="/rentals" className="navbar-links">Rentals</Link></li>
                                <li className="navbar-item"><Link to="/account-settings" className="navbar-links">Account Settings</Link></li>
                                <li className="navbar-item"><button onClick={handleLogout} className="navbar-links logout-button">Logout</button></li>
                                <li className="navbar-item"><Link to="/dashboard" className="navbar-links">Account</Link></li>

                            </>
                        ) : (
                            // Normale gebruiker navigatie
                            <>
                                <li className="navbar-item"><Link to="/contact" className="navbar-links">Contact</Link></li>
                                <li className="navbar-item"><Link to="/vehicles" className="navbar-links">Vehicles</Link></li>
                                <li className="navbar-item"><Link to="/account" className="navbar-links">Account</Link></li>
                                <li className="navbar-item"><button onClick={handleLogout} className="navbar-links logout-button">Logout</button></li>
                                <li className="navbar-item"><Link to="/dashboard" className="navbar-links">Dashboard</Link></li>
                            </>
                        )
                    ) : (
                        // Niet ingelogd
                        <>
                            <li className="navbar-item"><Link to="/contact" className="navbar-links">Contact</Link></li>
                            <li className="navbar-item"><Link to="/vehicles" className="navbar-links">Vehicles</Link></li>
                            <li className="navbar-item"><Link to="/login" className="navbar-links">Login</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
