import React, { useEffect, useState } from "react";
import { User } from "../../Types/User";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../Axios/AxiosConfig";
import Navbar from "../MainPage/Navbar";
import { AbstractUserForm } from "./Components/AbstractUserForm";
import { message } from "antd";

export const UserEditForm: React.FC = () => {
    const baseURL = "/users/users";
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialValues, setInitialValues] = useState<User | null>(null);

    const getUserById = (id: string) => {
        axios
            .get(`${baseURL}/${id}`)
            .then((response) => {
                response.data.password = "";
                response.data.roles = response.data.roles[0].name;
                setInitialValues(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных:", error);
            });
    };

    useEffect(() => {
        if (id) {
            getUserById(id);
        }
    }, [id]);

    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = (values: User) => {
        setIsLoading(true);
        console.log("Submitted values:", values);
        const idToUpdate = id!;

        axios
            .put(`${baseURL}/${idToUpdate}`, values)
            .then((response) => {
                console.log("The data has been successfully sent to the server :", response.data);
                message.success("User successfully restored!");
                navigate("/users");
            })
            .catch((error) => {
                console.error("Error sending data :", error);
                message.error("Error, data was not successfully restored!");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    if (!initialValues) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <AbstractUserForm initialValues={initialValues} handleFormSubmit={handleFormSubmit} isLoading={isLoading} />
        </>
    );
};