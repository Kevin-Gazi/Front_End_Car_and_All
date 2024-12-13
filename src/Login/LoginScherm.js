import React, { useState } from "react";
import "../App.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginDetails = { email, password }; // Stuur email en wachtwoord in de body

        try {
            const response = await fetch(`https://localhost:7017/api/gebruiker/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginDetails), // Voeg het wachtwoord toe in de body
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully logged in:", data); // Beheer sessie of redirect
            } else {
                const errorMsg = await response.text();
                console.error("Login failed:", errorMsg);
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div className="login-container">
            <div className="wrapper">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FaUserAlt className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FaLock className="icon" />
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <Link to="/SignUp">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginScreen;
