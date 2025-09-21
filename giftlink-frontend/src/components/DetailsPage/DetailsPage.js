import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';
import { urlConfig } from '../../config';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            navigate('/app/login');
        }

        const fetchGift = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();
        window.scrollTo(0, 0);
    }, [productId, navigate]);

    const handleBackClick = () => {
        navigate(-1);
    };
    
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const comments = [
        { author: "John Doe", comment: "I would like this!" },
        { author: "Jane Smith", comment: "Just DMed you." },
        { author: "Alice Johnson", comment: "I will take it if it's still available." },
        { author: "Mike Brown", comment: "This is a good one!" },
        { author: "Sarah Wilson", comment: "My family can use one. DM me if it is still available. Thank you!" }
    ];

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5">Error: {error}</div>;
    if (!gift) return <div className="container mt-5">Gift not found</div>;

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-4" onClick={handleBackClick}>Back</button>
            <div className="card">
                <div className="row g-0">
                    <div className="col-md-6">
                        <img src={gift.image || 'https://via.placeholder.com/400'} alt={gift.name} className="details-img" />
                    </div>
                    <div className="col-md-6">
                        <div className="card-body">
                            <h2 className="card-title">{gift.name}</h2>
                            <p className="card-text"><strong>Category:</strong> {gift.category}</p>
                            <p className="card-text"><strong>Condition:</strong> {gift.condition}</p>
                            <p className="card-text"><strong>Date Added:</strong> {formatDate(gift.date_added)}</p>
                            <p className="card-text"><strong>Age (Years):</strong> {gift.age_years}</p>
                            <p className="card-text"><strong>Description:</strong> {gift.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="comments-section mt-5">
                <h3 className="mb-3">Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author">{comment.author}:</p>
                            <p className="comment-text mb-0">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default DetailsPage;