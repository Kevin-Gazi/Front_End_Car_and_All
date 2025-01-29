import React, { useState } from "react";
import "./Schadeformulier.css";
import axios from "axios";

const SchadeclaimForm = () => {
    const [formData, setFormData] = useState({
        beschrijving: "",
        datum: "",
        gebruikerId: "",
        voertuigId: "",
    });

    const [responseMessage, setResponseMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        setErrorMessage("");

        // Format the date to remove the time portion
        const formattedDatum = formData.datum.split("T")[0];

        // Update formData with the formatted date
        const updatedFormData = { ...formData, datum: formattedDatum };

        try {
            await axios.post("https://localhost:7017/api/Damagereport", formData);
            setResponseMessage("Damage claim successfully created!");
            setFormData({
                beschrijving: "",
                datum: "",
                gebruikerId: "",
                voertuigId: "",
            });
        } catch (error) {
            setErrorMessage(
                "An error occurred while submitting the claim. Please ensure you are using an existing GebruikerId or VehicleId."
            );
        }
    };

    return (
        <div className="schadeclaim-form-container">
            <h1>Report a Damage Claim</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="beschrijving">Description:</label>
                    <textarea
                        id="beschrijving"
                        name="beschrijving"
                        value={formData.beschrijving}
                        onChange={handleChange}
                        placeholder="Describe the damage here..."
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="datum">Date:</label>
                    <input
                        type="date"
                        id="datum"
                        name="datum"
                        value={formData.datum}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gebruikerId">Gebruiker ID:</label>
                    <input
                        type="number"
                        id="gebruikerId"
                        name="gebruikerId"
                        value={formData.gebruikerId}
                        onChange={handleChange}
                        placeholder="Bijv. 43"
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="voertuigId">Voertuig ID:</label>
                    <input
                        type="number"
                        id="voertuigId"
                        name="voertuigId"
                        value={formData.voertuigId}
                        onChange={handleChange}
                        placeholder="Bijv. 50"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>

            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default SchadeclaimForm;
