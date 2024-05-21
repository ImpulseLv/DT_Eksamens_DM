import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "../Axios/AxiosConfig";
import {useNavigate} from "react-router-dom";

interface AuthContextType {
    isLoggedIn: boolean;
    handleLogin: () => void;
    handleLogout: () => void;
    userRole: null | 'USER' | 'ADMIN' | 'MODERATOR';
    loginFailed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') == 'true');
    const [userRole, setUserRole] = useState(null);
    const [loginFailed, setLoginFailed] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true);
        setLoginFailed(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn')
        setUserRole(null)
    };


        useEffect(() => {
            if (isLoggedIn) {
                axios.get("http://localhost:8080/roles/currentRole")
                    .then(response => {
                        setUserRole(response.data.name);
                        console.log("User role:", response.data.name);
                    })
                    .catch(error => {
                        console.error("Error fetching user role:", error);
                        handleLogout();
                        setLoginFailed(true);
                    });
            }
        }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout, userRole, loginFailed }}>
            {children}
        </AuthContext.Provider>
    );
};