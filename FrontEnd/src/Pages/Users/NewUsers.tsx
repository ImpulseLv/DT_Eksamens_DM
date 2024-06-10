import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Axios/AxiosConfig";
import { User } from "../../Types/User";
import Navbar from "../MainPage/Navbar";
import { AbstractUserForm } from "./Components/AbstractUserForm";
import { CreateUserDto } from "../../Types/CreateUserDto";
import { message } from "antd";

export const NewUsers: React.FC = () => {
    const navigate = useNavigate();
    const [newUserData, setNewUserData] = useState<CreateUserDto>({
        id: "",
        username: "",
        password: "",
        roles: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = (values: User) => {
        setIsLoading(true);
        console.log("Submitted values:", values);

        // Проверка на минимальную длину пароля
        if (values.password.length < 8) {
            setIsLoading(false);
            message.error("Password must contain at least 8 characters!");
            return;
        }

        axios
            .post("/users/newUsers", values)
            .then((response) => {
                console.log("The data has been successfully sent to the server :", response.data);
                setIsLoading(false);
                message.success("User successfully created!");
                navigate("/users");
            })
            .catch((error) => {
                setIsLoading(false);
                message.error("Error, data was not sent successfully!");
                console.error("Error sending data :", error);
            });
    };

    return (
        <>
            <Navbar />
            <AbstractUserForm initialValues={newUserData} handleFormSubmit={handleFormSubmit} isLoading={isLoading} />
        </>
    );
};