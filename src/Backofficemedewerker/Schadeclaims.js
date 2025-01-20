import React, { useState, useEffect } from "react";
import axios from "axios";
import SchadeclaimCard from "./SchadeclaimCard";

const DamageClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all"); // To filter approved/rejected claims

    const fetchClaims = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                "https://localhost:7017/api/Schadeclaim/schadeclaim"
            );
            setClaims(response.data);
        } catch (error) {
            setError(
                "Fout bij het ophalen van schadeclaims. Probeer het later opnieuw."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handleFilterChange = (status) => {
        setFilter(status);
    };

    const filteredClaims =
        filter === "all"
            ? claims
            : claims.filter((claim) => claim.status === filter);

    if (loading) {
        return <p>Gegevens worden geladen...</p>;
    }

    return (
        <div>
            <h1>Damage Claims</h1>

            {/* Filter Buttons */}
            <div style={styles.filterContainer}>
                <button
                    onClick={() => handleFilterChange("all")}
                    style={{
                        ...styles.filterButton,
                        backgroundColor: filter === "all" ? "#007BFF" : "#ddd",
                    }}
                >
                    All Claims
                </button>
                <button
                    onClick={() => handleFilterChange("Approved")}
                    style={{
                        ...styles.filterButton,
                        backgroundColor: filter === "Approved" ? "#4CAF50" : "#ddd",
                    }}
                >
                    Approved
                </button>
                <button
                    onClick={() => handleFilterChange("Rejected")}
                    style={{
                        ...styles.filterButton,
                        backgroundColor: filter === "Rejected" ? "#f44336" : "#ddd",
                    }}
                >
                    Rejected
                </button>
                <button
                    onClick={() => handleFilterChange("Pending")}
                    style={{
                        ...styles.filterButton,
                        backgroundColor: filter === "Pending" ? "#FF9800" : "#ddd",
                    }}
                >
                    Pending
                </button>
            </div>

            {/* Error Message */}
            {error && <p style={styles.error}>{error}</p>}

            {/* Display Claims */}
            {filteredClaims.length === 0 ? (
                <p>No claims found for the selected filter.</p>
            ) : (
                <div>
                    {filteredClaims.map((claim) => (
                        <SchadeclaimCard
                            key={claim.id}
                            claim={claim}
                            fetchClaims={fetchClaims}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Styles
const styles = {
    filterContainer: {
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
    },
    filterButton: {
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    error: {
        color: "red",
        fontWeight: "bold",
    },
};

export default DamageClaims;
