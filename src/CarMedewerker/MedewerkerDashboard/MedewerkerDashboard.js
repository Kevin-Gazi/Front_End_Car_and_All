import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MedewerkerDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const functie = localStorage.getItem('functie');

        if (!token || !functie) {
            navigate("/login"); // Redirect naar login als er geen token of functie is
        }
    }, [navigate]);

    return (
        <div>
            <h1>Welcome to the Employee Dashboard</h1>
            <p>This is the environment for the employee.</p>
            {/* Voeg hier extra content toe die specifiek is voor medewerkers */}
        </div>
    );
}

export default MedewerkerDashboard;
