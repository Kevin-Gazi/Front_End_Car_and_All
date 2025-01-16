import React, { useState, useEffect } from 'react';
import './Vehicles.css';
import vehicleImage from './IMG_8180.JPG';
import { useNavigate } from 'react-router-dom';

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rentalDate, setRentalDate] = useState({ start: '', end: '' });

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

    const openModal = (vehicle) => {
        console.log('Modal openen voor voertuig:', vehicle);
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmRent = async () => {
        if (!rentalDate.start || !rentalDate.end) {
            alert('Please select both start and end dates.');
            return;
        }

        if (new Date(rentalDate.end) < new Date(rentalDate.start)) {
            alert('End date cannot be earlier than start date.');
            return;
        }
        
        const startDate = new Date(rentalDate.start).toISOString().split('T')[0];
        const endDate = new Date(rentalDate.end).toISOString().split('T')[0];

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('https://localhost:7017/api/rentals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    gebruikerId: user.userId,
                    voertuigId: selectedVehicle.id,
                    startDate: startDate,
                    endDate: endDate
                }),
            });

            if (response.ok) {
                alert('Rental request submitted. Awaiting approval.');
                closeModal();
            } else {
                alert('Failed to rent vehicle.');
                console.log('Error:', response.status, await response.text());
            }
        } catch (error) {
            console.error('Error renting vehicle:', error);
            alert('An error occurred while processing your rental.');
        }
    };


    const handleRentClick = (vehicle) => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('Gebruiker uit localStorage:', user);
        if (!user) {
            alert('Please log in to rent a vehicle.');
            navigate('/login');
        } else {
            openModal(vehicle);
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
                                <button onClick={() => handleRentClick(vehicle)}>Rent</button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Select Rental Dates</h2>
                        <label>
                            Start Date:
                            <input
                                type="date"
                                value={rentalDate.start}
                                onChange={(e) => setRentalDate({ ...rentalDate, start: e.target.value })}
                            />
                        </label>
                        <label>
                            End Date:
                            <input
                                type="date"
                                value={rentalDate.end}
                                onChange={(e) => setRentalDate({...rentalDate, end: e.target.value})}
                                min={rentalDate.start}
                            />
                        </label>

                        <button onClick={handleConfirmRent}>Confirm Rent</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
