import React, { useEffect, useState } from "react";
import "./CarEmployeeScherm.css"; // Zelfde stijl als BusinessRequests.css

const CarEmployeeScherm = () => {
    const [employees, setEmployees] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [formData, setFormData] = useState({
        Naam: "",
        Achternaam: "",
        Wachtwoord: "",
        Adres: "",
        Email: "",
        Telefoonnummer: "",
        Functie: "BackOffice",
    });
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // ✅ Ophalen van medewerkers
    const fetchEmployees = async () => {
        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/get-employees", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Serverfout." }));
                throw new Error(errorData.message || "Fout bij het ophalen van medewerkers.");
            }

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("[Frontend] Fout bij ophalen van medewerkers:", error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [token]);

    // ✅ Afhandelen van formulierinput
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Medewerker aanmaken
    const handleCreateEmployee = async () => {
        const payload = {
            Naam: formData.Naam,
            Achternaam: formData.Achternaam,
            Wachtwoord: formData.Wachtwoord,
            Adres: formData.Adres,
            Email: formData.Email,
            Telefoonnummer: formData.Telefoonnummer,
            Functie: formData.Functie,
        };

        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/register-medewerker", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Fout tijdens aanmaken van medewerker.");
            }

            alert("Medewerker succesvol geregistreerd.");
            setFormData({ Naam: "", Achternaam: "", Wachtwoord: "", Adres: "", Email: "", Telefoonnummer: "", Functie: "BackOffice" });
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Fout bij registreren medewerker:", err.message);
            setError(err.message);
        }
    };

    // ✅ Bewerken van medewerker (alleen functie en wachtwoord)
    const handleEdit = (employee) => {
        setEditMode(employee.id);
        setFormData({ Functie: employee.functie, Wachtwoord: "" });
    };

    // ✅ Opslaan van wijzigingen
    const handleSave = async (id) => {
        const payload = {
            Functie: formData.Functie,
            Wachtwoord: formData.Wachtwoord || "",
        };

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/update-employee/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Fout tijdens bijwerken van medewerker.");
            }

            alert("Medewerker succesvol bijgewerkt.");
            setEditMode(null);
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Fout bij bijwerken medewerker:", err.message);
            setError(err.message);
        }
    };

    // ✅ Verwijderen van een medewerker
    const handleDelete = async (id) => {
        if (!window.confirm("Weet u zeker dat u deze medewerker wilt verwijderen?")) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/delete-employee/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Fout tijdens verwijderen van medewerker.");
            }

            alert("Medewerker succesvol verwijderd.");
            fetchEmployees();
        } catch (err) {
            console.error("[Frontend] Fout bij verwijderen medewerker:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="employees-container">
            <h2>CarandAll Medewerkers Beheren</h2>
            {error && <p className="error">{error}</p>}
            <div className="employee-form">
                <h3>Nieuwe medewerker toevoegen</h3>
                <input type="text" name="Naam" value={formData.Naam} onChange={handleInputChange} placeholder="Voornaam" required />
                <input type="text" name="Achternaam" value={formData.Achternaam} onChange={handleInputChange} placeholder="Achternaam" required />
                <input type="password" name="Wachtwoord" value={formData.Wachtwoord} onChange={handleInputChange} placeholder="Wachtwoord" required />
                <input type="text" name="Adres" value={formData.Adres} onChange={handleInputChange} placeholder="Adres" required />
                <input type="email" name="Email" value={formData.Email} onChange={handleInputChange} placeholder="E-mail" required />
                <input type="tel" name="Telefoonnummer" value={formData.Telefoonnummer} onChange={handleInputChange} placeholder="Telefoonnummer" required />
                <select name="Functie" value={formData.Functie} onChange={handleInputChange}>
                    <option value="BackOffice">BackOffice</option>
                    <option value="FrontOffice">FrontOffice</option>
                </select>
                <button onClick={handleCreateEmployee}>Toevoegen</button>
            </div>
            {/* ✅ Medewerkers grid */}
            <div className="employee-list">
                <h3>Huidige Medewerkers</h3>
                <div className="requests-container">
                    {employees.map((employee) => (
                        <div key={employee.id} className="request-card">
                            {editMode === employee.id ? (
                                <div className="edit-form">
                                    <select name="Functie" value={formData.Functie} onChange={handleInputChange}>
                                        <option value="BackOffice">BackOffice</option>
                                        <option value="FrontOffice">FrontOffice</option>
                                    </select>
                                    <input type="password" name="Wachtwoord" value={formData.Wachtwoord} onChange={handleInputChange} placeholder="Nieuw wachtwoord" />
                                    <button className="save-btn" onClick={() => handleSave(employee.id)}>Opslaan</button>
                                    <button className="delete-btn" onClick={() => setEditMode(null)}>Annuleren</button>
                                </div>
                            ) : (
                                <>
                                    <div className="request-details">
                                        <p><strong>Naam:</strong> {employee.naam} {employee.achternaam}</p>
                                        <p><strong>Email:</strong> {employee.email}</p>
                                        <p><strong>Functie:</strong> {employee.functie}</p>
                                    </div>
                                    <div className="request-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(employee)}>Bewerken</button>
                                        <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Verwijderen</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarEmployeeScherm;
