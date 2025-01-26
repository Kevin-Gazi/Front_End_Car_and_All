import React, { useState } from "react";
import "./Subscriptions.css";
import jwtDecode from "jwt-decode";

const Subscriptions = () => {
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [pendingSubscription, setPendingSubscription] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

   
    const token = localStorage.getItem("authToken");
    const decoded = token ? jwtDecode(token) : null; // Controleer of token bestaat
    const gebruikerId = decoded?.sub; // Haal `sub` op uit het gedecodeerde token
    
    const subscriptions = [
        { id: 1, name: "Pay-as-you-go", description: "Fixed monthly fee with a discount on rentals.", price: 29.99 },
        { id: 2, name: "Prepaid", description: "Covers a specific number of rental days.", price: 99.99 },
    ];

    // Functie om abonnement te bevestigen
    const confirmSubscription = async () => {
        if (!pendingSubscription) return;

        setSelectedSubscription(pendingSubscription);
        setPendingSubscription(null); // Waarschuwing wissen
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `https://localhost:7017/api/gebruiker/${gebruikerId}/update-abonnement`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(pendingSubscription.name), // Stuur alleen de string
                }
            );

            if (response.ok) {
                const result = await response.json();
                setMessage(result.message || `You have successfully chosen ${pendingSubscription.name}.`);
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            setMessage(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Functie om keuze te annuleren
    const cancelSubscription = () => {
        setPendingSubscription(null); // Waarschuwing wissen
    };

    // Functie om een abonnement te selecteren
    const handleSubscriptionClick = (subscription) => {
        setPendingSubscription(subscription); // Waarschuwing instellen
        setMessage(""); // Vorige berichten wissen
    };

    return (
        <div className="subscriptions-container">
            <h1>Available Subscriptions</h1>
            <p>View our different subscriptions and choose the type that suits you!</p>

            <div className="subscriptions-grid">
                {subscriptions.map((subscription) => (
                    <div
                        className={`subscription-card ${
                            selectedSubscription?.id === subscription.id ? "selected" : ""
                        }`}
                        key={subscription.id}
                        onClick={() => handleSubscriptionClick(subscription)}
                    >
                        <h2>{subscription.name}</h2>
                        <p>{subscription.description}</p>
                        <p className="price">Price: €{subscription.price.toFixed(2)} per month</p>
                    </div>
                ))}
            </div>

            {pendingSubscription && (
                <div className="warning-box">
                    <p>
                        You have chosen <strong>{pendingSubscription.name}</strong> with a price of{" "}
                        <strong>€{pendingSubscription.price.toFixed(2)}</strong> per month.
                    </p>
                    <p>Are you sure you want to proceed?</p>
                    <div className="warning-actions">
                        <button onClick={confirmSubscription} className="confirm-button">
                            Confirm
                        </button>
                        <button onClick={cancelSubscription} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading && <p className="loading">Updating your subscription...</p>}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Subscriptions;
