import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';


export const NavBar = ({ isLoggedIn, isEmployee, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('Typeklant');
        localStorage.removeItem('adres');
        localStorage.removeItem('postcode');
        localStorage.removeItem('telefoonNummer');
        localStorage.removeItem('userId');
        localStorage.removeItem('userKvkNumber');
        //localStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">CarAndAll</Link>
                <ul className="navbar-menu">
                    {/* Altijd zichtbaar: Home */}
                    <li className="navbar-item"><Link to="/" className="navbar-links">Home</Link></li>

                    {/* Indien ingelogd */}
                    {isLoggedIn ? (
                        isEmployee ? (
                            <>
                                <li className="navbar-item"><Link to="/DamageClaims"
                                                                  className="navbar-links">DamageClaims</Link></li>
                                <li className="navbar-item"><Link to="/DamageReport"
                                                                  className="navbar-links">DamageReport</Link></li>
                                <li className="navbar-item"><Link to="/RentalRequests"
                                                                  className="navbar-links">RentalRequests</Link></li>
                                <li className="navbar-item"><Link to="/UserData"
                                                                  className="navbar-links">UserData</Link></li>
                                <li className="navbar-item">
                                    <button onClick={handleLogout} className="navbar-links logout-button">Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="navbar-item"><Link to="/Vehicles"
                                                                  className="navbar-links">Vehicles</Link></li>
                                <li className="navbar-item"><Link to="/Contact" className="navbar-links">Contact</Link></li>
                                <li className="navbar-item"><Link to="/Subscriptions" className="navbar-links">Subscriptions</Link></li>
                                <li className="navbar-item"><Link to="/Account" className="navbar-links">Account</Link></li>
                                <li className="navbar-item"><Link to="/Profile" className="navbar-links">Profile</Link></li>
                                <li className="navbar-item"><button onClick={handleLogout} className="navbar-links logout-button">Logout</button></li>
                            </>
                        )
                    ) : (
                        // Niet ingelogd
                        <>
                            <li className="navbar-item"><Link to="/Contact" className="navbar-links">Contact</Link></li>
                            <li className="navbar-item"><Link to="/Vehicles" className="navbar-links">Vehicles</Link>
                            </li>
                            <li className="navbar-item"><Link to="/Login" className="navbar-links">Login</Link></li>

                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};
export default NavBar;