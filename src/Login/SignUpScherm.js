import React, { useState } from "react";
import './SignUpScherm.css';
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SignUpScherm() {
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [typeKlant, setTypeKlant] = useState('Particulier');
    const [kvkNummer, setKvkNummer] = useState(''); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            Naam: username,
            Achternaam: lastname,
            Email: email,
            Password: password,
            TypeKlant: typeKlant,
            KvkNummer: typeKlant === 'Zakelijk' ? kvkNummer : null, 
        };

        try {
            const response = await fetch('https://localhost:7017/api/gebruiker/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                navigate('/Login');
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <FaUserAlt className="icon"/>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
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
                            Particulier
                        </label>
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

                    {typeKlant === 'Zakelijk' && (
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="KVK Nummer"
                                value={kvkNummer}
                                onChange={(e) => setKvkNummer(e.target.value)}
                                required={typeKlant === 'Zakelijk'}
                            />
                        </div>
                    )}

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
