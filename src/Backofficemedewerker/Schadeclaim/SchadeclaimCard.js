import React, { useState } from "react";
import "./Schadeclaims.css"; // For styling
import axios from "axios";

const SchadeclaimCard = ({ claim, fetchClaims }) => {
    const [status, setStatus] = useState(
        claim.isAfgehandeld === null ? "Pending" : claim.isAfgehandeld ? "Approved" : "Rejected"
    ); // Set initial status
    const [responseMessage, setResponseMessage] = useState("");
    const [schadeKosten, setSchadeKosten] = useState(claim.schadeKosten || ""); // Editable schadeKosten

    // Only allow editing Schadekosten if the claim is pending
    const handleSchadeKostenChange = (e) => {
        setSchadeKosten(e.target.value);
    };

    // Save schadekosten function
    const handleSave = async () => {
        if (status === "Pending" && schadeKosten === "") {
            setResponseMessage("Schadekosten moeten worden ingevuld!");
            return false;
        }

        try {
            // Construct the complete payload
            const payload = {
                ...claim, // Spread the original claim data
                schadeKosten: parseFloat(schadeKosten), // Update Schadekosten
                isAfgehandeld: claim.isAfgehandeld || null, // Maintain the nullable boolean
            };

            console.log("Sending payload:", payload);

            // Send the PUT request
            await axios.put(`https://localhost:7017/api/Schadeclaim/update/${claim.id}`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            setResponseMessage("Schadekosten succesvol opgeslagen!");
            fetchClaims(); // Refresh claims
            return true;
        } catch (error) {
            console.error("Error saving Schadekosten:", error.response?.data || error.message);
            setResponseMessage("Fout bij het opslaan van de schadekosten.");
            return false;
        }
    };



    // Approve claim after saving schadekosten
    const handleApprove = async () => {
        const saveSuccess = await handleSave(); // Save schadekosten first
        if (!saveSuccess) return; // Exit if save fails

        try {
            await axios.put(`https://localhost:7017/api/Schadeclaim/approve/${claim.id}`);
            setStatus("Approved");
            fetchClaims(); // Refresh the claims list after approval
        } catch (error) {
            setResponseMessage("Fout bij het goedkeuren van de claim.");
            console.error(error);
        }
    };

    // Reject claim after saving schadekosten
    const handleReject = async () => {
        const saveSuccess = await handleSave(); // Save schadekosten first
        if (!saveSuccess) return; // Exit if save fails

        try {
            await axios.put(`https://localhost:7017/api/Schadeclaim/reject/${claim.id}`);
            setStatus("Rejected");
            fetchClaims(); // Refresh the claims list after rejection
        } catch (error) {
            setResponseMessage("Fout bij het afkeuren van de claim.");
            console.error(error);
        }
    };

    return (
        <div className="schadeclaim-card">
            <div className="info-row">
                <div className="info-item">
                    <strong>GebruikerId:</strong>
                    <p>{claim.gebruikerId}</p>
                </div>
                <div className="info-item">
                    <strong>VoertuigId:</strong>
                    <p>{claim.voertuigId}</p>
                </div>
                <div className="info-item">
                    <strong>Description:</strong>
                    <p>{claim.beschrijving}</p>
                </div>
                <div className="info-item">
                    <strong>Date:</strong>
                    <p>{claim.datum}</p>
                </div>
            </div>

            {/* Always show the saved schadeKosten */}
            <p className = "damage">
                <strong>Damage costs:</strong>{" "}
                {schadeKosten !== "" ? `€ ${schadeKosten}` : "No info"}
            </p>

            {/* Schadekosten input only visible if Pending */}
            {status === "Pending" && (
                <div className="form-group">
                    <label htmlFor={`schadeKosten-${claim.id}`}>
                        <strong>Damage costs (€):</strong>
                    </label>
                    <input
                        type="number"
                        id={`schadeKosten-${claim.id}`}
                        value={schadeKosten}
                        onChange={handleSchadeKostenChange}
                        placeholder="Vul schadekosten in"
                    />
                </div>
            )}

            {/* Status Section */}
            <div className="status-section">
                <p><strong>Status:</strong> {status}</p>

                <div className="approve_reject">
                {/* Approve and Reject Buttons only enabled if status is Pending */}
                <button
                    className="approve-button"
                    onClick={handleApprove}
                    disabled={status !== "Pending" || schadeKosten === ""}
                >
                    Approve
                </button>
                <button
                    className="reject-button"
                    onClick={handleReject}
                    disabled={status !== "Pending" || schadeKosten === ""}
                >
                    Reject
                </button>
                </div>
            </div>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>

    );
};

export default SchadeclaimCard;
