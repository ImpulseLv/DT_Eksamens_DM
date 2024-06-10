import React, {useEffect, useState} from "react";
import {Animal} from "../../Types/Animal";
import {useNavigate, useParams} from "react-router-dom";
import {AbstractAnimalForm} from "./Components/AbstractAnimalForm";
import axios from "../Axios/AxiosConfig"
import Navbar from "../MainPage/Navbar";
import {message} from "antd";

export const AnimalEditForm: React.FC = () => {
    const baseURL = "/animals";
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialValues, setInitialValues] = useState<Animal | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const getAnimalById = (id: string) => {
        axios
            .get(`${baseURL}/${id}`)
            .then((response) => {
                setInitialValues(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных:", error);
            });
    };

    useEffect(() => {
        if (id) {
            getAnimalById(id);
        }
    }, [id]);

    useEffect(() => {
        if (isSuccess) {
            messageApi.success('Animal data successfully edited!');
            setTimeout(() => {
                navigate("/animals");
            }, 2000);
        }
    }, [isSuccess, messageApi, navigate]);

    const handleFormSubmit = (values: Animal) => {
        setIsLoading(true);
        console.log("Submitted values:", values);
        const idToUpdate = values.id!;
        axios
            .put(`${baseURL}/${idToUpdate}`, values)
            .then((response) => {
                console.log("The data has been successfully sent to the server :", response.data);
                setIsSuccess(true);
            })
            .catch((error) => {
                console.error("Error sending data :", error);
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
            {contextHolder}
            <Navbar />
            <AbstractAnimalForm initialValues={initialValues} handleFormSubmit={handleFormSubmit} isLoading={isLoading} />
        </>
    );
};


