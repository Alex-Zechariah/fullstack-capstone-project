import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
    const { setUserName } = useAppContext();
    const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', email: '' });
    const [updatedDetails, setUpdatedDetails] = useState({ firstName: '', lastName: '', password: '' });
    const [changed, setChanged] = useState("");
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authtoken = sessionStorage.getItem("auth-token");
        if (!authtoken) {
            navigate("/app/login");
        } else {
            fetchUserProfile();
        }
    }, [navigate]);

    const fetchUserProfile = () => {
        const email = sessionStorage.getItem("email");
        const name = sessionStorage.getItem('name') || '';
        // Simple split for first/last name; adjust if your data format is different
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const storedUserDetails = { firstName, lastName, email };
        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
    };

    const handleInputChange = (e) => {
        setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authtoken = sessionStorage.getItem("auth-token");
            const email = sessionStorage.getItem("email");
            if (!authtoken || !email) {
                navigate("/app/login");
                return;
            }
            
            // Backend expects 'name' as firstName
            const payload = { 
                name: updatedDetails.firstName,
                lastName: updatedDetails.lastName,
                password: updatedDetails.password 
            };

            const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authtoken}`,
                    "Content-Type": "application/json",
                    "Email": email,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const newName = `${updatedDetails.firstName} ${updatedDetails.lastName}`.trim();
                setUserName(newName);
                sessionStorage.setItem("name", newName);
                setUserDetails(updatedDetails);
                setEditMode(false);
                setChanged("Profile Updated Successfully!");
                setTimeout(() => {
                    setChanged("");
                    navigate("/app");
                }, 1500);
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating details: " + error.message);
        }
    };

    return (
        <div className="profile-container">
            {editMode ? (
                <form onSubmit={handleSubmit}>
                    <h3>Edit Profile</h3>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" value={userDetails.email} disabled />
                    </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" className="form-control" value={updatedDetails.firstName || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" className="form-control" value={updatedDetails.lastName || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>New Password (optional)</label>
                        <input type="password" name="password" className="form-control" placeholder="Enter new password" onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Save</button>
                </form>
            ) : (
                <div className="profile-details">
                    <h1>Hi, {userDetails.firstName}</h1>
                    <p><b>Email:</b> {userDetails.email}</p>
                    <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
                    <span className="success-message">{changed}</span>
                </div>
            )}
        </div>
    );
};

export default Profile;