import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [updatedDetails, setUpdatedDetails] = useState({
        firstName: '',
        lastName: ''
    });
    const { setUserName } = useAppContext();
    const [changed, setChanged] = useState("");
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authtoken = sessionStorage.getItem("auth-token");
        if (!authtoken) {
            navigate("/app/login");
        } else {
            const name = sessionStorage.getItem('name');
            const email = sessionStorage.getItem('email');
            if (name && email) {
                const [firstName, lastName] = name.split(' ');
                const details = { firstName, lastName, email };
                setUserDetails(details);
                setUpdatedDetails({ firstName, lastName });
            }
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setUpdatedDetails({
            ...updatedDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setError('');
        setChanged('');
        const authtoken = sessionStorage.getItem("auth-token");
        const email = sessionStorage.getItem("email");

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
                //Step 1: Task 1: set method
                method: 'PUT',
                //Step 1: Task 2: set headers
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authtoken,
                    'email': email
                },
                //Step 1: Task 3: set body to send user details
                body: JSON.stringify({
                    firstName: updatedDetails.firstName,
                    lastName: updatedDetails.lastName
                }),
            });

            if (response.ok) {
                const newFullName = `${updatedDetails.firstName} ${updatedDetails.lastName}`;
                //Step 1: Task 4: set the new name in the AppContext
                setUserName(newFullName);
                //Step 1: Task 5: set user name in the session
                sessionStorage.setItem('name', newFullName);
                
                setUserDetails(prev => ({ ...prev, ...updatedDetails }));
                setEditMode(false);
                setChanged("Name Changed Successfully!");
                setTimeout(() => {
                    setChanged("");
                }, 2000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.errors ? errorData.errors[0].msg : "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating details: " + error.message);
            setError(error.message);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-header">User Profile</h2>
                {changed && <div className="alert alert-success">{changed}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="profile-body">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            value={updatedDetails.firstName}
                            onChange={handleInputChange}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            value={updatedDetails.lastName}
                            onChange={handleInputChange}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={userDetails.email}
                            readOnly
                        />
                    </div>
                    {editMode ? (
                        <button onClick={handleSubmit} className="btn btn-success btn-block">Save Changes</button>
                    ) : (
                        <button onClick={() => setEditMode(true)} className="btn btn-primary btn-block">Edit Profile</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;