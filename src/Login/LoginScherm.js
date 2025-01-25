import React, { useState } from "react";
import "./LoginScherm.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

function LoginScreen({ setIsLoggedIn, setIsEmployee, setFunctie }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginDetails = { email, password };

        try {
            const response = await fetch('https://localhost:7017/api/gebruiker/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginDetails),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Response data:", data);

                const token = data.token;
                localStorage.setItem("authToken", token);

                const decodedToken = jwtDecode(token);
                const telefoonNummer = decodedToken.userPhone || "";
                const adres = decodedToken.userAddress || "";
                const postcode = decodedToken.userPostalCode || "";

                localStorage.setItem("telefoonNummer", telefoonNummer);
                localStorage.setItem("adres", adres);
                localStorage.setItem("postcode", postcode);

                setIsLoggedIn(true);
                navigate("/");
            } else {
                const errorMsg = await response.text();
                console.error("Login error (server response):", errorMsg);
                setError(errorMsg || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Login error (catch):", err);
            setError("Er is een fout opgetreden bij het inloggen. Controleer je verbinding en probeer opnieuw.");
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
