import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./Contact";
import Home from "./Homepage/Home";
import Vehicles from "./Vehicles/Vehicles";
import {NavBar} from "./NavBar/NavBar";


function App() {
    return (
        <Router>
            <NavBar /> {/* Navigatiebalk weergeven */}

            <Routes>
                <Route path="/" element={<Home />} /> {/* Home pagina */}
                <Route path="/contact" element={<Contact />} /> {/* Contact pagina */}
                <Route path="/vehicles" element={<Vehicles />} /> {/* Auto's pagina */}
            </Routes>
        </Router>
    );
}

export default App;