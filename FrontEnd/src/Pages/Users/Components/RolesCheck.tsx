import React, {useState} from "react";
import {useAuth} from "../../LoginAndRegister/AuthContext";

export const RolesCheck: React.FC<{ children: any , roles: ('USER' | 'ADMIN' | 'MODERATOR')[] }> = ({ children , roles }) => {
    const {userRole} = useAuth();

    if(userRole == null){
        return null;
    }else if(roles.includes(userRole)){
        return children;
    }
};