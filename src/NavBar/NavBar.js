import React from "react";
import logo from "../Homepage/CarAndAllFoto.png";

export function NavBar() {
    return <>
        <nav className="CarandAll">
            <div className="container">
                <h1 className="Title">Car And All</h1>

                {/* Logo/Image */}
                <div className="logo">
                    <a href="/">
                        <img src={logo} alt="Car and All Logo"/>
                    </a>
                </div>

                {/* Menu */}
                <ul className="menu">
                    <li className="menu-item">
                        <a href="/" className="menu_links">Home</a>
                    </li>
                    <li className="menu-item">
                        <a href="/contact" className="menu_links">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    </>
}