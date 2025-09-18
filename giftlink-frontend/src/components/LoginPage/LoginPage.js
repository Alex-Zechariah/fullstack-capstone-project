import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    // Define states for email, password, and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Initialize hooks for navigation and global state
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    // If a user is already logged in (e.g., from a previous session), redirect them
    useEffect(() => {
        const bearerToken = sessionStorage.getItem('auth-token');
        if (bearerToken) {
            navigate('/app');
        }
    }, [navigate]);

    // Define the handleLogin method to call the backend API
    const handleLogin = async () => {
        setError(''); // Clear previous errors
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // On successful login, store user details and update state
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('email', data.userEmail);
                sessionStorage.setItem('name', data.userName);

                setIsLoggedIn(true);
                setUserName(data.userName);

                navigate('/app'); // Redirect to the main page
            } else {
                // On failed login, show an error and clear the password field
                setError(data.error || 'Login failed');
                setPassword('');
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        
                        {/* Input elements for email and password */}
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>

                        {/* Display error message if login fails */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Login button */}
                        <button onClick={handleLogin} className="btn btn-primary btn-block">
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;