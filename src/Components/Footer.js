import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; 2025 CarandAll. All rights reserved.</p>
                <ul className="footer-links">
                    <li>
                        <a href="/Contact" className="footer-link">Contact</a>
                    </li>
                    <li>
                        <a href="/Privacy" className="footer-link">Privacybeleid</a>
                    </li>
                    <li>
                        <a href="/Terms" className="footer-link">Terms And Conditions</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
