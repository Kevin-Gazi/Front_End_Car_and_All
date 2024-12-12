import React from "react";
import './SearchSection.css';

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
                            <option value="">Selecteer Merk</option>
                            <option value="BMW">BMW</option>
                            <option value="Audi">Audi</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Model</label>
                        <select>
                            <option value="">Selecteer Model</option>
                            <option value="X5">X5</option>
                            <option value="A4">A4</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Bouwjaar vanaf</label>
                        <input type="number" placeholder="2020" />
                    </div>

                    <div className="form-group">
                        <label>Prijs tot (€)</label>
                        <input type="number" placeholder="50000" />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="search-button">
                        Resultaten
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
