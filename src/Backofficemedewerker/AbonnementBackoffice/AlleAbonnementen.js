import React, { useEffect, useState } from "react";
import "./AlleAbonnementen.css"; //Same style as BusinessRequest.css :)

export default function AllSubscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
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
                setPendingAccounts([]); // Ensures the list is empty without error
                return;
            }

            if (!response.ok) {
                throw new Error("Error while fetching pending subscriptions.");
            }

            const data = await response.json();
            setPendingAccounts(data);
        } catch (err) {
            console.error("[Frontend] Error while fetching pending subscriptions:", err.message);
            setPendingAccounts([]); // Ensures no error is thrown
        } finally {
            setLoading(false);
        }
    };

    // Approve a subscription
    const handleApprove = async (id) => {
        try {
            const response = await fetch(`https://localhost:7017/api/abonnement/approve-abonnement?id=${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error while approving subscription.");
            }

            alert("Subscription Approved.");
            fetchPendingSubscriptions(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    // Reject a subscription
    const handleReject = async (id) => {
        try {
            const response = await fetch(`https://localhost:7017/api/abonnement/reject-abonnement?id=${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error while rejecting subscription.");
            }

            alert("Subscription Rejected.");
            fetchPendingSubscriptions(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="business-requests">
            <h1>Pending Subscription Requests...</h1>

            {/* Show all subscriptions */}
            <div className="requests-container">
                {subscriptions.map((subscription) => (
                    <div key={subscription.id} className="request-card">
                        <div className="request-details">
                            <p><strong>Name:</strong> {subscription.name}</p>
                            <p><strong>Price:</strong> €{subscription.price} per month</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show pending subscriptions or "Currently no pending subscriptions" */}
            {pendingAccounts.length > 0 ? (
                <div className="requests-container">
                    {pendingAccounts.map((account) => (
                        <div key={account.id} className="request-card">
                            <div className="request-details">
                                <p><strong>ID:</strong> {account.id}</p>
                                <p><strong>Name:</strong> {account.name} {account.lastName}</p>
                                <p><strong>Email:</strong> {account.email}</p>
                                <p><strong>KVK Number:</strong> {account.kvkNumber}</p>
                                <p><strong>Subscription:</strong> {account.subscription}</p>
                                <p><strong>Registration:</strong> {new Date(account.registrationDate).toLocaleDateString()}</p>
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
