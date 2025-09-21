import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');
        if (authTokenFromSession) {
            if (!isLoggedIn) {
                setIsLoggedIn(true);
                setUserName(nameFromSession);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, [isLoggedIn, setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate(`/app`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top" id='navbar_container'>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/app">GiftLink</Link>
                <div className="d-flex justify-content-between w-100">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/home.html">Home</a>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app">Gifts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app/search">Search</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/app/profile" style={{ color: "black" }}>Welcome, {userName}</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/app/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/app/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}