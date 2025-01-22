import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./Contact/Contact";
import Home from "./Homepage/Home";
import Vehicles from "./Vehicles/Vehicles";
import NavBar from "./Components/NavBar";
import Login from "./Login/LoginScherm";
import SignUp from "./Login/SignUpScherm";
import Account from "./Account/AccountScherm";
import MedewerkerLogin from "./CarMedewerker/MedewerkerLogin/MedewerkerLogin";
import MedewerkerDashboard from './CarMedewerker/MedewerkerDashboard/MedewerkerDashboard';
import DamageClaims from "./Backofficemedewerker/Schadeclaims";
import Subscriptions from "./Abonnement/Subscriptions";
import DamageReport from "./Frontofficemedewerker/Schadeformulier";

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
                <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn}   />} />
                <Route path="/CarMedewerkerLogin" element={<MedewerkerLogin setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Account" element={<Account setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/MedewerkerDashboard" element={<MedewerkerDashboard />} />
                <Route path="/DamageClaims" element={<DamageClaims />} />
                <Route path="/Subscriptions" element={<Subscriptions />} />
                {/*<Route path="/Profile" element={<Profile />} />*/}
                <Route path="/DamageReport" element={<DamageReport />} />
                
                <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} setTypeklant={setTypeKlant} />} />
                <Route path="/SignUp" element={<SignUp/>}/>
                <Route path="/CarMedewerkerLogin" element={<MedewerkerLogin/>}/>
            </Routes>
        </Router>
    );
}

export default App;
