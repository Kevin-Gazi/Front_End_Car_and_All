import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false); // Edit-modus
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchData = async () => {
            console.log("[Frontend] Start ophalen profiel");
            if (!token) {
                console.error("[Frontend] Geen token gevonden.");
                setError("U bent niet ingelogd. Log in om door te gaan.");
                return;
            }

            try {
                const response = await fetch("https://localhost:7017/api/gebruiker/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Fout tijdens ophalen van profiel.");
                }

                const data = await response.json();
                setUserData(data);
                setFormData(data); // Voor initialisatie van bewerkbare velden
            } catch (err) {
                console.error("[Frontend] Fout:", err.message);
                setError(err.message);
            }
        };

        fetchData();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const payload = {
            Naam: formData.firstName || userData.firstName,
            Achternaam: formData.lastName || userData.lastName,
            Email: formData.email || userData.email,
            Telefoonnummer: formData.phone || userData.phone,
            Adres: formData.address || userData.address,
            Postcode: formData.postalCode || userData.postalCode,
            TypeKlant: userData.typeKlant, // Altijd meesturen
        };

        // Alleen KvkNummer meesturen voor zakelijke gebruikers
        if (userData.typeKlant === "Zakelijk") {
            payload.KvkNummer = userData.kvkNumber;
        }

        console.log("[Frontend] Payload naar backend (opslaan):", payload);

        try {
            const response = await fetch("https://localhost:7017/api/gebruiker/UpdateProfile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[Frontend] Validatiefouten ontvangen van backend:", errorData.errors);
                throw new Error(errorData.title || "Fout tijdens opslaan van profiel.");
            }

            console.log("[Frontend] Profiel succesvol bijgewerkt");
            setUserData({ ...userData, ...formData }); // Werk profielgegevens bij in de UI
            setEditMode(false); // Sluit de edit-modus
        } catch (err) {
            console.error("[Frontend] Fout bij opslaan:", err.message);
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Weet u zeker dat u uw account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) {
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/gebruiker/DeleteAccount", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[Frontend] Fout bij verwijderen van account:", errorData.message);
                throw new Error(errorData.message || "Fout tijdens verwijderen van account.");
            }

            console.log("[Frontend] Account succesvol verwijderd");
            alert("Uw account is succesvol verwijderd.");
            localStorage.removeItem("authToken");
            localStorage.removeItem('Typeklant');
            localStorage.removeItem('adres');
            localStorage.removeItem('postcode');
            localStorage.removeItem('telefoonNummer');
            localStorage.removeItem('userId');
            localStorage.removeItem('userKvkNumber');
            localStorage.removeItem("user");
            localStorage.clear();
            window.location.href = "/";
        } catch (err) {
            console.error("[Frontend] Fout bij verwijderen van account:", err.message);
            setError(err.message);
        }
    };

    if (error) {
        return <div className="error-container">Fout: {error}</div>;
    }

    if (!userData) {
        return <div className="loading-container">Profiel wordt geladen...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Profieloverzicht</h2>

                <div className="profile-row">
                    <div className="profile-label">Volledige Naam:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleInputChange}
                                    placeholder="Voornaam"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleInputChange}
                                    placeholder="Achternaam"
                                />
                            </>
                        ) : (
                            `${userData.firstName} ${userData.lastName}`
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">E-mail:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.email
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">Telefoonnummer:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.phone
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">Adres:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.address
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">Postcode:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.postalCode
                        )}
                    </div>
                </div>

                {userData.typeKlant === "Zakelijk" && (
                    <>
                        <div className="profile-row">
                            <div className="profile-label">KVK Nummer:</div>
                            <div className="profile-value">{userData.kvkNumber}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Abonnement:</div>
                            <div className="profile-value">{userData.subscription || "None"}</div>
                        </div>
                    </>
                )}

                <div className="profile-actions">
                    {editMode ? (
                        <>
                            <button onClick={handleSave}>Opslaan</button>
                            <button onClick={() => setEditMode(false)}>Annuleren</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditMode(true)}>Bewerken</button>
                            <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
                                Verwijder Account
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
