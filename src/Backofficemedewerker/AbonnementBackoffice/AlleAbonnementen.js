import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleAbonnementen.css'

const App = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch subscriptions
    useEffect(() => {
        axios
            .get('https://localhost:7017/api/gebruiker/pending') 
            .then((response) => {
                setSubscriptions(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load subscriptions.');
                setLoading(false);
            });
    }, []);

    // Approve subscription
    const handleApprove = (sub) => {
        axios
            .post(
                'https://localhost:7017/api/gebruiker/approve',
                sub.id, 
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then(() => {
                setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
            })
            .catch((error) => {
                console.error('Failed to approve subscription:', error.response?.data || error.message);
                alert('Failed to approve subscription.');
            });
    };

// Reject subscription
    const handleReject = (sub) => {
        axios
            .post(
                'https://localhost:7017/api/gebruiker/reject',
                sub.id, 
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then(() => {
                setSubscriptions((prev) => prev.filter((s) => s.id !== sub.id));
            })
            .catch((error) => {
                console.error('Failed to reject subscription:', error.response?.data || error.message);
                alert('Failed to reject subscription.');
            });
    };


    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h1>Subscription Management</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Last Name</th>
                    <th>Type</th>
                    <th>Subscription</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {subscriptions.map((sub) => {
                    const isPending = sub.abonnement.startsWith('Pending/');
                    return (
                        <tr
                            key={sub.id}
                            style={{
                                backgroundColor: isPending ? '#fff3cd' : 'transparent',
                                color: isPending ? '#856404' : 'inherit',
                            }}
                        >
                            <td>{sub.id}</td>
                            <td>{sub.naam}</td>
                            <td>{sub.achternaam}</td>
                            <td>{sub.typeKlant}</td>
                            <td>{sub.abonnement}</td>
                            <td>
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleApprove(sub)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleReject(sub)}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default App;
