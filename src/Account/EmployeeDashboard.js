import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div>
            <h1>Employee Dashboard</h1>
            <p>Welcome to your dashboard. Here you can manage your notifications, rentals, and account settings.</p>
            {/* Voeg hier extra inhoud toe specifiek voor werknemers */}
        </div>
    );
}

export default EmployeeDashboard;
