import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Employees.css";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        naam: "",
        achternaam: "",
        email: "",
        wachtwoord: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("https://localhost:7017/api/employees", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployees(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Fout bij ophalen van werknemers:", err);
                setError("Kan werknemers niet ophalen. Probeer later opnieuw.");
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleAddEmployee = async () => {
        if (!newEmployee.naam || !newEmployee.achternaam || !newEmployee.email || !newEmployee.wachtwoord) {
            alert("Vul alle velden in.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post("https://localhost:7017/api/employees/add", newEmployee, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees([...employees, response.data]);
            setNewEmployee({ naam: "", achternaam: "", email: "", wachtwoord: "" });
            alert("Werknemer succesvol toegevoegd.");
        } catch (err) {
            console.error("Fout bij toevoegen van werknemer:", err);
            alert("Er is een fout opgetreden bij het toevoegen van de werknemer.");
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`https://localhost:7017/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(employees.filter((employee) => employee.id !== id));
            alert("Werknemer succesvol verwijderd.");
        } catch (err) {
            console.error("Fout bij verwijderen van werknemer:", err);
            alert("Er is een fout opgetreden bij het verwijderen van de werknemer.");
        }
    };

    const handleUpdatePassword = async (id) => {
        const newPassword = prompt("Voer het nieuwe wachtwoord in:");
        if (!newPassword) return;

        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`https://localhost:7017/api/employees/${id}/update-password`, { wachtwoord: newPassword }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Wachtwoord succesvol gewijzigd.");
        } catch (err) {
            console.error("Fout bij wijzigen van wachtwoord:", err);
            alert("Er is een fout opgetreden bij het wijzigen van het wachtwoord.");
        }
    };

    return (
        <div className="employees-container">
            <h1>Werknemers Beheren</h1>
            {loading ? (
                <p>Werknemers laden...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <div className="add-employee-form">
                        <h2>Nieuwe werknemer toevoegen</h2>
                        <input
                            type="text"
                            placeholder="Naam"
                            value={newEmployee.naam}
                            onChange={(e) => setNewEmployee({ ...newEmployee, naam: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Achternaam"
                            value={newEmployee.achternaam}
                            onChange={(e) => setNewEmployee({ ...newEmployee, achternaam: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="E-mailadres"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Wachtwoord"
                            value={newEmployee.wachtwoord}
                            onChange={(e) => setNewEmployee({ ...newEmployee, wachtwoord: e.target.value })}
                        />
                        <button onClick={handleAddEmployee}>Werknemer Toevoegen</button>
                    </div>

                    <div className="employees-list">
                        <h2>Bestaande werknemers</h2>
                        <ul>
                            {employees.map((employee) => (
                                <li key={employee.id}>
                                    {employee.naam} {employee.achternaam} ({employee.email})
                                    <button onClick={() => handleDeleteEmployee(employee.id)}>Verwijder</button>
                                    <button onClick={() => handleUpdatePassword(employee.id)}>Wachtwoord Wijzigen</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

export default Employees;
