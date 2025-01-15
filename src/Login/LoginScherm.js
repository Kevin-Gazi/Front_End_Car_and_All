import React, { useState } from "react";
import "./LoginScherm.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function LoginScreen({ setIsLoggedIn, setIsEmployee, setFunctie }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginDetails = { email, password };

        try {
            const response = await fetch(`https://localhost:7017/api/gebruiker/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginDetails),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully logged in:", data);

                // Sla het token op in localStorage
                localStorage.setItem('authToken', data.token);
                setIsLoggedIn(true); // Update de inlogstatus

                // Controleer of de gebruiker een medewerker is
                if (data.userType === "Werknemer") {
                    setIsEmployee(true); // Stel in dat de gebruiker een medewerker is
                } else {
                    setIsEmployee(false); // De gebruiker is geen medewerker
                }

                navigate("/"); // Redirect naar de homepagina
            } else {
                const errorMsg = await response.text();
                setError(errorMsg); // Toon foutmelding als login mislukt
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Er is een fout opgetreden bij het inloggen.");
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
                        <FaUserAlt className="icon"/>
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FaLock className="icon"/>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>CarAndAll Employee? <Link to="/CarMedewerkerLogin">Login as Employee</Link></p>
                        <p>Don't have an account? <Link to="/SignUp">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginScreen;
