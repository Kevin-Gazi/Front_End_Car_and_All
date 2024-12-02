import React from 'react';

const Contact = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#003366' }}>Contact us!</h1>
            <p style={{ textAlign: 'center', fontSize: '18px', lineHeight: '1.5' }}>
                Do you have any questions, comments, or would you like more information about our services?
                We are happy to assist you! Please contact us using one of the methods below.
            </p>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#003366' }}>Contact information</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li><strong>Phone:</strong> <a href="tel:+310123456789" style={{ color: '#FF6600' }}>+31 012 345 6789</a></li>
                    <li><strong>E-mail:</strong> <a href="mailto:info@carandall.nl" style={{ color: '#FF6600' }}>info@carandall.nl</a></li>
                    <li><strong>Address:</strong> Car and All, Hoofdstraat 123, 1234 AB, Amsterdam</li>
                </ul>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#003366' }}>Opening hours</h2>
                <p>
                    <strong>Monday - Friday:</strong> 09:00 - 18:00<br />
                    <strong>Saturday:</strong> 10:00 - 16:00<br />
                    <strong>Sunday:</strong> Closed
                </p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#003366' }}>Send us a message</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Your name" required style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    <input type="email" placeholder="Your e-mail" required style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    <textarea placeholder="Your message" rows="5" required style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }}></textarea>
                    <button type="submit" style={{ backgroundColor: '#003366', color: 'white', padding: '10px', fontSize: '16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
