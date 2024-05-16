import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "../Axios/AxiosConfig";

interface AuthContextType {
    isLoggedIn: boolean;
    handleLogin: () => void;
    handleLogout: () => void;
    userRole: null | 'USER' | 'ADMIN' | 'MODERATOR';
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

    const handleLogin = () => {
        setIsLoggedIn(true);
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
                        setIsLoggedIn(false);
                    });
            }
        }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};