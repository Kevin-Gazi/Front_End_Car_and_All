import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./Contact/Contact";
import Home from "./Homepage/Home";
import Vehicles from "./Vehicles/Vehicles";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer"; // Footer toegevoegd
import Login from "./Login/LoginScherm";
import SignUp from "./Login/SignUpScherm";
import MedewerkerLogin from "./CarMedewerker/MedewerkerLogin/MedewerkerLogin";
import MedewerkerDashboard from './CarMedewerker/MedewerkerDashboard/MedewerkerDashboard';
import DamageClaims from "./Backofficemedewerker/Schadeclaim/Schadeclaims";
import Subscriptions from "./Abonnement/Subscriptions";
import AlleAbonnementen from "./Backofficemedewerker/AbonnementBackoffice/AlleAbonnementen";
import DamageReport from "./Frontofficemedewerker/Schadeformulier/Schadeformulier";
import Profile from "./Account/Profile";
import Rentals from "./Account/RentalsScherm";
import EmployeeScherm from './Account/EmployeeScherm';
import AllVehicles from "./Frontofficemedewerker/AllVehicles/AllVehicles";
import Verhuuraanvraag from "./Backofficemedewerker/Verhuuraanvragen/Verhuuraanvraag";
import NotificationScherm from "./Account/NotificationScherm";
import TermsAndConditions from "./Privacy-en-Terms/TermsOfService";
import PrivacyPolicy from "./Privacy-en-Terms/PrivacyPolicy";
import InnameVoertuig from "./Frontofficemedewerker/InnameVoertuigen/InnameVoertuigen"
import BusinessRequests from "./Backofficemedewerker/BusinessRequests";
import CarEmployeeScherm from "./Backofficemedewerker/CarEmployeeScherm";
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
                <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/CarMedewerkerLogin" element={<MedewerkerLogin setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/MedewerkerDashboard" element={<MedewerkerDashboard />} />
                <Route path="/DamageClaims" element={<DamageClaims />} />
                <Route path="/Subscriptions" element={<Subscriptions />} />
                <Route path="/DamageReport" element={<DamageReport />} />
                <Route path="/AlleAbonnementen" element={<AlleAbonnementen />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Rentals" element={<Rentals />} />
                <Route path="/Employees" element={<EmployeeScherm />} />
                <Route path="/AllVehicles" element={<AllVehicles />} />
                <Route path="/Verhuuraanvraag" element={<Verhuuraanvraag />} />
                <Route path="/Notifications" element={<NotificationScherm />} />
                <Route path="/Terms" element={<TermsAndConditions />} />
                <Route path="/Privacy" element={<PrivacyPolicy/>} />
                <Route path="/Notifications" element={<NotificationScherm/>} />
                <Route path="/IntakeVehicles" element = {<InnameVoertuig />} />
                <Route path="/SentOutVehicles" element={<Verhuuraanvraag/>} />
                <Route path="/BusinessRequests" element = {<BusinessRequests />} />
                <Route path="/CarEmployees" element = {<CarEmployeeScherm />} />
            </Routes>
            <Footer /> {/* Footer hier toegevoegd */}
        </Router>
    );
}

export default App;
