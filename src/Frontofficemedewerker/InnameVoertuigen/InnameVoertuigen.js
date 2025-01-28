import React, { useEffect, useState } from "react";
import "./InnameVoertuigen.css";

export default function VehicleIntake() {
    const [rentals, setRentals] = useState([]); // Lijst met voertuigen
    const [selectedRentalId, setSelectedRentalId] = useState(null); // Geselecteerd voertuig
    const [responseMessage, setResponseMessage] = useState(""); // Feedback
    const [loading, setLoading] = useState(false); // Voor laadstatus

    // ** Haal voertuigen op van de backend **
    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:7017/api/carmedewerker/voertuigen", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Voeg token toe
                },
            });

            if (response.status === 401) {
                setResponseMessage("Je hebt geen toestemming om voertuigen te bekijken.");
                setRentals([]);
            } else if (response.status === 404) {
                setResponseMessage("Geen voertuigen gevonden.");
                setRentals([]);
            } else {
                const data = await response.json();
                setRentals(data);
                setResponseMessage("");
            }
        } catch (error) {
            console.error("Fout bij het ophalen van voertuigen:", error);
            setResponseMessage("Er is een fout opgetreden bij het ophalen van voertuigen.");
        } finally {
            setLoading(false);
        }
    };

    // ** Registreer inname van een voertuig **
    const handleIntake = async (e) => {
        e.preventDefault();

        if (!selectedRentalId) {
            setResponseMessage("Selecteer een voertuig om de inname te registreren.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("http://localhost:7017/api/carmedewerker/registratie-inname", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Voeg token toe
                },
                body: JSON.stringify(parseInt(selectedRentalId)),
            });

            if (response.ok) {
                const result = await response.json();
                setResponseMessage(result.message);
                // Verwijder het ingenomen voertuig uit de lijst
                setRentals((prevRentals) =>
                    prevRentals.filter((rental) => rental.id !== parseInt(selectedRentalId))
                );
                setSelectedRentalId(null);
            } else {
                const error = await response.json();
                setResponseMessage(error.message || "Er is iets misgegaan.");
            }
        } catch (error) {
            console.error("Fout bij het registreren van de inname:", error);
            setResponseMessage("Er is een fout opgetreden bij het registreren van de inname.");
        } finally {
            setLoading(false);
        }
    };

    // ** Gebruik useEffect om voertuigen op te halen bij laden van component **
    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="vehicle-intake-container">
            <h2>Register Voertuig Inname</h2>
            {responseMessage && <p className="response-message">{responseMessage}</p>}

            {loading ? (
                <p className="loading">Laden...</p>
            ) : (
                <>
                    <form onSubmit={handleIntake}>
                        <label>
                            Selecteer Voertuig:
                            <select
                                value={selectedRentalId || ""}
                                onChange={(e) => setSelectedRentalId(e.target.value)}
                            >
                                <option value="" disabled>
                                    -- Selecteer een voertuig --
                                </option>
                                {rentals.map((rental) => (
                                    <option key={rental.id} value={rental.id}>
                                        {rental.merk} {rental.model} - {rental.kenteken}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button type="submit" disabled={rentals.length === 0}>
                            Registreer Inname
                        </button>
                    </form>

                    {rentals.length === 0 && !loading && (
                        <p className="no-vehicles">Geen voertuigen beschikbaar voor inname.</p>
                    )}
                </>
            )}
        </div>
    );
}
