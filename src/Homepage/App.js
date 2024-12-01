import React from 'react';
import './App.css';


function App() {
    return (
        <div className="Car_And_All">
            <header className="Car_And_All-header">
                <h1>Car AND All</h1>
            </header>
            <main className="Car_And_All-main">
                <nav class="navbar">
                    <ul className="navbar_menu">
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
                            <a href="#" className="menu_links">Sign Up</a>
                        </li>
                    </ul>
                </nav>
            </main>
        </div>
    );
}

export default App;