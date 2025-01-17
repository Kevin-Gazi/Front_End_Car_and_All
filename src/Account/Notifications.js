import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("https://localhost:7017/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotifications(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Fout bij het ophalen van meldingen:", err);
                setError("Kan meldingen niet ophalen. Probeer later opnieuw.");
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`https://localhost:7017/api/notifications/${id}/mark-as-read`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notifications.filter((notification) => notification.id !== id));
            alert("Melding gemarkeerd als gelezen.");
        } catch (err) {
            console.error("Fout bij markeren als gelezen:", err);
            alert("Kan melding niet markeren als gelezen.");
        }
    };

    return (
        <div className="notifications-container">
            <h1>Meldingen</h1>
            {loading ? (
                <p>Meldingen laden...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : notifications.length > 0 ? (
                <ul className="notifications-list">
                    {notifications.map((notification) => (
                        <li key={notification.id} className="notification-item">
                            <p>{notification.message}</p>
                            <button onClick={() => handleMarkAsRead(notification.id)}>Markeer als gelezen</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Geen nieuwe meldingen.</p>
            )}
        </div>
    );
}

export default Notifications;
