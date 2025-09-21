import React, { useState } from 'react';
// Step 1 - Task 1: Import urlConfig
import {urlConfig} from '../../config';
// Step 1 - Task 2: Import useAppContext
import { useAppContext } from '../../context/AuthContext';
// Step 1 - Task 3: Import useNavigate
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Step 1 - Task 4: Include a state for error message
    const [showerr, setShowerr] = useState('');
    
    // Step 1 - Task 5: Create local variables
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                // Step 1 - Task 6: Set method
                method: 'POST',
                // Step 1 - Task 7: Set headers
                headers: {
                    'content-type': 'application/json',
                },
                // Step 1 - Task 8: Set body
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            });

            // Step 2 - Task 1: Access data coming from fetch API
            const json = await response.json();

            // Step 2 - Task 2: Set user details
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                
                // Step 2 - Task 3: Set the state of user to logged in
                setIsLoggedIn(true);
                
                // Step 2 - Task 4: Navigate to the MainPage
                navigate('/app');
            }
            
            // Step 2 - Task 5: Set an error message if registration fails
            if (json.error) {
                setShowerr(json.error);
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input id="firstName" type="text" className="form-control" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input id="lastName" type="text" className="form-control" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input id="email" type="text" className="form-control" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        {/* Step 2 - Task 6: Display error message */}
                        <div className="text-danger">{showerr}</div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input id="password" type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegisterPage;