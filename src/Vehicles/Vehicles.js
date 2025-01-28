import React, { useState, useEffect } from 'react';
import './Vehicles.css';
import vehicleImage from './IMG_8180.JPG';
import { useNavigate } from 'react-router-dom';
import CorollaImage from './Corolla.jpg';
import FocusImage from './Focus.jpg';
import GolfImage from './Golf.jpg';
import CivicImage from './Civic.jpg';
import Serie3Image from './3Series.jpg';
import jwtDecode from "jwt-decode";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const navigate = useNavigate();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [missingUserInfo, setMissingUserInfo] = useState({
        telefoonNummer: "",
        adres: "",
        postcode: "",
    });
    const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);
        
    const authToken = localStorage.getItem('authToken');
    const safeJwtDecode = (authToken) => {
        if (!authToken) {
            console.error("Token is undefined or null");
            return null;
        }
        try {
            return jwtDecode(authToken);
        } catch (error) {
            console.error("Failed to decode token:", error.message);
            return null;
        }
    };
    const decodedToken = safeJwtDecode(authToken);

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

    const isConfirmModelOpen = () => {
        setIsConfirmModalOpen(true);
    }

    const fetchUnavailableDates = async (vehicleId) => {
        try {
            const response = await fetch(`https://localhost:7017/api/vehicles/${vehicleId}/unavailable-dates`);
            if (response.ok) {
                const dates = await response.json();
                setUnavailableDates(dates.map((date) => new Date(date).toISOString().split('T')[0]));
            } else {
                console.error('Error fetching unavailable dates:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching unavailable dates:', error);
        }
    };

    const vehicleImages = {
        1: CorollaImage,
        2: FocusImage,
        3: GolfImage,
        4: CivicImage,
        5: Serie3Image,
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
    const handleSaveUserInfo = async () => {
        if (!authToken) {
            alert('User is not logged in.');
            return;
        }
        const userId = decodedToken.sub;
        
        const userInfoToUpdate = {
            telefoonNummer: missingUserInfo.telefoonNummer?.trim() || null,
            adres: missingUserInfo.adres?.trim() || null,
            postcode: missingUserInfo.postcode?.trim() || null,
        };

        try {
            const response = await fetch(`https://localhost:7017/api/gebruiker/gegevens/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(userInfoToUpdate),
            });

            if (response.ok) {
                alert('Information updated successfully.');
                
                localStorage.setItem('telefoonNummer', userInfoToUpdate.telefoonNummer || "");
                localStorage.setItem('adres', userInfoToUpdate.adres || "");
                localStorage.setItem('postcode', userInfoToUpdate.postcode || "");
                
                setIsUserInfoModalOpen(false);
                setMissingUserInfo(null);
            } else {
                const errorText = await response.text();
                console.error('Failed to update information:', errorText);
                alert('Failed to update information.');
            }
        } catch (error) {
            console.error('Error updating user information:', error);
            alert('An error occurred while updating your information.');
        }
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
        //console.log(authToken);
    };



    const closeModal = () => {
        setIsModalOpen(false);
    };
    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleConfirmRent = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }


        if (new Date(endDate) < new Date(startDate)) {
            alert('End date cannot be earlier than start date.');
            return;
        }
        

        if (unavailableDates.includes(startDate) || unavailableDates.includes(endDate)) {
            alert('The selected dates are unavailable for rent.');
            return;
        }

        if (!selectedVehicle?.id) {
            alert('Invalid vehicle selected.');
            return;
        }

        try {
            if (!authToken) {
                alert('User is not logged in.');
                return;
            }

            const response = await fetch('https://localhost:7017/api/rentals/RentVehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,  
                },
                body: JSON.stringify({
                    gebruikerId: decodedToken?.sub,
                    voertuigId: selectedVehicle.id,
                    startDate: startDate,
                    endDate: endDate,
                }),
            });

            if (response.ok) {
                alert('Rental request submitted. Awaiting approval.');
                closeModal();
                closeConfirmModal();
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
        if (!authToken) {
            alert('Please log in to rent a vehicle.');
            navigate('/login');
            return;
        }

        const telefoonNummer = localStorage.getItem('telefoonNummer') || null;
        const adres = localStorage.getItem('adres') || null;
        const postcode = localStorage.getItem('postcode') || null;

        const isMissingInfo =
            !telefoonNummer?.trim() ||
            !adres?.trim() ||
            !postcode?.trim();

        if (isMissingInfo) {
            setMissingUserInfo({
                telefoonNummer: telefoonNummer || "",
                adres: adres || "",
                postcode: postcode || "",
            });
            setIsUserInfoModalOpen(true);
            return;
        }

        openModal(vehicle);
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
                    {filteredVehicles.map((vehicle, index) => (
                        <div className="vehicle-card" key={vehicle.id}>
                            <div className="vehicle-image">
                                <img
                                    src={vehicleImages[vehicle.id] || vehicle.image || vehicleImage}
                                    alt={`picture of ${vehicle.model}`}
                                />
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
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date()}
                                excludeDates={unavailableDates.map((date) => new Date(date))}
                                placeholderText="Select start date"
                            />
                        </label>

                        <label>
                            End Date:
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate || new Date()}
                                excludeDates={unavailableDates.map((date) => new Date(date))}
                                placeholderText="Select end date"
                            />
                        </label>

                        <button onClick={isConfirmModelOpen}>Confirm Rent</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
            {isConfirmModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>You are about to rent:</h2>
                        <p><strong>Vehicle:</strong> {selectedVehicle.model}</p>
                        <p><strong>From:</strong> {startDate?.toLocaleDateString()}</p>
                        <p><strong>Until:</strong> {endDate?.toLocaleDateString()}</p>
                        <p><strong>Total
                            price:</strong> €{selectedVehicle.prijsPerDag * (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)}
                        </p>


                        <button onClick={handleConfirmRent}>Confirm</button>
                        <button onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {isUserInfoModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Complete Your Information</h2>
                        <p>You need to fill in this form before you can rent a vehicle.</p>
                        <label>
                        Phone Number:
                            <input
                                type="text"
                                value={missingUserInfo.telefoonNummer}
                                onChange={(e) => setMissingUserInfo({...missingUserInfo, telefoonNummer: e.target.value})}
                            />
                        </label>
                        <label>
                            Address:
                            <input
                                type="text"
                                value={missingUserInfo.adres}
                                onChange={(e) => setMissingUserInfo({...missingUserInfo, adres: e.target.value})}
                            />
                        </label>
                        <label>
                            Postal Code:
                            <input
                                type="text"
                                value={missingUserInfo.postcode}
                                onChange={(e) => setMissingUserInfo({...missingUserInfo, postcode: e.target.value})}
                            />
                        </label>
                        <button onClick={handleSaveUserInfo}>Save</button>
                        <button onClick={() => setIsUserInfoModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}