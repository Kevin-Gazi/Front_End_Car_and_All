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
            console.error("[Frontend] No token found.");
            setError("You are not logged in. Log in to view the issuance schedule.");
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
                    message: "Unexpected error with no JSON body.",
                }));
                throw new Error(errorMessage.message || "Error while retrieving rentals.");
            }

            const data = await response.json();
            console.log("[API Response] Rentals:", data);
            setRentals(data);
        } catch (err) {
            console.error("[Frontend] Error while retrieving rentals:", err.message);
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
            console.error("[Frontend] Error: rentalId is undefined!");
            setError("Error: There was a problem retrieving the rental ID.");
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
                    message: "Error updating status.",
                }));
                throw new Error(errorMessage.message || "Error issuing vehicle.");
            }

            alert("Vehicle successfully issued.");
            fetchRentals(); // ✅ Lijst opnieuw ophalen om de wijzigingen te tonen
        } catch (err) {
            console.error("[Frontend] Error issuing vehicle:", err.message);
            setError(err.message);
        }
    };


    return (
        <div className="business-requests">
            <h1>Issuance schedule</h1>
            <p>Overview of vehicles being picked up today</p>

            {loading ? (
                <p className="loading">Loading rentals...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : rentals.length > 0 ? (
                <div className="requests-container">
                    {rentals.map((rental, index) => {
                        console.log(`[DEBUG] Rental ID voor ${rental.vehicleBrand} ${rental.vehicleModel}:`, rental.rentalId);

                        return (
                            <div key={rental.rentalId || index} className="request-card">
                                <div className="request-details">
                                    <p><strong>Rental ID:</strong> {rental.rentalId || "ID is missing!"}</p>
                                    <p><strong>Type:</strong> {rental.vehicleType}</p>
                                    <p><strong>Model:</strong> {rental.vehicleModel}</p>
                                    <p><strong>Brand:</strong> {rental.vehicleBrand}</p>
                                    <p><strong>License:</strong> {rental.licensePlate}</p>
                                    <hr />
                                    <p><strong>Rented by:</strong> {rental.userName} {rental.userLastName}</p>
                                    <p><strong>Phone:</strong> {rental.userPhone}</p>
                                    <p><strong>Customer type:</strong> {rental.userType}</p>
                                    <hr />
                                    <p><strong>Start date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                                    <p><strong>End date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
                                    <p className="status approved"><strong>Status:</strong> {rental.status}</p>
                                </div>
                                <div className="request-actions">
                                    <button
                                        className="issue-btn"
                                        onClick={() => {
                                            console.log("[DEBUG] Clicked on 'Issue' for Rental ID:", rental.rentalId);
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
                <p className="no-rentals">No releases planned for today.</p>
            )}
        </div>
    );
};

export default UitgifteScherm;
