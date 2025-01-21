import React from "react";
import './Home.css';
import happyCustomer from './happy_man.jpg'
import carRental from './Car_Rental.jpg'
import experienceDrive from './Experience_the_drive.jpg'
import { Link } from 'react-router-dom'; 

export default function Home() {
    return (
        <>
            <div className="home">
                {/* Hero Section */}
                <header className="hero-section">
                    <div className="hero-text-container">
                        <h1 className="home-hero"><b>Welcome to Car And All!</b></h1>
                        <p className="home-hero-text">Your trusted platform for renting vehicles, tailored to your
                            needs. Our team is here to assist you whenever you need us.</p>
                        <div className="buttons">
                            <Link to="/vehicles">
                                <button className="vehicles-button">VEHICLES</button>
                            </Link>
                            <Link to="/Contact">
                                <button className="contact-button">CONTACT</button>
                            </Link>
                        </div>
                    </div>
                    <img src={happyCustomer} alt="Happy customer" className="image-happy"/>
                </header>

                {/*<img src={carRental} alt="Car keys" className="image-keys"/>*/}

                {/* About Section */}
                <div className="about_image">
                    <section className="about-section">
                        <h2>About Us</h2>
                        <p>At Car And All, we pride ourselves on offering a seamless and reliable car rental experience.
                            Whether you're planning a weekend getaway, a business trip, or just need a vehicle for your
                            daily commute, we have the perfect solution for you.</p>
                        <p>Choose from hourly, daily, weekly, or monthly rentals. Our team is here to assist you
                            whenever you need us.</p>
                    </section>
                    <img src={experienceDrive} alt="Experience the drive" className="image-experience"/>
                </div>

                {/* Footer-Section */}
                <footer className="footer-section">
                    <h2>EXPERIENCE THE DRIVE</h2>
                    <p>Discover our range of vehicles and find the one that suits your needs.</p>
                </footer>
            </div>
        </>
    );
}
