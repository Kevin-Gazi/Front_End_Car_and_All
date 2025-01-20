import React, { useState, useEffect } from 'react';
import './Vehicles.css';
import vehicleImage from './IMG_8180.JPG';
import { useNavigate } from 'react-router-dom';

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const navigate = useNavigate();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [selectedType, setSelectedType] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rentalDate, setRentalDate] = useState({ start: '', end: '' });

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('https://localhost:7017/api/vehicles/GetVehicles');
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

    const fetchUnavailableDates = async (vehicleId) => {
        try {
            const response = await fetch(`https://localhost:7017/api/vehicles/${vehicleId}/unavailable-dates`);
            console.log('Status code:', response.status);
            const text = await response.text();
            console.log('Response text:', text);


            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            if (text) {
                try {
                    const dates = JSON.parse(text);
                    setUnavailableDates(dates.map(date => new Date(date).toISOString().split('T')[0]));
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    alert('Error parsing the unavailable dates response.');
                }
            } else {
                console.warn('Received empty response for unavailable dates.');
                setUnavailableDates([]);
            }
        } catch (error) {
            console.error('Error fetching unavailable dates:', error);
            alert('An error occurred while fetching unavailable dates.');
        }
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
        if (!vehicle?.id) {
            console.error('Vehicle ID is missing or invalid:', vehicle);
            alert('Invalid vehicle selected.');
            return;
        }
        setSelectedVehicle(vehicle);
        fetchUnavailableDates(vehicle.id);
        setIsModalOpen(true);
        console.log('Modal state set to open:', true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    /*const checkVehicleAvailability = async () => {
        const startDate = new Date(rentalDate.start).toISOString().split('T')[0];
        const endDate = new Date(rentalDate.end).toISOString().split('T')[0];

        try {
            const response = await fetch(
                `https://localhost:7017/api/vehicles/availability?voertuigId=${selectedVehicle.id}&startDate=${startDate}&endDate=${endDate}`
            );
            const data = await response.json();
            return data.isAvailable;
        } catch (error) {
            console.error('Error checking vehicle availability:', error);
            return false;
        }
    };*/

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

        // Check if the selected dates are unavailable
        if (unavailableDates.includes(startDate) || unavailableDates.includes(endDate)) {
            alert('The selected dates are unavailable for rent.');
            return;
        }

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
                                min={new Date().toISOString().split('T')[0]} // Stel de minimale datum in op vandaag
                                onChange={(e) => setRentalDate({...rentalDate, start: e.target.value})}
                            />
                        </label>
                        <label>
                            End Date:
                            <input
                                type="date"
                                value={rentalDate.end}
                                min={rentalDate.start || new Date().toISOString().split('T')[0]} // Stel minimale datum in op startDate of vandaag
                                onChange={(e) => setRentalDate({...rentalDate, end: e.target.value})}
                            />
                        </label>

                        <button onClick={handleConfirmRent}>Confirm Rent</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
            {isConfirmModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>You are about to rent:</h2>
                        <p><strong>Vehicle:</strong> {selectedVehicle.model}</p>
                        <p><strong>From:</strong> {rentalDate.start}</p>
                        <p><strong>Until:</strong> {rentalDate.end}</p>
                        <p><strong>Total price:</strong> €{selectedVehicle.prijsPerDag * (new Date(rentalDate.end) - new Date(rentalDate.start)) / (1000 * 60 * 60 * 24)}</p>

                        <button onClick={handleRentClick}>Confirm</button>
                        <button onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
