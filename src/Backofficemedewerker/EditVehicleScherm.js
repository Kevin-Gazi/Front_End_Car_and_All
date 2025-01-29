import React, { useState, useEffect } from "react";
import "./EditVehicleScherm.css";

export default function EditVehicleScherm() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [formData, setFormData] = useState({
        merk: '',
        model: '',
        type: '',
        kenteken: '',
        kleur: '',
        Aanschafjaar: '',
        prijsPerDag: '',
        isBeschikbaar: false,
    });


    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://localhost:7017/api/vehicles/GetAllVehicles");
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const data = await response.json();
                /*console.log(data); //debug*/
                setVehicles(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                setError("Failed to fetch vehicles. Please try again later.");
            }
        };

        fetchVehicles();
    }, []);

    const openEditPopup = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            merk: vehicle.merk,
            model: vehicle.model,
            type: vehicle.type,
            kenteken: vehicle.kenteken,
            kleur: vehicle.kleur,
            Aanschafjaar: vehicle.aanschafjaar || '', 
            prijsPerDag: vehicle.prijsPerDag,
            isBeschikbaar: vehicle.isBeschikbaar,
        });
    };

    const closeEditPopup = () => {
        setEditingVehicle(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        console.log(`Changing field: ${name} to ${value}`);

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };



    const handleSave = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/voertuigen/${editingVehicle.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log(formData)
                setVehicles((prev) =>
                    prev.map((v) => (v.id === editingVehicle.id ? { ...formData } : v))
                );
                closeEditPopup();
            } else {
                console.error("Failed to update vehicle:", response.status);
            }
        } catch (error) {
            console.error("Error updating vehicle:", error);
        }
    };

    const handleBlockVehicle = async (id) => {
        if (!window.confirm("Are you sure you want to block this vehicle?")) return;

        const token = localStorage.getItem("authToken");

        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/blokkeer-voertuig/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setVehicles((prevVehicles) =>
                    prevVehicles.map((vehicle) =>
                        vehicle.id === id ? { ...vehicle, isBeschikbaar: false } : vehicle
                    )
                );
            } else {
                console.error('Failed to block vehicle:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error blocking vehicle:', error);
        }
    };

    if (loading) return <div className="edit-vehicles-loading">Loading vehicles...</div>;
    if (error) return <div className="edit-vehicles-error">{error}</div>;

    return (
        <div className="edit-vehicles-container">
            <h1>Vehicle Management</h1>
            <div className="edit-vehicles-list">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="edit-vehicle-card">
                        <div className="edit-vehicle-details">
                            <p><strong>Brand:</strong> {vehicle.merk}</p>
                            <p><strong>Model:</strong> {vehicle.model}</p>
                            <p><strong>Type:</strong> {vehicle.type}</p>
                            <p><strong>License plate:</strong> {vehicle.kenteken}</p>
                            <p><strong>Color:</strong> {vehicle.kleur}</p>
                            <p><strong>Year of purchase:</strong> {vehicle.aanschafjaar}</p>
                            <p><strong>Daily rate:</strong> €{vehicle.prijsPerDag}</p>
                            <p><strong>Availability:</strong> {vehicle.isBeschikbaar ? "Available" : "Not available"}</p>
                        </div>
                        <div className="edit-vehicle-actions">
                            <button className="edit-vehicle-btn" onClick={() => openEditPopup(vehicle)}>Edit</button>
                            <button className="block-vehicle-btn" onClick={() => handleBlockVehicle(vehicle.id)}>Block</button>
                        </div>
                    </div>
                ))}
            </div>

            {editingVehicle && (
                <div className="edit-vehicle-popup">
                    <div className="edit-vehicle-popup-content">
                        <h2>Edit Vehicle</h2>
                        <label>Brand: <input name="merk" value={formData.merk} onChange={handleChange}/></label>
                        <label>Model: <input name="model" value={formData.model} onChange={handleChange}/></label>
                        <label>Type: <input name="type" value={formData.type} onChange={handleChange}/></label>
                        <label>License Plate: <input name="kenteken" value={formData.kenteken} onChange={handleChange}/></label>
                        <label>Color: <input name="kleur" value={formData.kleur} onChange={handleChange}/></label>
                        <label>Year of Purchase: <input name="Aanschafjaar" value={formData.Aanschafjaar || ''} onChange={handleChange}/></label>
                        <label>Daily Rate: <input name="prijsPerDag" value={formData.prijsPerDag} onChange={handleChange}/></label>
                        <label>Availability:<input type="checkbox" name="isBeschikbaar" checked={formData.isBeschikbaar || false} onChange={handleChange}/></label>
                        <div className="edit-vehicle-popup-actions">
                            <button className="save-vehicle-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-vehicle-btn" onClick={closeEditPopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
