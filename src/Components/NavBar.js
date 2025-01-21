import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';  // Zorg ervoor dat je deze bibliotheek installeert met 'npm install jwt-decode'
import './NavBar.css';

export const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [userType, setUserType] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Decodeer de token
            const decodedToken = jwt_decode(token);
            setUserType(decodedToken.userType); // Verkrijg de userType uit de token
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
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
                        userType === 'Medewerker' ? (
                            <>
                                {/* Navbar voor medewerkers */}
                                <li className="navbar-item"><Link to="/Profile" className="navbar-links">Profile</Link></li>
                                <li className="navbar-item"><Link to="/Rentals" className="navbar-links">Rentals</Link></li>
                                <li className="navbar-item"><Link to="/Notifications" className="navbar-links">Notifications</Link></li>
                                <li className="navbar-item">
                                    <button onClick={handleLogout} className="navbar-links logout-button">Logout</button>
                                </li>
                            </>
                        ) : userType === 'Zakelijk' ? (
                            <>
                                {/* Navbar voor zakelijke klanten */}
                                <li className="navbar-dropdown">
                                    <span className="navbar-links">Account</span>
                                    <div className="navbar-dropdown-menu">
                                        <Link to="/Profile">Profile</Link>
                                        <Link to="/Rentals">Rentals</Link>
                                        <Link to="/Notifications">Notifications</Link>
                                        <Link to="/Employees">Employees</Link>
                                        <Link to="/Subscriptions">Subscriptions</Link>
                                    </div>
                                </li>
                                <li className="navbar-item">
                                    <button onClick={handleLogout} className="navbar-links logout-button">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Navbar voor particuliere klanten */}
                                <li className="navbar-dropdown">
                                    <span className="navbar-links">Account</span>
                                    <div className="navbar-dropdown-menu">
                                        <Link to="/Profile">Profile</Link>
                                        <Link to="/Rentals">Rentals</Link>
                                        <Link to="/Notifications">Notifications</Link>
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

export default NavBar;
