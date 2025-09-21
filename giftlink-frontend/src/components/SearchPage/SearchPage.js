import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';
import './SearchPage.css';

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };
        fetchProducts();
    }, []);

    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();
        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };
    
    const getConditionClass = (condition) => {
        if (condition === "New") return "condition-new";
        if (condition === "Like New") return "condition-like-new";
        if (condition === "Older") return "condition-older";
        return "";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Column 1: Filters */}
                <div className="col-md-4">
                    <div className="filter-container card p-4">
                        <h4 className="mb-3">Filters</h4>
                        <div className="form-group">
                            <label htmlFor="categorySelect">Category</label>
                            <select id="categorySelect" className="form-control">
                                <option value="">All</option>
                                {categories.map(category => (<option key={category} value={category}>{category}</option>))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="conditionSelect">Condition</label>
                            <select id="conditionSelect" className="form-control">
                                <option value="">All</option>
                                {conditions.map(condition => (<option key={condition} value={condition}>{condition}</option>))}
                            </select>
                        </div>
                        <div className="form-group">
                            {/* Horizontally aligned slider and label */}
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="ageRange" className="mb-0">Age</label>
                                <span>Less than {ageRange} years</span>
                            </div>
                            <input type="range" className="form-control-range" id="ageRange" min="1" max="10" value={ageRange} onChange={e => setAgeRange(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Column 2: Search Bar and Results */}
                <div className="col-md-8">
                    <div className="search-bar">
                        <input type="text" className="form-control" placeholder="Search for items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                    </div>
                    
                    <div className="search-results">
                        <div className="row">
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <div key={product.id} className="col-lg-6 mb-4">
                                        <div className="card h-100">
                                            <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="card-img-top" />
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="card-text">
                                                    <span className={`condition-badge ${getConditionClass(product.condition)}`}>
                                                        {product.condition}
                                                    </span>
                                                </p>
                                                <p className="card-text text-muted small">{product.description.slice(0, 100)}...</p>
                                            </div>
                                            <div className="card-footer">
                                                <button onClick={() => goToDetailsPage(product.id)} className="btn btn-primary w-100">View More</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-info" role="alert">
                                        No products found. Please revise your filters.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SearchPage;