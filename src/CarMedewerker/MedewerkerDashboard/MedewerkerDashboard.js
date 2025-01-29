import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('functie');

        if (!token || !role) {
            navigate("/login"); // Redirect to login if no token or role
        }
    }, [navigate]);

    return (
        <div>
            <h1>Welcome to the Employee Dashboard</h1>
            <p>This is the environment for the employee.</p>
            {/* Add more content here specific to employees */}
        </div>
    );
}

export default EmployeeDashboard;
