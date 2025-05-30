import React, { useEffect, useState } from "react";
import "./AlleAbonnementen.css"; // Zelfde stijl als BusinessRequests.css

export default function AlleAbonnementen() {
    const [abonnementen, setAbonnementen] = useState([]);
    const [pendingAccounts, setPendingAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        
        fetchPendingSubscriptions();
    }, []);


    const fetchPendingSubscriptions = async () => {
        try {
            const response = await fetch("https://localhost:7017/api/abonnement/pending-abonnement", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            });

            if (response.status === 404) {
                console.warn("[Frontend] No pending subscriptions found.");
                setPendingAccounts([]); // ✅ Zorgt ervoor dat de lijst leeg is zonder error
                return;
            }

            if (!response.ok) {
                throw new Error("Error retrieving business requests.");
            }

            const data = await response.json();
            setPendingAccounts(data);
        } catch (err) {
            console.error("[Frontend] Error retrieving pending subscriptions:", err.message);
            setPendingAccounts([]); // ✅ Zorgt ervoor dat er geen error ontstaat
        } finally {
            setLoading(false);
        }
    };


    // ✅ Approve een abonnement
    // ✅ Approve een abonnement (fix API-aanroep)
    const handleApprove = async (id) => {
        try {
            const response = await fetch(`https://localhost:7017/api/abonnement/approve-abonnement/${id}`, { // ✅ ID als route-parameter
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error approving subscription.");
            }

            alert("Subscription Approved.");
            fetchPendingSubscriptions(); // Refresh de lijst
        } catch (err) {
            setError(err.message);
        }
    };

// ✅ Reject een abonnement (fix API-aanroep)
    const handleReject = async (id) => {
        try {
            const response = await fetch(`https://localhost:7017/api/abonnement/reject-abonnement/${id}`, { // ✅ ID als route-parameter
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error declining subscription.");
            }

            alert("Subscription Rejected.");
            fetchPendingSubscriptions(); // Refresh de lijst
        } catch (err) {
            setError(err.message);
        }
    };


    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="business-requests">
            <h1>Pending Subscription Requests...</h1>

            {/* ✅ Alle abonnementen tonen */}
            <div className="requests-container">
                {abonnementen.map((abonnement) => (
                    <div key={abonnement.id} className="request-card">
                        <div className="request-details">
                            <p><strong>Naam:</strong> {abonnement.naam}</p>
                            <p><strong>Prijs:</strong> €{abonnement.prijs} per maand</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Pending abonnementen tonen of "Currently no pending subscriptions" */}
            {pendingAccounts.length > 0 ? (
                <div className="requests-container">
                    {pendingAccounts.map((account) => (
                        <div key={account.id} className="request-card">
                            <div className="request-details">
                                <p><strong>ID:</strong> {account.id}</p>
                                <p><strong>Name:</strong> {account.naam} {account.achternaam}</p>
                                <p><strong>Email:</strong> {account.email}</p>
                                <p><strong>KVK:</strong> {account.kvkNummer}</p>
                                <p><strong>Subscription:</strong> {account.abonnement}</p>
                                <p><strong>Registration:</strong> {new Date(account.registratieDatum).toLocaleDateString()}</p>
                            </div>
                            <div className="request-actions">
                                <button className="approve-btn" onClick={() => handleApprove(account.id)}>Approve</button>
                                <button className="reject-btn" onClick={() => handleReject(account.id)}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-pending">Currently no pending subscriptions...</p>
            )}
        </div>
    );
}
