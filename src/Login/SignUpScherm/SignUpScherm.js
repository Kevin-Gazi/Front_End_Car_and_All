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

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("The password must be at least 8 characters long and include an uppercase letter, a number, and a special character.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/gebruiker/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Account created successfully!");
                navigate("/login");
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError("An error occurred during registration.");
        }
    };


    return (
        <div className="login-container">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Create an Account</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-box">
                        <input
                            type="text"
                            name="naam"
                            placeholder="First Name"
                            value={formData.naam}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            name="achternaam"
                            placeholder="Last Name"
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
                            placeholder="Password"
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
                            <option value="Particulier">Individual customer</option>
                            <option value="Zakelijk">Business customer</option>
                        </select>
                    </div>
                    {formData.typeKlant === "Zakelijk" && (
                        <div className="input-box">
                            <input
                                type="text"
                                name="kvkNummer"
                                placeholder="KvK-number"
                                value={formData.kvkNummer}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">Create an account</button>
                    <div className="register-link">
                        <p>
                            Do you already have an account? <a href="/login">Log in</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpScherm;
