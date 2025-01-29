import React, { useEffect, useState } from "react";
import "./VehicleIntake.css"; // Custom CSS for vehicle intake

const VehicleIntake = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // ✅ Fetch vehicles that need to be returned today
    const fetchRentals = async () => {
        if (!token) {
            console.error("[Frontend] No token found.");
            setError("You are not logged in. Please log in to view the intake schedule.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/intake-voertuiglijst", {
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
                throw new Error(errorMessage.message || "Error fetching rentals.");
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

    // ✅ Change rental status to "Returned"
    const handleReturnRental = async (rentalId) => {
        if (!rentalId) {
            console.error("[Frontend] Error: rentalId is undefined!");
            setError("Error: There is an issue with fetching the rental ID.");
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/return/${rentalId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json().catch(() => ({
                    message: "Error updating the status.",
                }));
                throw new Error(errorMessage.message || "Error during vehicle intake.");
            }

            alert("Vehicle successfully returned.");
            fetchRentals(); // ✅ Refresh the list to show changes
        } catch (err) {
            console.error("[Frontend] Error during vehicle intake:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="business-requests">
            <h1>Vehicle Intake</h1>
            <p>Overview of vehicles to be returned today</p>

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
                                    <p><strong>Customer Type:</strong> {rental.userType}</p>
                                    <hr />
                                    <p><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
                                    <p className="status issued"><strong>Status:</strong> {rental.status}</p>
                                </div>
                                <div className="request-actions">
                                    <button
                                        className="return-btn"
                                        onClick={() => {
                                            console.log("[DEBUG] 'Return' clicked for Rental ID:", rental.rentalId);
                                            handleReturnRental(rental.rentalId);
                                        }}
                                        disabled={!rental.rentalId}
                                    >
                                        Return
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            ) : (
                <p className="no-rentals">No intake scheduled for today.</p>
            )}
        </div>
    );
};

export default VehicleIntake;
