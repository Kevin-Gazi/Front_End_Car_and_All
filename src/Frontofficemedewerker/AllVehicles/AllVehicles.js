import React, { useState, useEffect } from 'react';
import './AllVehicles.css';
import vehicleImage from './IMG_8180.JPG';
import CorollaImage from './Corolla.jpg';
import FocusImage from './Focus.jpg';
import GolfImage from './Golf.jpg';
import CivicImage from './Civic.jpg';

export default function VehicleList() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [blockMessage, setBlockMessage] = useState(""); // Added state for block message

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('https://localhost:7017/api/rentals/voertuigen');
                const data = await response.json();
                setVehicles(data);
                setFilteredVehicles(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleBlock = async (vehicleId) => {
        try {
            const response = await fetch(`https://localhost:7017/api/carmedewerker/blokkeer-voertuig/${vehicleId}`, {
                method: 'PATCH',
            });

            if (response.ok) {
                setBlockMessage("Vehicle successfully blocked.");

                // Correctly update state immutably
                const updatedVehicles = vehicles.map(vehicle =>
                    vehicle.id === vehicleId ? { ...vehicle, IsBeschikbaar: false } : vehicle
                );
                setVehicles(updatedVehicles);
            } else {
                setBlockMessage("Error blocking the vehicle.");
            }
        } catch (error) {
            setBlockMessage("An error occurred. Please try again later.");
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        let filtered = vehicles;

        if (selectedType && selectedType !== 'All') {
            filtered = filtered.filter((vehicle) => vehicle.type === selectedType);
        }

        if (selectedBrand.length > 0) {
            filtered = filtered.filter((vehicle) => selectedBrand.includes(vehicle.merk));
        }

        if (selectedColor.length > 0) {
            filtered = filtered.filter((vehicle) => selectedColor.includes(vehicle.kleur));
        }

        setFilteredVehicles(filtered);
    }, [selectedType, selectedBrand, selectedColor, vehicles]);

    const getUniqueBrands = () => {
        const brands = filteredVehicles.map(vehicle => vehicle.merk);
        return [...new Set(brands)];
    };

    const getUniqueColors = () => {
        const colors = filteredVehicles.map(vehicle => vehicle.kleur);
        return [...new Set(colors)];
    };

    const handleBrandChange = (e) => {
        const brand = e.target.value;
        setSelectedBrand(prevState =>
            prevState.includes(brand)
                ? prevState.filter(item => item !== brand)
                : [...prevState, brand]
        );
    };

    const handleColorChange = (e) => {
        const color = e.target.value;
        setSelectedColor(prevState =>
            prevState.includes(color)
                ? prevState.filter(item => item !== color)
                : [...prevState, color]
        );
    };

    const vehicleImages = {
        1: CorollaImage,
        2: FocusImage,
        3: GolfImage,
        4: CivicImage,
    };

    if (loading) {
        return <div>Loading vehicles...</div>;
    }

    return (
        <div className="vehicle-list">
            <header className="vehicle-list-header">
                <h1>Vehicle Information</h1>
                <p>Browse the details of all available vehicles.</p>
            </header>
            <div className="vehicle-list-container">
                <div className="vehicle-list-filters">
                    <div className="vehicle-list-filter-category">
                        <h3>Type</h3>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="All"
                                checked={selectedType === 'All'}
                                onChange={(e) => setSelectedType(e.target.value)}
                            />
                            All
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="Auto"
                                checked={selectedType === 'Auto'}
                                onChange={(e) => setSelectedType(e.target.value)}
                            />
                            Car
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="Caravan"
                                checked={selectedType === 'Caravan'}
                                onChange={(e) => setSelectedType(e.target.value)}
                            />
                            Caravan
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="Camper"
                                checked={selectedType === 'Camper'}
                                onChange={(e) => setSelectedType(e.target.value)}
                            />
                            Camper
                        </label>
                    </div>

                    <div className="vehicle-list-filter-category">
                        <h3>Brand</h3>
                        {getUniqueBrands().map((brand) => (
                            <label key={brand}>
                                <input
                                    type="checkbox"
                                    value={brand}
                                    checked={selectedBrand.includes(brand)}
                                    onChange={handleBrandChange}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>

                    <div className="vehicle-list-filter-category">
                        <h3>Color</h3>
                        {getUniqueColors().map((color) => (
                            <label key={color}>
                                <input
                                    type="checkbox"
                                    value={color}
                                    checked={selectedColor.includes(color)}
                                    onChange={handleColorChange}
                                />
                                {color}
                            </label>
                        ))}
                    </div>
                </div>

                <section className="vehicle-list-grid">
                    {blockMessage && <div className="block-message">{blockMessage}</div>} {/* Display block message */}
                    {filteredVehicles.map((vehicle) => (
                        <div className="vehicle-list-card" key={vehicle.id}>
                            <div className="vehicle-list-image">
                                <img
                                    src={vehicleImages[vehicle.id] || vehicle.image || vehicleImage}
                                    alt={`picture of ${vehicle.model}`}
                                />
                            </div>
                            <div className="vehicle-list-details">
                                <h2>{vehicle.model}</h2>
                                <p><strong>Brand:</strong> {vehicle.merk}</p>
                                <p><strong>Type:</strong> {vehicle.type}</p>
                                <p><strong>Color:</strong> {vehicle.kleur}</p>
                                <p><strong>License Plate:</strong> <span style={{whiteSpace: 'pre-wrap'}}>{vehicle.kenteken}</span></p>
                                <p><strong>Year:</strong> {vehicle.aanschafjaar}</p>
                            </div>
                            <div className="vehicle-list-price">
                                <p><strong>ID:</strong> {vehicle.id}</p>
                                <p><strong>Available:</strong> {vehicle.IsBeschikbaar ? 'Yes' : 'No'}</p>
                                <p><strong>Price:</strong>€ {vehicle.prijsPerDag} / day</p>
                                <button
                                    className="block-btn"
                                    onClick={() => handleBlock(vehicle.id)}
                                >
                                    Block
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

            </div>
        </div>
    );
}
