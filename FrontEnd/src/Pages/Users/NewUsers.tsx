import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "../Axios/AxiosConfig";
import {User} from "../../Types/User";
import Navbar from "../MainPage/Navbar";
import {AbstractUserForm} from "./Components/AbstractUserForm";
import {CreateUserDto} from "../../Types/CreateUserDto";




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
        axios.post( "/newUsers", values)
            .then((response) => {
                console.log('The data has been successfully sent to the server :', response.data);
                navigate("/users");
            })
            .catch((error) => {
                console.error('Error sending data :', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return(
        <>
            <Navbar/>
            <AbstractUserForm initialValues={newUserData} handleFormSubmit={handleFormSubmit} isLoading={isLoading} ></AbstractUserForm>
        </>
    );
};
