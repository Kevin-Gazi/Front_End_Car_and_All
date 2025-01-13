import React from "react";
import './Home.css';


export default function Home() {
    return (
        <>
        <div className="home">
            {/* Hero Section */}
            <header>
                <h1 className="home-hero"><b>Welcome to Car And All</b></h1>
                <p className="home-hero-text">Your trusted platform for renting vehicles, tailored to your needs.</p>
            </header>

            {/* About Section */}
            <section>
                <h2 className="about">About Us</h2>
                <p className = "about-text">
                    At Car And All, we pride ourselves on offering a seamless and reliable car rental experience.
                    Whether you're planning a weekend getaway, a business trip, or just need a vehicle for your daily commute,
                    we have the perfect solution for you.
                </p>
            </section>

            {/* Benefits Section */}
            <section className="benefits">
                <div className="benefit-list">
                    <div>
                        <h3 className="benefit-item">Wide Selection</h3>
                        <p className = "benefit-text">From compact cars to luxury vehicles, we have it all.</p>
                    </div>
                    <div>
                        <h3 className="benefit-item">Flexible Plans</h3>
                        <p className = "benefit-text">Choose from hourly, daily, weekly, or monthly rentals.</p>
                    </div>
                    <div>
                        <h3 className="benefit-item">24/7 Support</h3>
                        <p className = "benefit-text">Our team is here to assist you whenever you need us.</p>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section>
                <h2 className="cta">Ready to Get Started?</h2>
                <p className = "cta-text">Discover our range of vehicles and find the one that suits your needs.</p>
            </section>
        </div>
        </>
    );
}