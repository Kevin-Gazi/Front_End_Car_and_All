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
import MedewerkerLogin from "./CarMedewerker/MedewerkerLogin/MedewerkerLogin";
import MedewerkerDashboard from './CarMedewerker/MedewerkerDashboard/MedewerkerDashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [functie, setFunctie] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedFunctie = localStorage.getItem('functie');
        setIsLoggedIn(!!token); // Zet true als er een token is
        setIsEmployee(!!storedFunctie); // Controleer of de gebruiker een medewerker is
        setFunctie(storedFunctie); // Sla de functie op uit localStorage
    }, []);

    return (
        <Router>
            <NavBar isLoggedIn={isLoggedIn} isEmployee={isEmployee} functie={functie} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsEmployee={setIsEmployee} setFunctie={setFunctie} />} />
                <Route path="/CarMedewerkerLogin" element={<MedewerkerLogin setIsLoggedIn={setIsLoggedIn} setIsEmployee={setIsEmployee} setFunctie={setFunctie} />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Account" element={<Account setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/MedewerkerDashboard" element={<MedewerkerDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
