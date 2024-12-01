import React from 'react';
import './App.css';
import logo from './CarAndAllFoto.png';

function App() {
    return (
        <div className="Car_And_All">
            <main className="Car_And_All-main">
                <nav className="CarandAll">
                    <div className="container">
                        <h1 className="Title">Car And All</h1>
                        
                        {/* Logo/Image */}
                        <div className="logo">
                            <a href="/"> 
                                <img src={logo} alt="Car and All Logo" />
                            </a>
                        </div>

                        {/* Menu */}
                        <ul className="menu">
                            <li className="menu-item">
                                <a href="#" className="menu_links">Home</a>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu_links">Vehicles</a>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu_links">Contact</a>
                            </li>
                            <li className="menu-item">
                                <a href="#" className="menu_links button">Sign Up</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </main>
        </div>
        
    );
}

export default App;
