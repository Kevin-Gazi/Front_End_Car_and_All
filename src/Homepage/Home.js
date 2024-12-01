import React from "react";

export default function Home() {
    return (
        <div className="home">
            {/* Hero Section */}
            <header className="home-hero">
                <h1>Welcome to Car And All</h1>
                <p>Your trusted platform for renting vehicles, tailored to your needs.</p>
                <a href="/vehicles" className="btn btn-primary">Explore Vehicles</a>
            </header>

            {/* About Section */}
            <section className="about">
                <h2>About Us</h2>
                <p>
                    At Car And All, we pride ourselves on offering a seamless and reliable car rental experience.
                    Whether you're planning a weekend getaway, a business trip, or just need a vehicle for your daily commute,
                    we have the perfect solution for you.
                </p>
            </section>

            {/* Benefits Section */}
            <section className="benefits">
                <h2>Why Choose Us?</h2>
                <div className="benefit-list">
                    <div className="benefit-item">
                        <h3>Wide Selection</h3>
                        <p>From compact cars to luxury vehicles, we have it all.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>Flexible Plans</h3>
                        <p>Choose from hourly, daily, weekly, or monthly rentals.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>24/7 Support</h3>
                        <p>Our team is here to assist you whenever you need us.</p>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="cta">
                <h2>Ready to Get Started?</h2>
                <p>Discover our range of vehicles and find the one that suits your needs.</p>
                <a href="/vehicles" className="btn btn-secondary">Browse Vehicles</a>
            </section>
        </div>
    );
}