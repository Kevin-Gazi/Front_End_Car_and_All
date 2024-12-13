import React, { useState, useEffect } from 'react';
import './Vehicles.css';

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]); // Om voertuigen op te slaan
    const [filteredVehicles, setFilteredVehicles] = useState([]); // Gefilterde voertuigen
    const [loading, setLoading] = useState(true);  // Om te checken of de data wordt geladen
    const [selectedVehicle, setSelectedVehicle] = useState(null); // Voor geselecteerd voertuig
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Voor popup zichtbaar of niet

    // States voor de geselecteerde filters
    const [selectedType, setSelectedType] = useState('All'); // Zet 'All' als de standaardwaarde
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);

    useEffect(() => {
        // Haal de voertuigen op van de backend API
        const fetchVehicles = async () => {
            try {
                const response = await fetch('https://localhost:7017/api/voertuig');
                const data = await response.json();
                setVehicles(data);  // Sla de voertuigen op in de state
                setFilteredVehicles(data); // Zet de gefilterde voertuigen ook op de data
                setLoading(false);   // Markeer dat de data geladen is
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setLoading(false);  // Zorg ervoor dat de loading-state wordt beëindigd bij fout
            }
        };

        fetchVehicles();
    }, []); // Lege dependency array zorgt ervoor dat de fetch alleen bij de eerste render wordt uitgevoerd

    const handleVehicleClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsPopupOpen(true); // Open de pop-up
    };

    const closePopup = () => {
        setIsPopupOpen(false); // Sluit de pop-up
    };

    // Filter de voertuigen op basis van de geselecteerde filters
    useEffect(() => {
        let filtered = vehicles;

        // Als selectedType niet leeg is, filter dan op type
        if (selectedType && selectedType !== 'All') {
            filtered = filtered.filter((vehicle) => vehicle.type === selectedType);
        }

        if (selectedBrand.length > 0) {
            filtered = filtered.filter((vehicle) => selectedBrand.includes(vehicle.merk));
        }

        if (selectedColor.length > 0) {
            filtered = filtered.filter((vehicle) => selectedColor.includes(vehicle.kleur));
        }

        setFilteredVehicles(filtered); // Zet de gefilterde voertuigen
    }, [selectedType, selectedBrand, selectedColor, vehicles]);

    // Als de data nog niet geladen is, toon dan een laadindicatie
    if (loading) {
        return <div>Loading vehicles...</div>;
    }

    // Dynamisch merk opties maken
    const getUniqueBrands = () => {
        const brands = vehicles.map(vehicle => vehicle.merk);
        return [...new Set(brands)];
    };

    // Dynamisch kleur opties maken
    const getUniqueColors = () => {
        const colors = vehicles.map(vehicle => vehicle.kleur);
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

    // Handle "All" type button
    const handleAllTypeClick = () => {
        setSelectedType('All'); // Zet de type terug naar 'All'
    };

    return (
        <div className="vehicles">
            <header className="vehicles-header">
                <h1>Our Vehicles</h1>
                <p>Explore our wide selection of cars available for rent.</p>
            </header>

            <div className="vehicles-container">
                <div className="filters">
                    {/* Filteren voor Type */}
                    <div className="filter-category">
                        <h3>Type</h3>
                        {/* All optie als radio button */}
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

                    {/* Filteren voor Merk */}
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

                    {/* Filteren voor Kleur */}
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
                        <div className="vehicle-card" key={vehicle.id} onClick={() => handleVehicleClick(vehicle)}>
                            <img
                                src={`https://localhost:7017/images/${vehicle.model}.png`} // Zorg ervoor dat de afbeelding beschikbaar is
                                alt={vehicle.model}
                                className="vehicle-image"
                            />
                            <h2>{vehicle.model}</h2>
                            <p>Brand: {vehicle.merk}</p>
                            <p>Type: {vehicle.type}</p>
                            <p>Price per day: €{vehicle.prijsPerDag}</p>
                        </div>
                    ))}
                </section>
            </div>

            {isPopupOpen && selectedVehicle && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>{selectedVehicle.model}</h2>
                        <p>Brand: {selectedVehicle.merk}</p>
                        <p>Type: {selectedVehicle.type}</p>
                        <p>Price per day: €{selectedVehicle.prijsPerDag}</p>
                        <p>Color: {selectedVehicle.kleur}</p>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
