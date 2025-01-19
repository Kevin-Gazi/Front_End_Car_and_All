
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export const NavBar = ({ isLoggedIn, isEmployee, setIsLoggedIn }) => {
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('functie');
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">CarAndAll</Link>
                <ul className="navbar-menu">
                    <li className="navbar-item"><Link to="/" className="navbar-links">Home</Link></li>

                    {isLoggedIn ? (
                        isEmployee ? (
                            <>
                                <li className="navbar-item"><Link to="/DamageClaims" className="navbar-links">DamageClaims</Link></li>
                                <li className="navbar-item"><Link to="/DamageReport" className="navbar-links">DamageReport</Link></li>
                                <li className="navbar-item"><Link to="/RentalRequests" className="navbar-links">RentalRequests</Link></li>
                                <li className="navbar-item"><Link to="/UserData" className="navbar-links">UserData</Link></li>
                                <li className="navbar-item">
                                    <button onClick={handleLogout} className="navbar-links logout-button">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="navbar-item"><Link to="/Vehicles" className="navbar-links">Vehicles</Link></li>
                                <li className="navbar-item"><Link to="/Subscriptions" className="navbar-links">Subscriptions</Link></li>
                                <li className="navbar-item"><Link to="/Contact" className="navbar-links">Contact</Link></li>
                                <li className="navbar-dropdown">
                                    <span className="navbar-links">Account</span>
                                    <div className="navbar-dropdown-menu">
                                        <Link to="/Account">Profile</Link>
                                        <Link to="/Settings">Rentals</Link>
                                        <Link to="/Notifications">Notifications</Link>
                                        <Link to="/filler">Filler</Link>
                                    </div>
                                </li>
                                <li className="navbar-item">
                                    <button onClick={handleLogout} className="navbar-links logout-button">Logout
                                    </button>
                                </li>
                            </>
                        )
                    ) : (
                        <>
                            <li className="navbar-item"><Link to="/Contact" className="navbar-links">Contact</Link></li>
                            <li className="navbar-item"><Link to="/Vehicles" className="navbar-links">Vehicles</Link></li>
                            <li className="navbar-item"><Link to="/Login" className="navbar-links">Login</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};