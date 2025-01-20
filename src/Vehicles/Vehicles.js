import React, { useState, useEffect } from 'react';
import './Vehicles.css';
import vehicleImage from './IMG_8180.JPG';

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [selectedType, setSelectedType] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('https://localhost:7017/api/vehicles');
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

    // Filter vehicles based on selected filters
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

    // Get unique values for brands and colors based on filtered vehicles
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

    const handleRentClick = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please log in to rent a vehicle.');
            window.location.href = 'Login';
        } else {
            // Mock rental request
            alert(`Rental request submitted for vehicle: ${selectedVehicle.model}`);
            // Add real rental API logic here
        }
    };

    if (loading) {
        return <div>Loading vehicles...</div>;
    }

    return (
        <div className="vehicles">
            <header className="vehicles-header">
                <h1>Our Vehicles</h1>
                <p>Explore our wide selection of vehicles available for rent.</p>
            </header>

            <div className="vehicles-container">
                <div className="filters">
                    <div className="filter-category">
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
                            Auto
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

                    <div className="filter-category">
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

                    <div className="filter-category">
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

                <section className="vehicle-grid">
                    {filteredVehicles.map((vehicle) => (
                        <div className="vehicle-card" key={vehicle.id}>
                            <div className="vehicle-image">
                                <img src={vehicle.image || vehicleImage} alt="picture of vehicle"/>
                            </div>
                            <div className="vehicle-start">
                                <h2>{vehicle.model}</h2>
                                <p>Brand: {vehicle.merk}</p>
                                <p>Type: {vehicle.type}</p>
                                <p>Color: {vehicle.kleur}</p>
                            </div>
                            <div className="vehicle-end">
                                <p><strong>€ {vehicle.prijsPerDag}</strong> / day</p>
                                <button onClick={handleRentClick}>Rent</button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
