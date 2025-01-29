import React, { useEffect, useState } from "react";
import "./UitgifteScherm.css"; // Eigen CSS voor uitgifteplanning

const UitgifteScherm = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // ✅ Ophalen van goedgekeurde rentals die vandaag starten
    const fetchRentals = async () => {
        if (!token) {
            console.error("[Frontend] Geen token gevonden.");
            setError("U bent niet ingelogd. Log in om de uitgifteplanning te bekijken.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/Uitgifte-VoertuigLijst", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json().catch(() => ({
                    message: "Onverwachte fout zonder JSON-body.",
                }));
                throw new Error(errorMessage.message || "Fout tijdens ophalen van rentals.");
            }

            const data = await response.json();
            console.log("[API Response] Rentals:", data);
            setRentals(data);
        } catch (err) {
            console.error("[Frontend] Fout tijdens ophalen rentals:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, [token]);

    // ✅ Status van rental wijzigen naar "Issued"
    const handleIssueRental = async (rentalId) => {
        if (!rentalId) {
            console.error("[Frontend] Fout: rentalId is undefined!");
            setError("Fout: Er is een probleem met het ophalen van de rental ID.");
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/issue/${rentalId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json().catch(() => ({
                    message: "Fout bij het updaten van de status.",
                }));
                throw new Error(errorMessage.message || "Fout bij uitgifte van voertuig.");
            }

            alert("Voertuig succesvol uitgegeven.");
            fetchRentals(); // ✅ Lijst opnieuw ophalen om de wijzigingen te tonen
        } catch (err) {
            console.error("[Frontend] Fout bij uitgifte van voertuig:", err.message);
            setError(err.message);
        }
    };


    return (
        <div className="business-requests">
            <h1>Uitgifteplanning</h1>
            <p>Overzicht van voertuigen die vandaag worden opgehaald</p>

            {loading ? (
                <p className="loading">Rentals laden...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : rentals.length > 0 ? (
                <div className="requests-container">
                    {rentals.map((rental, index) => {
                        console.log(`[DEBUG] Rental ID voor ${rental.vehicleBrand} ${rental.vehicleModel}:`, rental.rentalId);

                        return (
                            <div key={rental.rentalId || index} className="request-card">
                                <div className="request-details">
                                    <p><strong>Rental ID:</strong> {rental.rentalId || "ID ontbreekt!"}</p>
                                    <p><strong>Type:</strong> {rental.vehicleType}</p>
                                    <p><strong>Model:</strong> {rental.vehicleModel}</p>
                                    <p><strong>Brand:</strong> {rental.vehicleBrand}</p>
                                    <p><strong>License:</strong> {rental.licensePlate}</p>
                                    <hr />
                                    <p><strong>Rented by:</strong> {rental.userName} {rental.userLastName}</p>
                                    <p><strong>Phone:</strong> {rental.userPhone}</p>
                                    <p><strong>Type klant:</strong> {rental.userType}</p>
                                    <hr />
                                    <p><strong>Startdatum:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                                    <p><strong>Einddatum:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
                                    <p className="status approved"><strong>Status:</strong> {rental.status}</p>
                                </div>
                                <div className="request-actions">
                                    <button
                                        className="issue-btn"
                                        onClick={() => {
                                            console.log("[DEBUG] Op 'Issue' geklikt voor Rental ID:", rental.rentalId);
                                            handleIssueRental(rental.rentalId);
                                        }}
                                        disabled={!rental.rentalId}
                                    >
                                        Issue
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            ) : (
                <p className="no-rentals">Geen uitgiftes gepland voor vandaag.</p>
            )}
        </div>
    );
};

export default UitgifteScherm;
