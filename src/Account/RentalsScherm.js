import React, { useEffect, useState } from "react";
import "./RentalScherm.css";

const RentalScherm = () => {
    const [rentals, setRentals] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchRentals = async () => {
            if (!token) {
                console.error("[Frontend] Geen token gevonden.");
                setError("U bent niet ingelogd. Log in om uw huurgeschiedenis te bekijken.");
                return;
            }

            console.log("[Frontend] Token verzonden in fetch:", token);

            try {
                const response = await fetch("https://localhost:7017/api/rentals/user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("[Frontend] Response status:", response.status);

                if (!response.ok) {
                    const errorMessage = await response.json().catch(() => ({
                        message: "Onverwachte fout zonder JSON-body.",
                    }));
                    throw new Error(errorMessage.message || "Fout tijdens ophalen van rentals.");
                }

                const data = await response.json();
                console.log("[Frontend] Rentals succesvol opgehaald:", data);
                setRentals(data);
            } catch (err) {
                console.error("[Frontend] Fout tijdens ophalen rentals:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, [token]);

    return (
        <div>
            <header className="rental-header">
                <h1>Uw Huurgeschiedenis</h1>
                <p>Overzicht van alle auto's die u heeft gehuurd</p>
            </header>

            <main className="rental-container">
                {loading ? (
                    <p>Rentals laden...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : rentals.length > 0 ? (
                    <div className="vehicle-grid">
                        {rentals.map((rental) => (
                            <div key={rental.rentalId} className="vehicle-card">
                                <div className="vehicle-start">
                                    <h2>{rental.vehicleBrand} {rental.vehicleModel}</h2>
                                    <p>Gehuurd door: {rental.userName} {rental.userLastName}</p>
                                    <p>Van: {new Date(rental.startDate).toLocaleDateString()}</p>
                                    <p>Tot: {new Date(rental.endDate).toLocaleDateString()}</p>
                                </div>
                                <div className="vehicle-end">
                                    <p>Prijs: €{rental.price}</p>
                                    <p>Status: {rental.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Geen huurgeschiedenis gevonden.</p>
                )}
            </main>
        </div>
    );
};

export default RentalScherm;
