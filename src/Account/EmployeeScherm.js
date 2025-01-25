import React, { useEffect, useState } from "react";
import "./Employees.css";

const EmployeeScherm = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        Naam: "",
        Achternaam: "",
        Email: "",
        Password: "",
    });
    const [editMode, setEditMode] = useState(null); // Voor de huidige werknemer in edit-modus
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // Ophalen van werknemers
    const fetchEmployees = async () => {
        try {
            const response = await fetch("https://localhost:7017/api/employee/GetEmployees", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Fout tijdens ophalen van werknemers.");
            }

            const data = await response.json();
            console.log("[Frontend] Opgehaalde werknemers:", data);
            setEmployees(data);
        } catch (err) {
            console.error("[Frontend] Fout bij ophalen van werknemers:", err.message);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [token]);

    // Afhandelen van formulierinput
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Aanmaken van een werknemer
    const handleCreateEmployee = async () => {
        const payload = {
            Naam: formData.Naam,
            Achternaam: formData.Achternaam,
            Email: formData.Email,
            Password: formData.Password,
        };

        console.log("[Frontend] Verzonden payload:", payload);

        try {
            const response = await fetch("https://localhost:7017/api/employee/CreateEmployee", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[Frontend] Fout ontvangen van backend:", errorData);
                throw new Error(errorData.message || "Fout tijdens aanmaken van werknemer.");
            }

            alert("Werknemer succesvol aangemaakt.");
            setFormData({ Naam: "", Achternaam: "", Email: "", Password: "" });
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Fout bij aanmaken werknemer:", err.message);
            setError(err.message);
        }
    };

    // Verwijderen van een werknemer
    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Weet u zeker dat u deze werknemer wilt verwijderen?")) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/employee/DeleteEmployee/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Fout tijdens verwijderen van werknemer.");
            }

            alert("Werknemer succesvol verwijderd.");
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Fout bij verwijderen werknemer:", err.message);
            setError(err.message);
        }
    };

    // Bewerken van een werknemer
    const handleEdit = (employee) => {
        setEditMode(employee.id); // Stel de werknemer-ID in de edit-modus
        setFormData(employee); // Vul het formulier met de bestaande gegevens van de werknemer
    };

    // Opslaan van wijzigingen
    const handleSave = async () => {
        try {
            const payload = {
                Naam: formData.naam,
                Achternaam: formData.achternaam,
                Email: formData.email,
                Password: formData.password || "", // Alleen bijwerken als ingevuld
            };

            const response = await fetch(`https://localhost:7017/api/employee/UpdateEmployee/${editMode}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Fout tijdens bijwerken van werknemer.");
            }

            alert("Werknemer succesvol bijgewerkt.");
            setEditMode(null); // Sluit de edit-modus
            fetchEmployees(); // Update de lijst
        } catch (err) {
            console.error("[Frontend] Fout bij bijwerken werknemer:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="employees-container">
            <h2>Werknemers Beheren</h2>
            {error && <p className="error">{error}</p>}
            <div className="employee-form">
                <h3>Nieuwe werknemer toevoegen</h3>
                <input
                    type="text"
                    name="Naam"
                    value={formData.Naam}
                    onChange={handleInputChange}
                    placeholder="Voornaam"
                    required
                />
                <input
                    type="text"
                    name="Achternaam"
                    value={formData.Achternaam}
                    onChange={handleInputChange}
                    placeholder="Achternaam"
                    required
                />
                <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    placeholder="E-mail"
                    required
                />
                <input
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    placeholder="Wachtwoord"
                    required
                />
                <button onClick={handleCreateEmployee}>Toevoegen</button>
            </div>

            <div className="employee-list">
                <h3>Huidige werknemers</h3>
                {employees.map((employee) => (
                    <div key={employee.id} className="employee-card">
                        {editMode === employee.id ? (
                            <>
                                <input
                                    type="text"
                                    name="naam"
                                    value={formData.naam || ""}
                                    onChange={handleInputChange}
                                    placeholder="Voornaam"
                                />
                                <input
                                    type="text"
                                    name="achternaam"
                                    value={formData.achternaam || ""}
                                    onChange={handleInputChange}
                                    placeholder="Achternaam"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    placeholder="E-mail"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password || ""}
                                    onChange={handleInputChange}
                                    placeholder="Nieuw wachtwoord (optioneel)"
                                />
                                <button onClick={handleSave}>Opslaan</button>
                                <button onClick={() => setEditMode(null)}>Annuleren</button>
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong>Naam:</strong> {employee.naam} {employee.achternaam}
                                </p>
                                <p>
                                    <strong>E-mail:</strong> {employee.email}
                                </p>
                                <button onClick={() => handleEdit(employee)}>Bewerken</button>
                                <button
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    style={{ backgroundColor: "red", color: "white" }}
                                >
                                    Verwijder Werknemer
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeScherm;
