import React, { useState, useEffect } from "react";
import "./BusinessRequests.css";

export default function BusinessRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch("https://localhost:7017/api/carmedewerker/business-requests");
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const data = await response.json();
                setRequests(data);
            } catch (error) {
                setError("Failed to fetch business account requests.");
                console.error("Error fetching business requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // ✅ Approve Business Account (PATCH request)
    const handleApproval = async (id) => {
        try {
            console.log(`🔹 Sending approval request for ID: ${id}`);

            const response = await fetch(
                `https://localhost:7017/api/carmedewerker/approve-business/${id}`,
                { method: "PATCH" }
            );

            if (response.ok) {
                setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
                console.log(`✅ Business account (ID: ${id}) approved successfully.`);
            } else {
                const errorText = await response.text();
                console.error(`❌ Approval error for ID ${id}:`, errorText);
            }
        } catch (error) {
            console.error(`❌ Server error for ID ${id}:`, error);
        }
    };

    // ✅ Reject Business Account (DELETE request)
    const handleRejection = async (id) => {
        try {
            console.log(`🔹 Sending rejection request for ID: ${id}`);

            const response = await fetch(
                `https://localhost:7017/api/carmedewerker/reject-business/${id}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
                console.log(`✅ Business account (ID: ${id}) rejected and deleted successfully.`);
            } else {
                const errorText = await response.text();
                console.error(`❌ Rejection error for ID ${id}:`, errorText);
            }
        } catch (error) {
            console.error(`❌ Server error for ID ${id}:`, error);
        }
    };

    if (loading) return <div className="loading">Loading business account requests...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="business-requests">
            <h1>Business Account Requests</h1>
            <div className="requests-container">
                {requests.map((request) => (
                    <div key={request.id} className="request-card">
                        <div className="request-details">
                            <p><strong>ID:</strong> {request.id}</p>  {/* ✅ Display User ID */}
                            <p><strong>Name:</strong> {request.naam} {request.achternaam}</p>
                            <p><strong>Email:</strong> {request.email}</p>
                            <p><strong>KVK Number:</strong> {request.kvkNummer}</p>
                            <p><strong>Registered On:</strong> {new Date(request.registratieDatum).toLocaleDateString()}</p>
                        </div>
                        <div className="request-actions">
                            <button className="approve-btn" onClick={() => handleApproval(request.id)}>
                                Approve
                            </button>
                            <button className="reject-btn" onClick={() => handleRejection(request.id)}>
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
