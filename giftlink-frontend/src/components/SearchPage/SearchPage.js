import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';
import './SearchPage.css';

function SearchPage() {
    // Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [age, setAge] = useState(10); // Default max age
    const [searchResults, setSearchResults] = useState([]);
    const [searched, setSearched] = useState(false); // To track if a search has been performed

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];
    const navigate = useNavigate();

    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        try {
            // Build the query string
            const queryParams = new URLSearchParams({
                name: searchQuery,
                category: category,
                condition: condition,
                age_years: age
            }).toString();

            const response = await fetch(`${urlConfig.backendUrl}/api/gifts/search?${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
            setSearched(true); // Mark that a search has been performed
        } catch (error) {
            console.log('Fetch error: ' + error.message);
        }
    };

    // Task 6. Enable navigation to the details page of a selected gift.
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="filter-section p-3 border rounded">
                        <h5>Filters</h5>
                        {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                        <div className="form-group">
                            <label htmlFor="categorySelect">Category</label>
                            <select id="categorySelect" className="form-control dropdown-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">All</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="conditionSelect">Condition</label>
                            <select id="conditionSelect" className="form-control dropdown-filter" value={condition} onChange={(e) => setCondition(e.target.value)}>
                                <option value="">All</option>
                                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {/* Task 4: Implement an age range slider and display the selected value. */}
                        <div className="form-group">
                            <label htmlFor="ageRange">Less than {age} years</label>
                            <input type="range" id="ageRange" className="form-control-range age-range-slider" min="1" max="10" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    {/* Task 7: Add text input field for search criteria*/}
                    <div className="input-group mb-3">
                        <input type="text" className="form-control search-input" placeholder="Search for gifts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="input-group-append">
                            {/* Task 8: Implement search button with onClick event to trigger search:*/}
                            <button className="btn btn-primary search-button" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <div className="row">
                        {searched && searchResults.length === 0 ? (
                            <div className="col-12">
                                <div className="alert alert-info no-products-alert">No products found matching your criteria.</div>
                            </div>
                        ) : (
                            searchResults.map((gift) => (
                                <div key={gift.id} className="col-md-4 mb-4">
                                    <div className="card search-results-card h-100" onClick={() => goToDetailsPage(gift.id)}>
                                        <img src={gift.image} className="card-img-top search-card-img" alt={gift.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{gift.name}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;