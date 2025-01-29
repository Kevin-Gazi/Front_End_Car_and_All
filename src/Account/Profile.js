import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false); // Edit-modus
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchData = async () => {
            console.log("[Frontend] Start retrieving profile");
            if (!token) {
                console.error("[Frontend] No token found.");
                setError("You are not logged in. Please log in to continue.");
                return;
            }

            try {
                const response = await fetch("https://localhost:7017/api/gebruiker/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error while retrieving profile.");
                }

                const data = await response.json();
                setUserData(data);
                setFormData(data); // Voor initialisatie van bewerkbare velden
            } catch (err) {
                console.error("[Frontend] Error:", err.message);
                setError(err.message);
            }
        };

        fetchData();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const payload = {
            Naam: formData.firstName || userData.firstName,
            Achternaam: formData.lastName || userData.lastName,
            Email: formData.email || userData.email,
            Telefoonnummer: formData.phone || userData.phone,
            Adres: formData.address || userData.address,
            Postcode: formData.postalCode || userData.postalCode,
            TypeKlant: userData.typeKlant, // Altijd meesturen
        };

        // Alleen KvkNummer meesturen voor zakelijke gebruikers
        if (userData.typeKlant === "Zakelijk") {
            payload.KvkNummer = userData.kvkNumber;
        }

        console.log("[Frontend] Payload to backend (save):", payload);

        try {
            const response = await fetch("https://localhost:7017/api/gebruiker/UpdateProfile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[Frontend] Received validation errors from backend:", errorData.errors);
                throw new Error(errorData.title || "Error while saving profile.");
            }

            console.log("[Frontend] Profile updated successfully");
            setUserData({ ...userData, ...formData }); // Werk profielgegevens bij in de UI
            setEditMode(false); // Sluit de edit-modus
        } catch (err) {
            console.error("[Frontend] Error saving:", err.message);
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch("https://localhost:7017/api/gebruiker/DeleteAccount", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[Frontend] Error deleting account:", errorData.message);
                throw new Error(errorData.message ||"Error while deleting account.");
            }

            console.log("[Frontend] Account successfully deleted");
            alert("Your account has been successfully deleted.");
            localStorage.removeItem("authToken");
            localStorage.removeItem('Typeklant');
            localStorage.removeItem('adres');
            localStorage.removeItem('postcode');
            localStorage.removeItem('telefoonNummer');
            localStorage.removeItem('userId');
            localStorage.removeItem('userKvkNumber');
            localStorage.removeItem("user");
            localStorage.clear();
            window.location.href = "/";
        } catch (err) {
            console.error("[Frontend] Error deleting account:", err.message);
            setError(err.message);
        }
    };

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    if (!userData) {
        return <div className="loading-container">Profile is loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Profile overview</h2>

                <div className="profile-row">
                    <div className="profile-label">Full Name:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleInputChange}
                                    placeholder="Surname"
                                />
                            </>
                        ) : (
                            `${userData.firstName} ${userData.lastName}`
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">E-mail:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.email
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">Phone number:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.phone
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">Address:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.address
                        )}
                    </div>
                </div>

                <div className="profile-row">
                    <div className="profile-label">Postcode:</div>
                    <div className="profile-value">
                        {editMode ? (
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            userData.postalCode
                        )}
                    </div>
                </div>

                {userData.typeKlant === "Zakelijk" && (
                    <>
                        <div className="profile-row">
                            <div className="profile-label">KVK Number:</div>
                            <div className="profile-value">{userData.kvkNumber}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Subscription:</div>
                            <div className="profile-value">{userData.subscription || "None"}</div>
                        </div>
                    </>
                )}

                <div className="profile-actions">
                    {editMode ? (
                        <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditMode(true)}>Edit</button>
                            <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
                                Delete Account
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
