import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MedewerkerDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check of er een geldig token is opgeslagen in localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate("/login"); // Als geen token, ga naar login pagina
        }
    }, [navigate]);

    return (
        <div>
            <h1>Welkom in het Medewerker Dashboard</h1>
            <p>Dit is de omgeving voor de medewerker.</p>
            {/* Voeg hier extra content toe die specifiek is voor medewerkers */}
        </div>
    );
}

export default MedewerkerDashboard;
