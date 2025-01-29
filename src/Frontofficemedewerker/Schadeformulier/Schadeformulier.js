import React, { useState } from "react";
import "./DamageClaimForm.css";
import axios from "axios";

const DamageClaimForm = () => {
    const [formData, setFormData] = useState({
        description: "",
        date: "",
        userId: "",
        vehicleId: "",
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
        const formattedDate = formData.date.split("T")[0];

        // Update formData with the formatted date
        const updatedFormData = { ...formData, date: formattedDate };

        try {
            await axios.post("https://localhost:7017/api/Damagereport", updatedFormData);
            setResponseMessage("Damage claim successfully created!");
            setFormData({
                description: "",
                date: "",
                userId: "",
                vehicleId: "",
            });
        } catch (error) {
            setErrorMessage(
                "An error occurred while submitting the claim. Please ensure you are using an existing UserId or VehicleId."
            );
        }
    };

    return (
        <div className="damageclaim-form-container">
            <h1>Report a Damage Claim</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the damage here..."
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="number"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        placeholder="e.g., 43"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="vehicleId">Vehicle ID:</label>
                    <input
                        type="number"
                        id="vehicleId"
                        name="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleChange}
                        placeholder="e.g., 50"
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

export default DamageClaimForm;
