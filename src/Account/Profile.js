import React, { useState, useEffect } from "react";
import "./Profile.css"; // Zorg dat je deze CSS toevoegt

const Profile = () => {
    const [userData, setUserData] = useState({
        firstName: "Johnatan",
        lastName: "Smith",
        email: "example@example.com",
        typeKlant: "Zakelijk", // Change to "Particulier" to test
        phone: "(097) 234-5678",
        address: "Bay Area, San Francisco, CA",
        postcode: "94103",
        kvkNummer: "12345678",
        abonnement: "Premium",
    });

    useEffect(() => {
        // Fetch user data from API and set it in state
        // Example:
        // fetch('/api/user/profile')
        //     .then(response => response.json())
        //     .then(data => setUserData(data));
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-row">
                    <div className="profile-label">Full Name</div>
                    <div className="profile-value">
                        {userData.firstName} {userData.lastName}
                    </div>
                </div>
                <hr />
                <div className="profile-row">
                    <div className="profile-label">Email</div>
                    <div className="profile-value">{userData.email}</div>
                </div>
                <hr />
                <div className="profile-row">
                    <div className="profile-label">Phone</div>
                    <div className="profile-value">{userData.phone}</div>
                </div>
                <hr />
                <div className="profile-row">
                    <div className="profile-label">Address</div>
                    <div className="profile-value">
                        {userData.address}, {userData.postcode}
                    </div>
                </div>
                <hr />
                <div className="profile-row">
                    <div className="profile-label">Customer Type</div>
                    <div className="profile-value">{userData.typeKlant}</div>
                </div>
                {userData.typeKlant === "Zakelijk" && (
                    <>
                        <hr />
                        <div className="profile-row">
                            <div className="profile-label">KVK Number</div>
                            <div className="profile-value">{userData.kvkNummer}</div>
                        </div>
                        <hr />
                        <div className="profile-row">
                            <div className="profile-label">Subscription</div>
                            <div className="profile-value">{userData.abonnement}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
