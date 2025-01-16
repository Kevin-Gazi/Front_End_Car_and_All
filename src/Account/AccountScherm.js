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
    const [newEmployee, setNewEmployee] = useState({ naam: '', achternaam: '', email: '', wachtwoord: '', typeKlant: 'Werknemer'});
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

                if (decodedToken.userType === 'Employee') {
                    // Ophalen van employee gegevens
                    axios
                        .get(`https://localhost:7017/api/account`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        .then(response => {
                            setUser(response.data);
                            setIsLoading(false);
                        })
                        .catch(error => {
                            console.error('Fout bij ophalen werknemer:', error);
                            alert('Kan werknemer niet ophalen. Probeer later opnieuw.');
                            navigate('/');
                        });
                } else {
                    // Ophalen van gebruiker gegevens voor zakelijke gebruikers
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
                                    ZakelijkeGebruikerId: response.data.id
                                }));
                            }
                            setIsLoading(false);
                        })
                        .catch(error => {
                            console.error('Fout bij ophalen gebruiker:', error);
                            alert('Kan gebruiker niet ophalen. Probeer later opnieuw.');
                            navigate('/');
                        });
                }
            } catch (error) {
                console.error('Fout bij het decoderen van het token:', error);
                navigate('/');
            }
        }
    }, [navigate]);

    const handleDeleteEmployee = (employeeId) => {
        const token = localStorage.getItem('authToken');
        axios
            .delete(`https://localhost:7017/api/employee/${employeeId}/delete`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                setEmployees(employees.filter(employee => employee.id !== employeeId));
            })
            .catch(error => {
                console.error('Fout bij het verwijderen werknemer:', error);
                alert('Er is een fout opgetreden bij het verwijderen van de werknemer.');
            });
    };

    const handleUpdatePassword = (employeeId) => {
        const newPassword = prompt('Voer het nieuwe wachtwoord in:');
        if (newPassword) {
            const token = localStorage.getItem('authToken');
            axios
                .put(
                    `https://localhost:7017/api/employee/${employeeId}/update-password`,
                    { newPassword: newPassword },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                )
                .then(() => {
                    alert('Wachtwoord succesvol gewijzigd.');
                })
                .catch(error => {
                    console.error('Fout bij het wijzigen van wachtwoord:', error);
                    alert('Er is een fout opgetreden bij het wijzigen van het wachtwoord.');
                });
        }
    };

    const handleAddEmployee = () => {
        const token = localStorage.getItem('authToken');

        // Controleer of alle velden ingevuld zijn
        if (!newEmployee.naam || !newEmployee.achternaam || !newEmployee.email || !newEmployee.wachtwoord) {
            alert('Vul alle velden in.');
            return;
        }

        // Maak het employeeData-object en voeg ZakelijkeGebruikerId en KlantType toe
        const employeeData = {
            naam: newEmployee.naam,
            achternaam: newEmployee.achternaam,
            email: newEmployee.email,
            password: newEmployee.wachtwoord, // Gebruik 'password' voor de backend
            gebruikerId: user.id, // ID van de zakelijke gebruiker
            typeKlant: 'Werknemer', // Specificeer het klanttype
        };

        console.log('Verstuurde gegevens:', employeeData); // Debugging

        // Verstuur het verzoek naar de backend
        axios
            .post(
                `https://localhost:7017/api/employee/add-employee`,
                employeeData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(response => {
                // Voeg de nieuwe werknemer toe aan de lijst
                setEmployees([...employees, response.data]);
                // Reset de invoervelden
                setNewEmployee({ naam: '', achternaam: '', email: '', wachtwoord: '' });
                alert('Werknemer succesvol toegevoegd.');
            })
            .catch(error => {
                console.error('Fout bij het toevoegen van werknemer:', error.response ? error.response.data : error.message);
                alert('Het is niet gelukt een Werknemer aan te maken.');
            });
    };





    const handleEditData = () => {
        const token = localStorage.getItem('authToken');
        axios
            .put(
                `https://localhost:7017/api/account/update`,
                { email: newEmail, newPassword: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                setUser(prevUser => ({
                    ...prevUser,
                    email: newEmail || prevUser.email
                }));
                setEditing(false);
            })
            .catch(error => {
                console.error('Fout bij het bijwerken van gegevens:', error);
                alert('Kan gegevens niet bijwerken. Controleer je invoer en probeer opnieuw.');
            });
    };

    return (
        <div className="account-container">
            <h1>Account</h1>
            {isLoading ? (
                <p>Details worden geladen...</p>
            ) : (
                user && (
                    <div>
                        <p><strong>Naam:</strong> {user.naam}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Klanttype:</strong> {user.typeKlant}</p>
                        {user.typeKlant === 'Zakelijk' && (
                            <div>
                                <p><strong>KvK-Nummer:</strong> {user.kvkNummer}</p>
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
                                        <button onClick={handleEditData}>Bevestig wijzigingen</button>
                                        <button onClick={() => setEditing(false)}>Annuleer</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setEditing(true)}>Bewerk accountgegevens</button>
                                )}
                                <h3>Werknemer toevoegen:</h3>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Naam"
                                        value={newEmployee.naam}
                                        onChange={(e) => setNewEmployee({...newEmployee, naam: e.target.value})}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Achternaam"
                                        value={newEmployee.achternaam}
                                        onChange={(e) => setNewEmployee({...newEmployee, achternaam: e.target.value})}
                                    />
                                    <input
                                        type="email"
                                        placeholder="E-mailadres"
                                        value={newEmployee.email}
                                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Wachtwoord"
                                        value={newEmployee.wachtwoord}
                                        onChange={(e) => setNewEmployee({...newEmployee, wachtwoord: e.target.value})}
                                    />
                                    <button onClick={handleAddEmployee}>Werknemer toevoegen</button>
                                </div>
                            </div>
                        )}
                        <h4>Werknemers:</h4>
                        {employees.length === 0 ? (
                            <p>Je hebt nog geen werknemers toegevoegd.</p>
                        ) : (
                            <ul>
                                {employees.map(employee => (
                                    <li key={employee.id}>
                                        {employee.naam} ({employee.email})
                                        <button onClick={() => handleDeleteEmployee(employee.id)}>Verwijder</button>
                                        <button onClick={() => handleUpdatePassword(employee.id)}>Wachtwoord wijzigen</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )
            )}
        </div>
    );
}

export default Account;
