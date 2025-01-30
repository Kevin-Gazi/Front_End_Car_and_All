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
    const [searchQuery, setSearchQuery] = useState('');
    const [newVehicleFormData, setNewVehicleFormData] = useState({
        merk: '',
        model: '',
        type: '',
        kenteken: '',
        kleur: '',
        Aanschafjaar: '',
        prijsPerDag: '',
        isBeschikbaar: false,
    });
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

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

        setFormData((prev) => ({
            ...prev,
            merk: vehicle.merk,
            model: vehicle.model,
            type: vehicle.type,
            kenteken: vehicle.kenteken,
            kleur: vehicle.kleur,
            Aanschafjaar: vehicle.aanschafjaar || new Date().getFullYear(),
            prijsPerDag: vehicle.prijsPerDag,
            isBeschikbaar: vehicle.isBeschikbaar,
        }));
    };

    const closeEditPopup = () => {
        setEditingVehicle(null);
    };

    const openAddPopup = () => {
        setIsAddPopupOpen(true); 
    };

    const closeAddPopup = () => {
        setIsAddPopupOpen(false); 
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
        if (!editingVehicle || !editingVehicle.id) {
            console.error("Error: Vehicle ID is missing.");
            return;
        }

        console.log("FormData being sent:", formData); // Log de formData

        const token = localStorage.getItem("authToken");
        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/voertuigen/${editingVehicle.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: editingVehicle.id,
                    ...formData,
                }),
            });

            if (response.ok) {
                // Update de vehicles state met de nieuwe gegevens
                setVehicles((prev) =>
                    prev.map((v) =>
                        v.id === editingVehicle.id ? { ...v, ...formData } : v
                    )
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

    const handleAddVehicle = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await fetch("https://localhost:7017/api/carmedewerker/voertuigenToevoegen", {
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
        vehicle.merk.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="edit-vehicles-loading">Loading vehicles...</div>;
    if (error) return <div className="edit-vehicles-error">{error}</div>;

    return (
        <div className="edit-vehicles-container">
            <h1>Vehicle Management</h1>
            <button className="add-vehicle-btn" onClick={openAddPopup}>Add New Vehicle</button> 

            <input
                type="text"
                placeholder="Search by brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-brand"
            />

            <div className="edit-vehicles-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
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
                            {/*<button className="block-vehicle-btn" onClick={() => handleBlockVehicle(vehicle.id)}>Block</button>*/}
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
                        <label>Year of Purchase: <input name="Aanschafjaar" value={formData.Aanschafjaar || ''}
                                                        onChange={handleChange}/></label>
                        <label>Daily Rate: <input name="prijsPerDag" value={formData.prijsPerDag} onChange={handleChange}/></label>
                        <label>Availability:<input type="checkbox" name="isBeschikbaar" checked={formData.isBeschikbaar || false} onChange={handleChange}/></label>
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
                        <label>Brand: <input name="merk" value={newVehicleFormData.merk} onChange={handleNewVehicleChange}/></label>
                        <label>Model: <input name="model" value={newVehicleFormData.model} onChange={handleNewVehicleChange}/></label>
                        <label>Type: <input name="type" value={newVehicleFormData.type} onChange={handleNewVehicleChange}/></label>
                        <label>License Plate: <input name="kenteken" value={newVehicleFormData.kenteken} onChange={handleNewVehicleChange}/></label>
                        <label>Color: <input name="kleur" value={newVehicleFormData.kleur} onChange={handleNewVehicleChange}/></label>
                        <label>Year of Purchase: <input name="Aanschafjaar" value={newVehicleFormData.Aanschafjaar || ''} onChange={handleNewVehicleChange}/></label>
                        <label>Daily Rate: <input name="prijsPerDag" value={newVehicleFormData.prijsPerDag} onChange={handleNewVehicleChange}/></label>
                        <label>Availability:<input type="checkbox" name="isBeschikbaar" checked={newVehicleFormData.isBeschikbaar || false} onChange={handleNewVehicleChange}/></label>
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
