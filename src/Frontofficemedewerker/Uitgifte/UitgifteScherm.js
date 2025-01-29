import React, { useEffect, useState } from "react";
import "./IssueScreen.css"; // Custom CSS for issue planning

const IssueScreen = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // Fetch approved rentals that are starting today
    const fetchRentals = async () => {
        if (!token) {
            console.error("[Frontend] No token found.");
            setError("You are not logged in. Please log in to view the issue schedule.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/Issue-VehicleList", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json().catch(() => ({
                    message: "Unexpected error without JSON body.",
                }));
                throw new Error(errorMessage.message || "Error while fetching rentals.");
            }

            const data = await response.json();
            console.log("[API Response] Rentals:", data);
            setRentals(data);
        } catch (err) {
            console.error("[Frontend] Error fetching rentals:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, [token]);

    // Change rental status to "Issued"
    const handleIssueRental = async (rentalId) => {
        if (!rentalId) {
            console.error("[Frontend] Error: rentalId is undefined!");
            setError("Error: There was an issue with fetching the rental ID.");
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
                    message: "Error while updating the status.",
                }));
                throw new Error(errorMessage.message || "Error while issuing the vehicle.");
            }

            alert("Vehicle successfully issued.");
            fetchRentals(); // Fetch the list again to show the updates
        } catch (err) {
            console.error("[Frontend] Error while issuing vehicle:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="business-requests">
            <h1>Issue Schedule</h1>
            <p>Overview of vehicles to be picked up today</p>

            {loading ? (
                <p className="loading">Loading rentals...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : rentals.length > 0 ? (
                <div className="requests-container">
                    {rentals.map((rental, index) => {
                        console.log(`[DEBUG] Rental ID for ${rental.vehicleBrand} ${rental.vehicleModel}:`, rental.rentalId);

                        return (
                            <div key={rental.rentalId || index} className="request-card">
                                <div className="request-details">
                                    <p><strong>Rental ID:</strong> {rental.rentalId || "ID missing!"}</p>
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
                                            console.log("[DEBUG] 'Issue' clicked for Rental ID:", rental.rentalId);
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
                <p className="no-rentals">No issues scheduled for today.</p>
            )}
        </div>
    );
};

export default IssueScreen;
