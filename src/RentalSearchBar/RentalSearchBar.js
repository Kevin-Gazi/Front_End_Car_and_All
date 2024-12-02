import React, { useState } from 'react';

const RentalSearchBar = () => {
    const [vehicleType, setVehicleType] = useState('personenauto');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const handleSearch = () => {
        console.log({
            vehicleType,
            pickupDate,
            returnDate,
        });
        alert('Zoekopdracht verzonden!');
    };

    return (
        <div
            style={{
                background: '#00337a',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '20px',color:'white', fontSize: '20px' }}>
                <h1>Welcome to Car And All</h1>
                <p>Your trusted platform for renting vehicles, tailored to your needs.</p>
            </div>

            <div style={{
                backgroundColor: "#00337a",
                borderRadius: '10px',
                padding: '20px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    {['personenauto', 'camper', 'caravan'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setVehicleType(type)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: vehicleType === type ? '#FF6600' : '#ffffff',
                                color: vehicleType === type ? '#ffffff' : '#000000',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Van</label>
                        <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tot</label>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        style={{
                            alignSelf: 'flex-end',
                            padding: '10px 20px',
                            backgroundColor: '#FF6600',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Zoek
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentalSearchBar;