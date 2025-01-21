import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./Contact/Contact";
import Home from "./Homepage/Home";
import Vehicles from "./Vehicles/Vehicles";
import NavBar from "./Components/NavBar";
import Login from "./Login/LoginScherm";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [typeKlant, setTypeKlant] = useState(''); // Dit is de state voor het klanttype

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token); // Zet true als er een token is
        const storedTypeKlant = localStorage.getItem('typeklant');
        setTypeKlant(storedTypeKlant || ''); // Haal het type klant op uit localStorage
    }, []);

    return (
        <Router>
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} typeKlant={typeKlant} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} setTypeklant={setTypeKlant} />} />
                {/* Andere routes */}
            </Routes>
        </Router>
    );
}


export default App;
