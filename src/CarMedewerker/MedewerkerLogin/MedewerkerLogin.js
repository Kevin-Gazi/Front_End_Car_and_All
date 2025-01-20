import React, { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function MedewerkerLogin({ setIsLoggedIn, setIsEmployee, setFunctie }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginDetails = { email, password };

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginDetails),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Successfully logged in:", data);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem("functie", data.functie);

                setIsLoggedIn(true);
                setIsEmployee(true); // Zorg ervoor dat isEmployee op true staat
                setFunctie(data.functie); // Sla de functie op in de state
                navigate("/"); // Redirect naar de homepagina
            } else {
                const errorMsg = await response.text();
                setError(errorMsg);
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
                    <h1>Employee Login</h1>
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
                        <p>Not an employee? <Link to="/Login">Login as User</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MedewerkerLogin;
