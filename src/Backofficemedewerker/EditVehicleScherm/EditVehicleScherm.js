import React, { useState, useEffect } from "react";
import "./EditVehicleScherm.css";

export default function EditVehicleScreen() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        type: '',
        licensePlate: '',
        color: '',
        purchaseYear: '',
        dailyRate: '',
        isAvailable: false,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [newVehicleFormData, setNewVehicleFormData] = useState({
        brand: '',
        model: '',
        type: '',
        licensePlate: '',
        color: '',
        purchaseYear: '',
        dailyRate: '',
        isAvailable: false,
    });
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // Stands for opening the 'Add' popup

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://localhost:7017/api/vehicles/GetAllVehicles");
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const data = await response.json();
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
            brand: vehicle.brand,
            model: vehicle.model,
            type: vehicle.type,
            licensePlate: vehicle.licensePlate,
            color: vehicle.color,
            purchaseYear: vehicle.purchaseYear || '',
            dailyRate: vehicle.dailyRate,
            isAvailable: vehicle.isAvailable,
        });
    };

    const closeEditPopup = () => {
        setEditingVehicle(null);
    };

    const openAddPopup = () => {
        setIsAddPopupOpen(true); // Open the "Add Vehicle" popup
    };

    const closeAddPopup = () => {
        setIsAddPopupOpen(false); // Close the "Add Vehicle" popup
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleNewVehicleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setNewVehicleFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/vehicles/${editingVehicle.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
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
            const response = await fetch(`https://localhost:7017/api/carmedewerker/block-vehicle/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setVehicles((prevVehicles) =>
                    prevVehicles.map((vehicle) =>
                        vehicle.id === id ? { ...vehicle, isAvailable: false } : vehicle
                    )
                );
            } else {
                console.error('Failed to block vehicle:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error blocking vehicle:', error);
        }
    };

    const handleAddVehicle = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/add-vehicle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newVehicleFormData),
            });

            if (response.ok) {
                const addedVehicle = await response.json();
                setVehicles((prev) => [...prev, addedVehicle]);
                closeAddPopup();
            } else {
                console.error("Failed to add vehicle:", response.status);
            }
        } catch (error) {
            console.error("Error adding vehicle:", error);
        }
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="edit-vehicles-loading">Loading vehicles...</div>;
    if (error) return <div className="edit-vehicles-error">{error}</div>;

    return (
        <div className="edit-vehicles-container">
            <h1>Vehicle Management</h1>
            <button className="add-vehicle-btn" onClick={openAddPopup}>Add New Vehicle</button> {/* Button to open the popup */}

            <input
                type="text"
                placeholder="Search by brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-brand"
            />

            <div className="edit-vehicles-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="edit-vehicle-card">
                        <div className="edit-vehicle-details">
                            <p><strong>Brand:</strong> {vehicle.brand}</p>
                            <p><strong>Model:</strong> {vehicle.model}</p>
                            <p><strong>Type:</strong> {vehicle.type}</p>
                            <p><strong>License plate:</strong> {vehicle.licensePlate}</p>
                            <p><strong>Color:</strong> {vehicle.color}</p>
                            <p><strong>Year of purchase:</strong> {vehicle.purchaseYear}</p>
                            <p><strong>Daily rate:</strong> €{vehicle.dailyRate}</p>
                            <p><strong>Availability:</strong> {vehicle.isAvailable ? "Available" : "Not available"}</p>
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
                        <label>Brand: <input name="brand" value={formData.brand} onChange={handleChange}/></label>
                        <label>Model: <input name="model" value={formData.model} onChange={handleChange}/></label>
                        <label>Type: <input name="type" value={formData.type} onChange={handleChange}/></label>
                        <label>License Plate: <input name="licensePlate" value={formData.licensePlate} onChange={handleChange}/></label>
                        <label>Color: <input name="color" value={formData.color} onChange={handleChange}/></label>
                        <label>Year of Purchase: <input name="purchaseYear" value={formData.purchaseYear || ''} onChange={handleChange}/></label>
                        <label>Daily Rate: <input name="dailyRate" value={formData.dailyRate} onChange={handleChange}/></label>
                        <label>Availability:<input type="checkbox" name="isAvailable" checked={formData.isAvailable || false} onChange={handleChange}/></label>
                        <div className="edit-vehicle-popup-actions">
                            <button className="save-vehicle-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-vehicle-btn" onClick={closeEditPopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Vehicle Popup */}
            {isAddPopupOpen && (
                <div className="edit-vehicle-popup">
                    <div className="edit-vehicle-popup-content">
                        <h2>Add Vehicle</h2>
                        <label>Brand: <input name="brand" value={newVehicleFormData.brand} onChange={handleNewVehicleChange}/></label>
                        <label>Model: <input name="model" value={newVehicleFormData.model} onChange={handleNewVehicleChange}/></label>
                        <label>Type: <input name="type" value={newVehicleFormData.type} onChange={handleNewVehicleChange}/></label>
                        <label>License Plate: <input name="licensePlate" value={newVehicleFormData.licensePlate} onChange={handleNewVehicleChange}/></label>
                        <label>Color: <input name="color" value={newVehicleFormData.color} onChange={handleNewVehicleChange}/></label>
                        <label>Year of Purchase: <input name="purchaseYear" value={newVehicleFormData.purchaseYear || ''} onChange={handleNewVehicleChange}/></label>
                        <label>Daily Rate: <input name="dailyRate" value={newVehicleFormData.dailyRate} onChange={handleNewVehicleChange}/></label>
                        <label>Availability:<input type="checkbox" name="isAvailable" checked={newVehicleFormData.isAvailable || false} onChange={handleNewVehicleChange}/></label>
                        <div className="edit-vehicle-popup-actions">
                            <button className="save-vehicle-btn" onClick={handleAddVehicle}>Save</button>
                            <button className="cancel-vehicle-btn" onClick={closeAddPopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
