import React from "react";
import logo from "../Homepage/CarAndAllFoto.png";

export function NavBar() {
    return (
        <nav className="CarandAll">
            <div className="container">
                <h1 className="Title"><a href = "/">Car And All</a></h1>

                {/* Menu */}
                <ul className="menu">
                    <li className="menu_item">
                        <a href="/" className="menu_links">Home</a>
                    </li>
                    <li className="menu_item">
                        <a href="/Contact/Contact" className="menu_links">Contact</a>
                    </li>
                    <li className="menu_item">
                        <a href="/vehicles" className="menu_links">Vehicles</a>
                    </li>
                    <li className="menu_item">
                        <a href="/Login/LoginScherm" className="menu_links">Login</a>
                    </li>
                </ul>
            </div>
        </nav>
        
    );
}
export default NavBar;