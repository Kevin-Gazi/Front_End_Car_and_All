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
            .get('https://localhost:7017/api/gebruiker/pending') // Update with your API endpoint
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
    const handleApprove = () => {
        axios
            .post('https://localhost:7017/api/gebruiker/approve')
            .then(() => {
                setSubscriptions((prev) => prev.filter((sub) => sub.abonnement.startsWith('PENDING/')));
            })
            .catch(() => alert('Failed to approve subscription.'));
    };

// Reject subscription
    const handleReject = () => {
        axios
            .post('https://localhost:7017/api/gebruiker/reject')
            .then(() => {
                setSubscriptions((prev) => prev.filter((sub) => sub.abonnement.startsWith('PENDING/')));
            })
            .catch(() => alert('Failed to reject subscription.'));
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
