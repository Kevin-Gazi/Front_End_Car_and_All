import React from "react";
import "./Vehicles.css"; // Zorg ervoor dat de styling wordt geïmporteerd

export default function Vehicles() {
    const vehicles = [
        {
            name: "Tesla Model S",
            img: "https://tesla-cdn.thron.com/delivery/public/image/tesla/9c7393d8-81e5-4dd9-b0ed-3d9783e82d5a/bvlatuR/std/2880x1800/MS-Interior-Hero-Desktop",
        },
        {
            name: "BMW 3 Series",
            img: "https://www.bmw.nl/content/dam/bmw/common/all-models/3-series/sedan/2022/highlights/BMW-3-series-sedan-highlights-exterior-890x501.jpg",
        },
        {
            name: "Mercedes-Benz C-Class",
            img: "https://www.mercedes-benz.com/en/vehicles/passenger-cars/c-class/saloon/_jcr_content/image/MQ6-12-image-20210202102238/01-mercedes-benz-vehicles-c-class-saloon-3400x1440.jpeg",
        },
        {
            name: "Audi A4",
            img: "https://www.audi.com/content/dam/ci-models/a4/a4-sedan/2021/models-main-image/audi-a4-limousine-mmis-audi-ag-int.jpg",
        },
        {
            name: "Ford Mustang",
            img: "https://www.ford.com/cmslibs/content/dam/brand_ford/en_us/brand/performance/mustang/2024/collections/3-2/24_mst_fp_rhd_int_32.jpg/_jcr_content/renditions/cq5dam.web.1440.1440.jpeg",
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