import React from "react";
import '../App.css';


export function SearchSection() {
    return (
        <section className="search-section">
            <div className="search-container">
                
                {/* Icon Selection Section */}
                <div className="icon-group">
                    <button className="icon-button">
                        <i className="fas fa-car"></i>
                    </button>
                    <button className="icon-button">
                        <i className="fas fa-motorcycle"></i>
                    </button>
                    <button className="icon-button">
                        <i className="fas fa-truck"></i>
                    </button>
                </div>

                {/* Search Form */}
                <form className="search-form">
                    <div className="form-group">
                        <label>Merk</label>
                        <select>
                            <option value="">Select Vehicle</option>
                            <option value="BMW">Car</option>
                            <option value="Audi">Camper</option>
                            <option value="Audi">Caravan</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Bouwjaar vanaf</label>
                        <input type="number" placeholder="2024"/>
                    </div>

                    {/* Date*/}
                    <div className="form-group">
                        <label>Start Datum</label>
                        <input type="date" />
                    </div>

                    <div className="form-group">
                        <label>Eind Datum</label>
                        <input type="date" />
                    </div>
                    
                    {/* Submit Button */}
                    <button type="submit" className="search-button">
                        Results
                    </button>
                </form>

                {/* Show All The Cars*/}
                <div className="advanced-search">
                    <a href="/advanced-search">See More</a>
                </div>
            </div>
        </section>
    );
}

export default SearchSection;
