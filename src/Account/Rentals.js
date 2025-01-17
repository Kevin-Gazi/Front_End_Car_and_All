import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Rentals.css";

function Rentals({ userType }) {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const endpoint =
                    userType === "Zakelijk"
                        ? "https://localhost:7017/api/rentals/business"
                        : "https://localhost:7017/api/rentals/user";

                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRentals(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Fout bij ophalen van verhuur:", err);
                setError("Kan verhuurgegevens niet ophalen. Probeer later opnieuw.");
                setLoading(false);
            }
        };

        fetchRentals();
    }, [userType]);

    const handleCancelRental = async (rentalId) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`https://localhost:7017/api/rentals/${rentalId}/cancel`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRentals(rentals.filter((rental) => rental.id !== rentalId));
            alert("Verhuur succesvol geannuleerd.");
        } catch (err) {
            console.error("Fout bij annuleren van verhuur:", err);
            alert("Er is een fout opgetreden bij het annuleren van de verhuur.");
        }
    };

    return (
        <div className="rentals-container">
            <h1>Mijn Verhuur</h1>
            {loading ? (
                <p>Verhuur laden...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : rentals.length > 0 ? (
                <ul className="rentals-list">
                    {rentals.map((rental) => (
                        <li key={rental.id} className="rental-item">
                            <p><strong>Voertuig:</strong> {rental.vehicleName}</p>
                            <p><strong>Huurdatum:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {rental.status}</p>
                            {userType === "Particulier" && rental.status === "Lopend" && (
                                <button onClick={() => handleCancelRental(rental.id)}>Annuleer Verhuur</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Geen verhuur gevonden.</p>
            )}
        </div>
    );
}

export default Rentals;
