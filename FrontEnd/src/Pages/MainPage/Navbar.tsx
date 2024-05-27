import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../LoginAndRegister/AuthContext";
import axios from "../Axios/AxiosConfig";
import {RolesCheck} from "../Users/Components/RolesCheck";

const Navbar = () => {
    const { isLoggedIn, handleLogout } = useAuth();
    const [userRole, setUserRole] = useState(null);

    const handleScroll = (id) => {
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/">Your Logo</Link>
                </div>
                <div className="navbar-buttons">
                    <Link to="/"onClick={() => handleScroll('home')}>Home</Link>
                    <Link to="/" onClick={() => handleScroll('about')}>About</Link>
                    {isLoggedIn && <Link to="/animals">Table with animals</Link>}
                    <RolesCheck roles={['ADMIN']}>
                        <Link to="/users">Table with users</Link>
                    </RolesCheck>
                    <Link to="/" onClick={() => handleScroll('contact')}>Contact</Link>
                </div>
                <div className="navbar-auth">
                    {isLoggedIn ? (
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/registration">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;