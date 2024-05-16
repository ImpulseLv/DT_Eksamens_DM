
import React, {useState} from 'react';
import axios from "../Axios/AxiosConfig"
import {Container, Paper, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../MainPage/Navbar";

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const api = axios.create({
            baseURL: 'http://localhost:8080',
        });

        try {

            const response = await api.post('/users/newUsers', { username, password });


            console.log(response.data);
            navigate('/login');
        } catch (error) {

            console.error('Error during registration:', error.response.data);

        }
    };

    return (
        <>
            <Navbar/>
        <Container component="main" maxWidth="lg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={3} style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '500px' }}>
                <Typography variant="h5">Registration</Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    margin="normal"
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={handlePasswordChange}
                    margin="normal"
                    fullWidth
                />
                <Button type="submit" variant="outlined" color="primary" fullWidth onClick={handleSubmit}>
                    Sign up
                </Button>
            </Paper>
        </Container>
        </>
    );
};

export default RegistrationForm;