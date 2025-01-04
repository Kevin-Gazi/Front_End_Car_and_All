    // AccountScherm.js
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
                                // Stel het KvK-nummer in van het ingelogde account
                                setNewEmployee(prevState => ({
                                    ...prevState,
                                    kvkNummer: response.data.kvkNummer
                                }));
                            }
                        })
                        .catch(error => {
                            console.error('Fout bij ophalen gebruiker:', error);
                            navigate('/');
                        });
                } catch (error) {
                    console.error('Fout bij het decoderen van het token:', error);
                    navigate('/');
                }
            }
        }, [navigate]);

        const handleAddEmployee = () => {
            const token = localStorage.getItem("authToken");
            axios
                .post(
                    `https://localhost:7017/api/Employee/${user.id}/add-employee`,
                    newEmployee,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => {
                    setEmployees([...employees, response.data]);
                    setNewEmployee({ naam: "", achternaam: "", email: "", wachtwoord: "", kvkNummer: user.kvkNummer });
                })
                .catch((error) => {
                    console.error("Fout bij het toevoegen van werknemer:", error);
                });
        };


        return (
            <div className="account-container">
                <h1>Account</h1>
    
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.naam}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Customer type:</strong> {user.typeKlant}</p>
                        <p><strong>KvKNummer:</strong> {user.kvkNummer}</p>

                        {user.typeKlant === 'Zakelijk' && (
                            <div>
                                <h3>Employees:</h3>
                                <ul>
                                    {employees.map(employee => (
                                        <li key={employee.id}>{employee.naam} ({employee.email})</li>
                                    ))}
                                </ul>

                                <h4>Add an employee:</h4>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newEmployee.naam}
                                    onChange={(e) => setNewEmployee({...newEmployee, naam: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={newEmployee.achternaam}
                                    onChange={(e) => setNewEmployee({...newEmployee, achternaam: e.target.value})}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={newEmployee.wachtwoord}
                                    onChange={(e) => setNewEmployee({...newEmployee, wachtwoord: e.target.value})}
                                />
                                <button onClick={handleAddEmployee}>Add employee</button>
                            </div>
                        )}

                        {editing ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="New email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button>Edit data</button>
                                <button onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <button onClick={() => setEditing(true)}>Change data</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        );
    }
    
    export default Account;
