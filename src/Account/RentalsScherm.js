import React, { useEffect, useState } from "react";
import "./RentalScherm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RentalScherm = () => {
    const [rentals, setRentals] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [formData, setFormData] = useState({ startDate: "", endDate: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("authToken");
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [selectedRental, setSelectedRental] = useState(null);

    const fetchRentals = async () => {
        if (!token) {
            console.error("[Frontend] No token found.");
            setError("You are not logged in. Log in to view your rental history.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/rentals/user", {
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
            console.error("[Frontend] Error retrieving rentals:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const isDateUnavailable = (date) => {
        return unavailableDates.includes(date);
    };

    const handleEdit = async (rental) => {
        console.log("[handleEdit] Selected rentals:", rental);

        if (!rental.rentalId || !rental.voertuigId) {
            console.error("RentalId or VehicleId missing!", rental);
            return;
        }

        setSelectedRental(rental);
        setEditMode(rental.rentalId);
        setFormData({
            startDate: rental.startDate ? rental.startDate.slice(0, 10) : "",
            endDate: rental.endDate ? rental.endDate.slice(0, 10) : "",
        });

        try {
            const response = await fetch(`https://localhost:7017/api/vehicles/${rental.voertuigId}/unavailable-dates`);
            if (!response.ok) throw new Error("Failed to fetch unavailable dates");

            const dates = await response.json();
            setUnavailableDates(dates);
        } catch (err) {
            console.error("Error fetching unavailable dates:", err);
            setUnavailableDates([]);
        }
    };

    const handleSave = async () => {
        console.log("[handleSave] Current selected rental:", selectedRental);
        const gebruikerId = parseInt(localStorage.getItem("userId"), 10);

        if (!selectedRental || !selectedRental.rentalId) {
            console.error("[Frontend] No selected rental or missing rentalId.");
            setError("No selected rental found.");
            return;
        }

        const requestBody = {
            gebruikerId: gebruikerId,
            nieuweStartDate: new Date(formData.startDate).toISOString(),
            nieuweEndDate: new Date(formData.endDate).toISOString()
        };

        console.log("[DEBUG] JSON body being sent to backend:", JSON.stringify(requestBody));

        try {
            const response = await fetch(`https://localhost:7017/api/rentals/update-period/${selectedRental.rentalId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Error while updating rental.");
            }

            alert("Rental successfully updated.");
            setEditMode(null);
            fetchRentals();
        } catch (err) {
            console.error("[Frontend] Error while updating rental:", err.message);
            setError(err.message);
        }
    };

    const handleDelete = async (rentalId) => {
        if (!window.confirm("Are you sure you want to cancel this rental?")) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/rentals/cancel/${rentalId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: "An error occurred.",
                }));
                throw new Error(errorData.message || "Error while canceling rental.");
            }

            alert("Rental successfully canceled.");
            fetchRentals();
        } catch (err) {
            console.error("[Frontend] Error while canceling rental:", err.message);
            alert(err.message);
        }
    };

    return (
        <div>
            <header className="rental-header">
                <h1>Your Rental History</h1>
                <p>Overview of all the cars you have rented</p>
            </header>

            <main className="rental-container">
                {loading ? (
                    <p>Loading rentals...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : rentals.length > 0 ? (
                    <div className="vehicle-grid">
                        {rentals.map((rental) => (
                            <div key={rental.rentalId} className="vehicle-card">
                                {editMode === rental.rentalId ? (
                                    <div className="edit-form">
                                        <label>Start Date:</label>
                                        <DatePicker
                                            selected={new Date(formData.startDate)}
                                            onChange={(date) => setFormData((prev) => ({
                                                ...prev,
                                                startDate: date.toISOString().split("T")[0]
                                            }))}
                                            minDate={new Date()}
                                            excludeDates={unavailableDates.map((date) => new Date(date))}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                        <label>End Date:</label>
                                        <DatePicker
                                            selected={new Date(formData.endDate)}
                                            onChange={(date) => setFormData((prev) => ({
                                                ...prev,
                                                endDate: date.toISOString().split("T")[0]
                                            }))}
                                            minDate={new Date(formData.startDate)}
                                            excludeDates={unavailableDates.map((date) => new Date(date))}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={() => setEditMode(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="vehicle-start">
                                            <h2>{rental.vehicleBrand} {rental.vehicleModel}</h2>
                                            <p>Rented by: {rental.userName} {rental.userLastName}</p>
                                            <p>From: {new Date(rental.startDate).toLocaleDateString()}</p>
                                            <p>Until: {new Date(rental.endDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="vehicle-end">
                                            <p>Price: €{rental.price}</p>
                                            <p>Status: {rental.status}</p>
                                        </div>
                                        <div className="actions">
                                            <button onClick={() => handleEdit(rental)}>Change Date</button>
                                            <button
                                                onClick={() => handleDelete(rental.rentalId)}
                                                style={{ backgroundColor: "red", color: "white" }}
                                            >
                                                Cancel Rental
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No rental history found.</p>
                )}
            </main>
        </div>
    );
};

export default RentalScherm;
