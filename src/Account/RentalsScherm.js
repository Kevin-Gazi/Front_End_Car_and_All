import React, { useEffect, useState } from "react";
import "./RentalScherm.css";

const RentalScherm = () => {
    const [rentals, setRentals] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                // Haal de token op uit de localStorage
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("You are not logged in. Please log in to view your rentals.");
                }

                // Stuur een fetch-aanroep naar de backend
                const response = await fetch("https://localhost:7017/api/rentals/user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    // Haal foutmeldingen uit de serverrespons
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || `Error: ${response.status} ${response.statusText}`);
                }

                // Parseer de JSON-respons
                const data = await response.json();
                setRentals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    return (
        <div>
            <header className="rental-header">
                <h1>Your Rentals</h1>
                <p>Overview of all the cars you've rented</p>
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
                                <div className="vehicle-start">
                                    <h2>{rental.vehicleBrand} {rental.vehicleModel}</h2>
                                    <p>Renter: {rental.userName} {rental.userLastName}</p>
                                    <p>From: {new Date(rental.startDate).toLocaleDateString()}</p>
                                    <p>To: {new Date(rental.endDate).toLocaleDateString()}</p>
                                </div>
                                <div className="vehicle-end">
                                    <p>Price: €{rental.price}</p>
                                    <p>Status: {rental.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No rentals found.</p>
                )}
            </main>
        </div>
    );
};

export default RentalScherm;
