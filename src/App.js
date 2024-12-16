import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./Contact/Contact";
import Home from "./Homepage/Home";
import Vehicles from "./Vehicles/Vehicles";
import { NavBar } from "./Components/NavBar";
import Login from "./Login/LoginScherm";
import SignUp from "./Login/SignUpScherm";
import Account from "./Account/AccountScherm";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Controleer bij het laden van de app of er een token is
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token); // Zet true als er een token is
    }, []);

    return (
        <Router>
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Doorsturen props */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Account" element={<Account setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
        </Router>
    );
}

export default App;
