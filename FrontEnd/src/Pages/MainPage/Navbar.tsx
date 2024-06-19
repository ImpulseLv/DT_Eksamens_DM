import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../LoginAndRegister/AuthContext";
import {RolesCheck} from "../Users/Components/RolesCheck";
import logo from "../../images/logo.png"

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
                    <Link to="/"><img src={logo} style={{ width: '80px', height: '80px' }}></img></Link>
                </div>
                <div className="navbar-buttons">
                    <Link to="/"onClick={() => handleScroll('home')}>Home</Link>
                    <Link to="/" onClick={() => handleScroll('about')}>About</Link>
                    <RolesCheck roles={['ADMIN', 'MODERATOR']}>
                    {isLoggedIn && <Link to="/animals">Table with animals</Link>}
                    </RolesCheck>
                    <RolesCheck roles={['ADMIN']}>
                        <Link to="/users">Table with users</Link>
                    </RolesCheck>
                    <RolesCheck roles={["USER", "ADMIN", "MODERATOR"]}>
                        <Link to="/animalCard">Animals</Link>
                    </RolesCheck>
                    <Link to="/" onClick={() => handleScroll('contact')}>Contact</Link>
                </div>
                <div className="navbar-auth">
                    {isLoggedIn ? (
                        <><Link to="/" onClick={handleLogout}>Logout</Link><Link to="/profile">👤 Profile</Link></>
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