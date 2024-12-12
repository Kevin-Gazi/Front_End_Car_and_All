import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contact from "./Contact/Contact";
import Home from "./Homepage/Home";
import Vehicles from "./Vehicles/Vehicles";
import {NavBar} from "./Components/NavBar";
import Login from "./Login/LoginScherm";
/*import SignUp from "./Login/SignUpScherm";*/


function App() {
    return (
        <Router>
            <NavBar /> {/* Navigatiebalk weergeven */}
            
            <Routes>
                <Route path="/" element={<Home />} /> {/* Home pagina */}
                <Route path="/Contact/Contact" element={<Contact />} /> {/* Contact pagina */}
                <Route path="/vehicles" element={<Vehicles />} /> {/* Auto's pagina */}
                <Route path="/Login/LoginScherm" element={<Login />} /> {/* Login pagina */}
            </Routes>
        </Router>
    );
}

export default App;


