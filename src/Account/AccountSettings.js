import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";

function AccountSettings() {
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("https://localhost:7017/api/account", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmail(response.data.email);
                setLoading(false);
            } catch (err) {
                console.error("Fout bij ophalen van gebruikersgegevens:", err);
                setError("Kan gebruikersgegevens niet ophalen. Probeer later opnieuw.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        if (!newEmail && !newPassword) {
            alert("Voer een nieuw e-mailadres of wachtwoord in.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            const updateData = {
                ...(newEmail && { email: newEmail }),
                ...(newPassword && { wachtwoord: newPassword }),
            };

            await axios.put("https://localhost:7017/api/account/update", updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccessMessage("Gegevens succesvol bijgewerkt!");
            setNewEmail("");
            setNewPassword("");
        } catch (err) {
            console.error("Fout bij bijwerken van gegevens:", err);
            setError("Er is een fout opgetreden bij het bijwerken van uw gegevens. Probeer het later opnieuw.");
        }
    };

    return (
        <div className="account-settings-container">
            <h1>Accountinstellingen</h1>
            {loading ? (
                <p>Gebruikersgegevens laden...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <p><strong>Huidig e-mailadres:</strong> {email}</p>

                    <div className="update-form">
                        <h3>Bijwerken van accountgegevens</h3>
                        <label>
                            Nieuw e-mailadres:
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Voer een nieuw e-mailadres in"
                            />
                        </label>
                        <label>
                            Nieuw wachtwoord:
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Voer een nieuw wachtwoord in"
                            />
                        </label>
                        <button onClick={handleUpdate}>Bijwerken</button>
                    </div>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                </>
            )}
        </div>
    );
}

export default AccountSettings;