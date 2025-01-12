import React, { useState } from "react";
import axios from "axios";

const SchadeclaimForm = () => {
    const [formData, setFormData] = useState({
        beschrijving: "",
        datum: "",
        schadeKosten: "",
        gebruikerId: "",
        voertuigId: "",
        isAfgehandeld: false,
    });

    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://localhost:7017/api/Schadeclaim", formData);
            setResponseMessage("Schadeclaim succesvol aangemaakt!");
            setFormData({
                beschrijving: "",
                datum: "",
                schadeKosten: "",
                gebruikerId: "",
                voertuigId: "",
                isAfgehandeld: false,
            });
        } catch (error) {
            setResponseMessage("Er is een fout opgetreden bij het indienen van d e schadeclaim.");
        }
    };

    return (
        <div className="schadeclaim-form-container">
            <h1>Dien een Schadeclaim in</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="beschrijving">Beschrijving:</label>
                    <textarea
                        id="beschrijving"
                        name="beschrijving"
                        value={formData.beschrijving}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="datum">Datum:</label>
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
                    <label htmlFor="schadeKosten">Schade Kosten (€):</label>
                    <input
                        type="number"
                        id="schadeKosten"
                        name="schadeKosten"
                        value={formData.schadeKosten}
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
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="isAfgehandeld">Is Afgehandeld:</label>
                    <input
                        type="checkbox"
                        id="isAfgehandeld"
                        name="isAfgehandeld"
                        checked={formData.isAfgehandeld}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Dien Schadeclaim In</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default SchadeclaimForm;