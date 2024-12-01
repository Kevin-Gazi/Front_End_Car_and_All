import React from 'react';

const Contact = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#003366' }}>Neem Contact Op</h1>
            <p style={{ textAlign: 'center', fontSize: '18px', lineHeight: '1.5' }}>
                Heeft u vragen, opmerkingen of wilt u meer informatie over onze diensten?
                Wij helpen u graag verder! Neem contact met ons op via een van de onderstaande methoden.
            </p>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#003366' }}>Contactgegevens</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li><strong>Telefoon:</strong> <a href="tel:+310123456789" style={{ color: '#FF6600' }}>+31 012 345 6789</a></li>
                    <li><strong>E-mail:</strong> <a href="mailto:info@carandall.nl" style={{ color: '#FF6600' }}>info@carandall.nl</a></li>
                    <li><strong>Adres:</strong> Car and All, Hoofdstraat 123, 1234 AB, Amsterdam</li>
                </ul>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#003366' }}>Openingstijden</h2>
                <p>
                    <strong>Maandag t/m Vrijdag:</strong> 09:00 - 18:00<br />
                    <strong>Zaterdag:</strong> 10:00 - 16:00<br />
                    <strong>Zondag:</strong> Gesloten
                </p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#003366' }}>Stuur ons een bericht</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Uw naam" required style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    <input type="email" placeholder="Uw e-mail" required style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    <textarea placeholder="Uw bericht" rows="5" required style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }}></textarea>
                    <button type="submit" style={{ backgroundColor: '#003366', color: 'white', padding: '10px', fontSize: '16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Verstuur Bericht
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
