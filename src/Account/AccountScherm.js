import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function Account({ setIsLoggedIn }) {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ naam: '', achternaam: '', email: '', wachtwoord: '', typeKlant: 'Werknemer', kvkNummer: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.sub;

                axios
                    .get(`https://localhost:7017/api/gebruiker/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    .then(response => {
                        setUser(response.data);
                        if (response.data.typeKlant === 'Zakelijk') {
                            setEmployees(response.data.employees);
                            setNewEmployee(prevState => ({
                                ...prevState,
                                kvkNummer: response.data.kvkNummer
                            }));
                        }
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error('Fout bij ophalen gebruiker:', error);
                        setError('Kan gebruiker niet ophalen. Probeer later opnieuw.');
                        navigate('/');
                    });
            } catch (error) {
                console.error('Fout bij het decoderen van het token:', error);
                navigate('/');
            }
        }
    }, [navigate]);

    const handleDeleteEmployee = (employeeId) => {
        const token = localStorage.getItem('authToken');
        axios
            .delete(`https://localhost:7017/api/Employee/${employeeId}/delete`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                setEmployees(employees.filter(employee => employee.id !== employeeId));
            })
            .catch(error => {
                console.error('Fout bij het verwijderen van werknemer:', error);
                setError('Er is een fout opgetreden bij het verwijderen van de werknemer.');
            });
    };
    const handleUpdatePassword = (employeeId) => {
        const newPassword = prompt('Voer het nieuwe wachtwoord in:');
        if (newPassword) {
            const token = localStorage.getItem('authToken');
            axios
                .put(
                    `https://localhost:7017/api/Employee/${employeeId}/update-password`,
                    { newPassword: newPassword }, // Verstuur de nieuwe wachtwoord in een object
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json', // Voeg deze header toe
                        }
                    }
                )
                .then(() => {
                    alert('Wachtwoord succesvol gewijzigd.');
                })
                .catch(error => {
                    console.error('Fout bij het wijzigen van wachtwoord:', error);
                    setError('Er is een fout opgetreden bij het wijzigen van het wachtwoord.');
                });
        }
    };



    const handleAddEmployee = () => {
        const token = localStorage.getItem('authToken');
        if (!newEmployee.naam || !newEmployee.achternaam || !newEmployee.email || !newEmployee.wachtwoord) {
            setError('Alle velden zijn verplicht.');
            return;
        }

        // Controleer of de e-mail al bestaat
        axios
            .get(`https://localhost:7017/api/Employee/check-email/${newEmployee.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.data.exists) {
                    setError('E-mail bestaat al in de database.');
                } else {
                    // Voeg nieuwe werknemer toe
                    axios
                        .post(
                            `https://localhost:7017/api/Employee/${user.id}/add-employee`,
                            newEmployee,
                            { headers: { Authorization: `Bearer ${token}` } }
                        )
                        .then(response => {
                            setEmployees([...employees, response.data]);
                            setNewEmployee({ naam: '', achternaam: '', email: '', wachtwoord: '', kvkNummer: user.kvkNummer });
                            setError('');
                        })
                        .catch(error => {
                            console.error('Fout bij het toevoegen van werknemer:', error);
                            if (error.response && error.response.data) {
                                setError(error.response.data);
                            } else {
                                setError('Er is een fout opgetreden bij het toevoegen van de werknemer. Probeer opnieuw.');
                            }
                        });
                }
            })
            .catch(error => {
                console.error('Fout bij het controleren van e-mail:', error);
                setError('Er is een fout opgetreden bij het controleren van de e-mail.');
            });
    };

    const handleEditData = () => {
        const token = localStorage.getItem('authToken');
        axios
            .put(
                `https://localhost:7017/api/gebruiker/${user.id}/update`,
                { email: newEmail, newPassword: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                setUser(prevUser => ({
                    ...prevUser,
                    email: newEmail || prevUser.email
                }));
                setEditing(false);
                setError('');
            })
            .catch(error => {
                console.error('Fout bij het bijwerken van gegevens:', error);
                setError('Kan gegevens niet bijwerken. Controleer je invoer en probeer opnieuw.');
            });
    };

    return (
        <div className="account-container">
            <h1>Account</h1>
            {isLoading ? (
                <p>Gegevens laden...</p>
            ) : (
                user && (
                    <div>
                        <p><strong>Naam:</strong> {user.naam}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Type klant:</strong> {user.typeKlant}</p>
                        {user.typeKlant === 'Zakelijk' && (
                            <div>
                                <p><strong>KvKNummer:</strong> {user.kvkNummer}</p>
                                <h3>Werknemers:</h3>
                                <ul>
                                    {employees.map(employee => (
                                        <li key={employee.id}>
                                            {employee.naam} ({employee.email})
                                            <button onClick={() => handleDeleteEmployee(employee.id)}>Verwijder</button>
                                            <button onClick={() => handleUpdatePassword(employee.id)}>Wijzig wachtwoord</button>
                                        </li>
                                    ))}
                                </ul>
                                <h4>Voeg een werknemer toe:</h4>
                                {error && <p className="error-message">{error}</p>}
                                <input
                                    type="text"
                                    placeholder="Voornaam"
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
                                <button onClick={handleAddEmployee}>Voeg werknemer toe</button>
                            </div>
                        )}
                        {editing ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nieuw e-mailadres"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Nieuw wachtwoord"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button onClick={handleEditData}>Gegevens bijwerken</button>
                                <button onClick={() => setEditing(false)}>Annuleren</button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing(true)}>Wijzig gegevens</button>
                        )}
                    </div>
                )
            )}
        </div>
    );
}

export default Account;
