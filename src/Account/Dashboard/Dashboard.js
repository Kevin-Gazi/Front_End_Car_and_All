import React, { useEffect, useState } from "react";

function Dashboard() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const storedUserName = localStorage.getItem("userNaam"); // Aanpassen op basis van wat je opslaat
        if (!token) {
            window.location.href = "/login"; // Gebruiker terugsturen als deze niet ingelogd is
        }
        setUserName(storedUserName || "Gebruiker");
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Welcome {userName}</h1>
            <p>Dit is je persoonlijke dashboard.</p>
        </div>
    );
}


export default Dashboard;
