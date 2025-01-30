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
            console.error("[Frontend] Geen token gevonden.");
            setError("U bent niet ingelogd. Log in om uw huurgeschiedenis te bekijken.");
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const isDateUnavailable = (date) => {
        return unavailableDates.includes(date);
    };

    const handleEdit = async (rental) => {
        console.log("[handleEdit] Geselecteerde rental:", rental);

        if (!rental.rentalId || !rental.voertuigId) {
            console.error("rentalId of voertuigId ontbreekt!", rental);
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
        console.log("[handleSave] Huidige geselecteerde rental:", selectedRental);
        const gebruikerId = parseInt(localStorage.getItem("userId"), 10);

        if (!selectedRental || !selectedRental.rentalId) {
            console.error("[Frontend] Geen geselecteerde rental of rentalId ontbreekt.");
            setError("Geen geselecteerde rental gevonden.");
            return;
        }

        const requestBody = {
            gebruikerId: gebruikerId,
            nieuweStartDate: new Date(formData.startDate).toISOString(),
            nieuweEndDate: new Date(formData.endDate).toISOString()
        };

        console.log("[DEBUG] JSON body die naar backend wordt gestuurd:", JSON.stringify(requestBody));

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
                throw new Error(responseData.message || "Fout tijdens bijwerken van rental.");
            }

            alert("Rental succesvol bijgewerkt.");
            setEditMode(null);
            fetchRentals();
        } catch (err) {
            console.error("[Frontend] Fout bij bijwerken rental:", err.message);
            setError(err.message);
        }
    };

    const handleDelete = async (rentalId) => {
        if (!window.confirm("Weet u zeker dat u deze rental wilt annuleren?")) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/rentals/cancel/${rentalId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });


            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: "Er is een fout opgetreden.",
                }));
                throw new Error(errorData.message || "Fout tijdens annuleren van rental.");
            }

            alert("Rental succesvol geannuleerd.");
            fetchRentals();
        } catch (err) {
            console.error("[Frontend] Fout bij annuleren rental:", err.message);
            alert(err.message);
        }
    };
    
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
                                {editMode === rental.rentalId ? (
                                    <div className="edit-form">
                                        <label>Startdatum:</label>
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
                                        <label>Einddatum:</label>
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
                                            <p>Gehuurd door: {rental.userName} {rental.userLastName}</p>
                                            <p>Van: {new Date(rental.startDate).toLocaleDateString()}</p>
                                            <p>Tot: {new Date(rental.endDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="vehicle-end">
                                            <p>Prijs: €{rental.price !== undefined ? rental.price.toFixed(2) : "N/A"}</p>
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
                    <p>Geen huurgeschiedenis gevonden.</p>
                )}
            </main>
        </div>
    );
};

export default RentalScherm;
