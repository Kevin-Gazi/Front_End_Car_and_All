import React, { useEffect, useState } from "react";
import "./NotificationScherm.css"
const NotificationScherm = () => {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.error("Token niet gevonden in localStorage.");
                    return;
                }

                const response = await fetch("https://localhost:7017/api/gebruiker/notifications", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.error(`Server responded with status ${response.status}: ${response.statusText}`);
                    throw new Error("Failed to fetch notifications");
                }

                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };


        fetchNotifications();
    }, [token]);

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                    <div className="notification-header">
                        <h3>{notification.subject}</h3>
                        <p>{notification.body}</p>
                    </div>
                    <div className="notification-date">
                        <p>{new Date(notification.date).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationScherm;
