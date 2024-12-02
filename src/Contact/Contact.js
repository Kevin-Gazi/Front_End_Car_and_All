import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact us!</h1>
            <p className="contact-description">
                Do you have any questions, comments, or would you like more information about our services?
                We are happy to assist you! Please contact us using one of the methods below.
            </p>

            <div className="contact-section">
                <h2 className="contact-heading">Contact information</h2>
                <ul className="contact-list">
                    <li><strong>Phone:</strong> <a href="tel:+310123456789">+31 012 345 6789</a></li>
                    <li><strong>E-mail:</strong> <a href="mailto:info@carandall.nl">info@carandall.nl</a></li>
                    <li><strong>Address:</strong> Car and All, Hoofdstraat 123, 1234 AB, Amsterdam</li>
                </ul>
            </div>

            <div className="contact-section">
                <h2 className="contact-heading">Opening hours</h2>
                <p className="contact-hours">
                    <strong>Monday - Friday:</strong> 09:00 - 18:00<br />
                    <strong>Saturday:</strong> 10:00 - 16:00<br />
                    <strong>Sunday:</strong> Closed
                </p>
            </div>

            <div className="contact-section">
                <h2 className="contact-heading">Send us a message</h2>
                <form className="contact-form">
                    <input type="text" placeholder="Your name" required />
                    <input type="email" placeholder="Your e-mail" required />
                    <textarea placeholder="Your message" rows="5" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;