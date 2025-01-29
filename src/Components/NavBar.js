import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';  // Zorg ervoor dat je deze bibliotheek installeert met 'npm install jwt-decode'
import './NavBar.css';

export const NavBar = ({ isLoggedIn, isEmployee, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('');
    const [functie, setFunctie] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = jwt_decode(token);
            setUserType(decodedToken.userType ?? decodedToken.functie);
            console.log("usertype: " , localStorage.getItem('userType'));
            setFunctie(decodedToken.functie);
            console.log("functie: ", functie);
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('Typeklant');
        localStorage.removeItem('adres');
        localStorage.removeItem('postcode');
        localStorage.removeItem('telefoonNummer');
        localStorage.removeItem('userId');
        localStorage.removeItem('userKvkNumber');
        localStorage.removeItem("user");
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
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
                        <>
                            {userType === 'Particulier' ? (
                                <>
                                    <li className="navbar-dropdown">
                                        <span className="navbar-links">Account</span>
                                        <div className="navbar-dropdown-menu">
                                            <Link to="/Profile">Profile</Link>
                                            <Link to="/Rentals">Rentals</Link>
                                            <Link to="/Notifications">Notifications</Link>
                                        </div>
                                    </li>
                                </>
                            ) : userType === 'Zakelijk' ? (
                                <>
                                    <li className="navbar-dropdown">
                                        <span className="navbar-links">Account</span>
                                        <div className="navbar-dropdown-menu">
                                            <Link to="/Profile">Profile</Link>
                                            <Link to="/Subscriptions">Subscriptions</Link>
                                            <Link to="/Rentals">Rentals</Link>
                                            <Link to="/Notifications">Notifications</Link>
                                            <Link to="/Employees">Employees</Link>
                                        </div>
                                    </li>
                                </>
                            ) : userType === "BackOffice" ? (
                                <>
                                    <li className="navbar-dropdown">
                                        <span className="navbar-links">Requests</span>
                                        <div className="navbar-dropdown-menu">
                                            <Link to="/Verhuuraanvraag">Rental Requests</Link>
                                            <Link to="/DamageClaims">Damage Claims</Link>
                                            <Link to="/BusinessRequests">Business Accounts</Link>
                                            <Link to="/AlleAbonnementen">Subscriptions Requests</Link>
                                        </div>
                                    </li>
                                    <li className="navbar-dropdown">
                                        <span className="navbar-links">CarAndAll</span>
                                        <div className="navbar-dropdown-menu">
                                            <Link to="/CarEmployees">Carandall Employees</Link>
                                            <Link to="/EditVehicleScherm">Edit Vehicles</Link>
                                            <Link to="/Logs">Logs</Link>
                                        </div>
                                    </li>
                                </>
                            ) : userType === "FrontOffice" ? (
                                <>
                                    <li className="navbar-dropdown">
                                        <span className="navbar-links">CarAndAll</span>
                                        <div className="navbar-dropdown-menu">
                                            <Link to="/IntakeVehicles">Intake Vehicles</Link>
                                            <Link to="/SentOutVehicles">Sent-out Vehicles</Link>
                                            <Link to="/AllVehicles">All Vehicles</Link>
                                            <Link to="/DamageClaims">Damage Claims</Link>
                                            <Link to="/Users">Users</Link>
                                        </div>
                                    </li>
                                </>
                            ) : null}

                            {/* Logout button for all user */}
                            <li className="navbar-item">
                                <button onClick={handleLogout} className="navbar-links logout-button">Logout</button>
                            </li>
                        </>
                    ) : (
                        <li className="navbar-item"><Link to="/Login" className="navbar-links">Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
