import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpScherm.css";

function SignUpScherm() {
    const [formData, setFormData] = useState({
        naam: "",
        achternaam: "",
        email: "",
        password: "",
        typeKlant: "Particulier",
        kvkNummer: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("https://localhost:7017/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Account succesvol aangemaakt!");
                navigate("/login");
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError("Er is een fout opgetreden tijdens het registreren.");
        }
    };

    return (
        <div className="login-container">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Maak een Account</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-box">
                        <input
                            type="text"
                            name="naam"
                            placeholder="Voornaam"
                            value={formData.naam}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            name="achternaam"
                            placeholder="Achternaam"
                            value={formData.achternaam}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mailadres"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            name="password"
                            placeholder="Wachtwoord"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <select
                            name="typeKlant"
                            value={formData.typeKlant}
                            onChange={handleChange}
                            required
                        >
                            <option value="Particulier">Particulier</option>
                            <option value="Zakelijk">Zakelijk</option>
                        </select>
                    </div>
                    {formData.typeKlant === "Zakelijk" && (
                        <div className="input-box">
                            <input
                                type="text"
                                name="kvkNummer"
                                placeholder="KvK-nummer"
                                value={formData.kvkNummer}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">Account aanmaken</button>
                    <div className="register-link">
                        <p>
                            Heb je al een account? <a href="/login">Log in</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpScherm;
