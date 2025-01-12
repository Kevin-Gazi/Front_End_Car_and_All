import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./Contact/Contact";
import Home from "./Homepage/Home";
import Vehicles from "./Vehicles/Vehicles";
import { NavBar } from "./Components/NavBar";  // Import van de NavBar
import Login from "./Login/LoginScherm";
import SignUp from "./Login/SignUpScherm"; // Je SignUp component
import Schadeclaims from "./Backofficemedewerker/Schadeclaims";
import Subscriptions from "./Abonnement/Subscriptions";

function App() {
    return (
        <Router>
            <NavBar />  {/* NavBar wordt bovenaan de pagina weergegeven */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Contact/Contact" element={<Contact />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/Login/LoginScherm" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/schadeclaims" element={<Schadeclaims />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
            </Routes>
        </Router>
    );
}

export default App;
