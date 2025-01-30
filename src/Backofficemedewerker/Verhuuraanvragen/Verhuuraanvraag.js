import React, { useState, useEffect } from 'react';
import './Verhuuraanvraag.css';

export default function RentalRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('https://localhost:7017/api/rentals/GetRentals');
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const data = await response.json();

                const mappedRequests = data.map((r) => ({
                    id: r.id,
                    vehicleId: r.voertuigId,
                    userId: r.gebruikerId,
                    price: r.prijs,
                    status: r.status,
                    isGoedgekeurd: r.isGoedgekeurd,
                }));
                setRequests(mappedRequests);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rental requests:', error);
                setError('Failed to fetch rental requests. Please try again later.');
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await fetch(
                `https://localhost:7017/api/rentals/${id}/approve?isApproved=true`,
                { method: 'PATCH' }
            );

            if (response.ok) {
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.id === id ? { ...request, status: 'Approved', isGoedgekeurd: true } : request
                    )
                );
            } else {
                console.error('Failed to approve request:', response.statusText);
            }
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await fetch(
                `https://localhost:7017/api/rentals/${id}/approve?isApproved=false`,
                { method: 'PATCH' }
            );

            if (response.ok) {
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.id === id ? { ...request, status: 'Rejected', isGoedgekeurd: false } : request
                    )
                );
            } else {
                console.error('Failed to reject request:', response.statusText);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading rental requests...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="rental-requests">
            <h1>Rental Requests</h1>
            <div className="requests-container">
                {requests.length === 0 ? ( 
                    <div className="no-requests-message">
                        There are no rental requests at the moment.
                    </div>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="request-card">
                            <div className="request-details">
                                <p><strong>Vehicle ID:</strong> {request.vehicleId}</p>
                                <p><strong>User ID:</strong> {request.userId}</p>
                                <p><strong>Price:</strong> ${request.price}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                            </div>
                            <div className="request-actions">
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApprove(request.id)}
                                    disabled={request.status !== 'Pending'}
                                >
                                    Approve
                                </button>
                                <button
                                    className="reject-btn"
                                    onClick={() => handleReject(request.id)}
                                    disabled={request.status !== 'Pending'}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}