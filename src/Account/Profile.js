import React, { useState, useEffect } from "react";
import "./Profile.css"; // Zorg ervoor dat je CSS is gekoppeld

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("[Frontend] Start ophalen profiel");
            const token = localStorage.getItem("authToken");

            if (!token) {
                console.error("[Frontend] Geen token gevonden in localStorage.");
                setError("U bent niet ingelogd. Log in om door te gaan.");
                return;
            }

            console.log(`[Frontend] Token gevonden: ${token}`);

            try {
                const response = await fetch("https://localhost:7017/api/gebruiker/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Token meesturen
                    },
                });

                console.log(`[Frontend] Fetch status: ${response.status}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({
                        message: "Onverwachte fout zonder JSON-body.",
                    }));
                    console.error("[Frontend] Fetch fout:", errorData.message);
                    setError(errorData.message || "Er is een fout opgetreden.");
                    return;
                }

                const data = await response.json();
                console.log("[Frontend] Profiel succesvol opgehaald:", data);
                setUserData(data);
            } catch (err) {
                console.error("[Frontend] Fout tijdens fetch:", err.message);
                setError("Er is een fout opgetreden bij het ophalen van het profiel.");
            }
        };

        fetchData();
    }, []);

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
                        {userData.firstName} {userData.lastName}
                    </div>
                </div>
                <div className="profile-row">
                    <div className="profile-label">E-mail:</div>
                    <div className="profile-value">{userData.email}</div>
                </div>
                <div className="profile-row">
                    <div className="profile-label">Telefoonnummer:</div>
                    <div className="profile-value">{userData.phone}</div>
                </div>
                <div className="profile-row">
                    <div className="profile-label">Adres:</div>
                    <div className="profile-value">
                        {userData.address}, {userData.postalCode}
                    </div>
                </div>
                <div className="profile-row">
                    <div className="profile-label">Type Klant:</div>
                    <div className="profile-value">{userData.typeKlant}</div>
                </div>

                {userData.typeKlant === "Zakelijk" && (
                    <>
                        <div className="profile-row">
                            <div className="profile-label">KVK Nummer:</div>
                            <div className="profile-value">{userData.kvkNumber}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Abonnement:</div>
                            <div className="profile-value">{userData.subscription}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
