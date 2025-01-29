import React, { useState } from "react";
import "./Claims.css"; // For styling
import axios from "axios";

const ClaimCard = ({ claim, fetchClaims }) => {
    const [status, setStatus] = useState(
        claim.isProcessed === null ? "Pending" : claim.isProcessed ? "Approved" : "Rejected"
    ); // Set initial status
    const [responseMessage, setResponseMessage] = useState("");
    const [damageCosts, setDamageCosts] = useState(claim.damageCosts || ""); // Editable damage costs

    // Only allow editing damage costs if the claim is pending
    const handleDamageCostsChange = (e) => {
        setDamageCosts(e.target.value);
    };

    // Save damage costs function
    const handleSave = async () => {
        if (status === "Pending" && damageCosts === "") {
            setResponseMessage("Damage costs must be filled in!");
            return false;
        }

        try {
            // Construct the complete payload
            const payload = {
                ...claim, // Spread the original claim data
                damageCosts: parseFloat(damageCosts), // Update damage costs
                isProcessed: claim.isProcessed || null, // Maintain the nullable boolean
            };

            console.log("Sending payload:", payload);

            // Send the PUT request
            await axios.put(`https://localhost:7017/api/Claim/update/${claim.id}`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            setResponseMessage("Damage costs saved successfully!");
            fetchClaims(); // Refresh claims
            return true;
        } catch (error) {
            console.error("Error saving damage costs:", error.response?.data || error.message);
            setResponseMessage("Error saving damage costs.");
            return false;
        }
    };

    // Approve claim after saving damage costs
    const handleApprove = async () => {
        const saveSuccess = await handleSave(); // Save damage costs first
        if (!saveSuccess) return; // Exit if save fails

        try {
            await axios.put(`https://localhost:7017/api/Claim/approve/${claim.id}`);
            setStatus("Approved");
            fetchClaims(); // Refresh the claims list after approval
        } catch (error) {
            setResponseMessage("Error approving the claim.");
            console.error(error);
        }
    };

    // Reject claim after saving damage costs
    const handleReject = async () => {
        const saveSuccess = await handleSave(); // Save damage costs first
        if (!saveSuccess) return; // Exit if save fails

        try {
            await axios.put(`https://localhost:7017/api/Claim/reject/${claim.id}`);
            setStatus("Rejected");
            fetchClaims(); // Refresh the claims list after rejection
        } catch (error) {
            setResponseMessage("Error rejecting the claim.");
            console.error(error);
        }
    };

    return (
        <div className="claim-card">
            <div className="info-row">
                <div className="info-item">
                    <strong>User ID:</strong>
                    <p>{claim.userId}</p>
                </div>
                <div className="info-item">
                    <strong>Vehicle ID:</strong>
                    <p>{claim.vehicleId}</p>
                </div>
                <div className="info-item">
                    <strong>Description:</strong>
                    <p>{claim.description}</p>
                </div>
                <div className="info-item">
                    <strong>Date:</strong>
                    <p>{claim.date}</p>
                </div>
            </div>

            {/* Always show the saved damage costs */}
            <p className="damage">
                <strong>Damage Costs:</strong>{" "}
                {damageCosts !== "" ? `€ ${damageCosts}` : "No info"}
            </p>

            {/* Damage costs input only visible if Pending */}
            {status === "Pending" && (
                <div className="form-group">
                    <label htmlFor={`damageCosts-${claim.id}`}>
                        <strong>Damage Costs (€):</strong>
                    </label>
                    <input
                        type="number"
                        id={`damageCosts-${claim.id}`}
                        value={damageCosts}
                        onChange={handleDamageCostsChange}
                        placeholder="Enter damage costs"
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
                        disabled={status !== "Pending" || damageCosts === ""}
                    >
                        Approve
                    </button>
                    <button
                        className="reject-button"
                        onClick={handleReject}
                        disabled={status !== "Pending" || damageCosts === ""}
                    >
                        Reject
                    </button>
                </div>
            </div>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
    );
};

export default ClaimCard;
