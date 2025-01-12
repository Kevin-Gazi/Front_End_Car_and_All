import React from "react";
import "./Subscriptions.css";

const Subscriptions = () => {
    // Static data for subscriptions
    const subscriptions = [
        { id: 1, name: "Pay-as-you-go", description: "Fixed monthly fee with a discount on rentals.", price: 29.99 },
        { id: 2, name: "Prepaid", description: "Covers a specific number of rental days.", price: 99.99 }
    ];

    return (
        <div className="subscriptions-container">
            <h1>Available Subscriptions</h1>
            <p>View our different subscriptions and choose the type that suits you!</p>

            <div className="subscriptions-grid">
                {subscriptions.map((subscription) => (
                    <div className="subscription-card" key={subscription.id}>
                        <h2>{subscription.name}</h2>
                        <p>{subscription.description}</p>
                        <p className="price">Prijs: €{subscription.price.toFixed(2)} per maand</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscriptions;
