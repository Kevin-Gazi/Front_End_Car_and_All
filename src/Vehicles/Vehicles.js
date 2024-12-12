import React from "react";
import "../App.css";
import Tesla_Model_S from "../Vehicles/Tesla_Model_S.png";
import BMW_3_Series from "../Vehicles/BMW_3_Series.png";
import MercedesBenz_C_Class from "../Vehicles/MercedesBenz_C_Class.png";
import Audi_A4 from "../Vehicles/Audi_A4.png";
import Ford_Mustang from "../Vehicles/Ford_Mustang.png";

export default function Vehicles() {
    const vehicles = [
        {
            name: "Tesla Model S",
            img: Tesla_Model_S,
        },
        {
            name: "BMW 3 Series",
            img: BMW_3_Series,
        },
        {
            name: "Mercedes-Benz C-Class",
            img: MercedesBenz_C_Class,
        },
        {
            name: "Audi A4",
            img: Audi_A4,
        },
        {
            name: "Ford Mustang",
            img: Ford_Mustang,
        },
    ];

    return (
        <div className="vehicles">
            <header className="vehicles-header">
                <h1>Our Vehicles</h1>
                <p>Explore our wide selection of cars available for rent.</p>
            </header>

            <section className="vehicle-grid">
                {vehicles.map((vehicle, index) => (
                    <div className="vehicle-card" key={index}>
                        <img src={vehicle.img} alt={vehicle.name} className="vehicle-image" />
                        <h2>{vehicle.name}</h2>
                    </div>
                ))}
            </section>
        </div>
    );
}