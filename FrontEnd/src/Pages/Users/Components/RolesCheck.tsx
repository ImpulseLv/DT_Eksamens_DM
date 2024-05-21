import React, {useEffect, useState} from "react";
import {useAuth} from "../../LoginAndRegister/AuthContext";
import {useNavigate} from "react-router-dom";

export const RolesCheck: React.FC<{ children: any , roles: ('USER' | 'ADMIN' | 'MODERATOR')[] }> = ({ children , roles }) => {
    const {userRole, loginFailed} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginFailed) {
            navigate("/");
        }
    }, [loginFailed, navigate]);

    if(userRole == null){
        return null;
    }else if(roles.includes(userRole)){
        return children;
    }
};