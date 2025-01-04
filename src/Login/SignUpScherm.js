import React, { useState } from "react";
import './SignUpScherm.css';
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SignUpScherm() {
    const [name, setName] = useState(''); // Voeg de state voor username toe
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [typeKlant, setTypeKlant] = useState('Particulier');  // Als je een bolletje voor typeKlant hebt
    const navigate = useNavigate();

    // Functie om formulier in te dienen
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gebruikersgegevens in een object
        const user = {
            Naam: name,
            Achternaam: lastname,
            Email: email,
            Password: password, // Voeg het wachtwoord hier toe
            TypeKlant: typeKlant,
        };

        try {
            const response = await fetch('https://localhost:7017/api/gebruiker/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user), // Body contains all user parameters, including wachtwoord
            });

            if (response.ok) {
                navigate('/Login/LoginScherm');
            } else {
                console.error('Er is iets mis gegaan bij het registreren');
            }
        } catch (error) {
            console.error('Fout bij het verbinden met de server:', error);
        }
    };

    return (
        <div className="signup-container">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}  // Verbind username state
                            required
                        />
                        <FaUserAlt className="icon"/>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="LastName"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}  // Verbind achternaam state
                            required
                        />
                        <FaUserAlt className="icon"/>
                    </div>

                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FaEnvelope className="icon"/>
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}  // Verbind wachtwoord state
                            required
                        />
                        <FaLock className="icon"/>
                    </div>
                    <div className="input-box">
                        <label>
                            <input
                                type="radio"
                                value="Particulier"
                                checked={typeKlant === 'Particulier'}
                                onChange={() => setTypeKlant('Particulier')}
                            />
                            Particulier </label>
                        <label>
                            <input
                                type="radio"
                                value="Zakelijk"
                                checked={typeKlant === 'Zakelijk'}
                                onChange={() => setTypeKlant('Zakelijk')}
                            />
                            Zakelijk
                        </label>
                    </div>
                    <button type="submit">Sign Up</button>

                    <div className="login-link">
                        <p>Already have an account? <a href="/Login/LoginScherm">Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpScherm;
