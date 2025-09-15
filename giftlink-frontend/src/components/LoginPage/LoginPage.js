import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    // Define states for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Define the handleLogin method
    const handleLogin = () => {
        console.log('Login button clicked');
        console.log({
            email,
            password
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        
                        {/* Create input elements for email and password */}
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

                        {/* Add a Login button */}
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