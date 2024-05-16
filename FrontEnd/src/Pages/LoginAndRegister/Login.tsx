import React, {useEffect, useState} from 'react';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import Navbar from "../MainPage/Navbar";
import {useAuth} from "./AuthContext";
import axios from "../Axios/AxiosConfig"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { handleLogin: contextHandleLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/');
        }
    }, [navigate]);
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username,
                password
            });

            if (response.status === 200) {
                console.log('Login successful!');
                setError('');

                localStorage.setItem('isLoggedIn', 'true');

                navigate('/');
                contextHandleLogin();
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <>
            <Navbar />
            <Container component="main" maxWidth="lg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Paper elevation={3} style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '500px' }}>
                    <Typography variant="h5">Login</Typography>
                    <TextField
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '20px' }}
                        InputLabelProps={{ style: { fontSize: '16px' } }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '20px' }}
                        InputLabelProps={{ style: { fontSize: '16px' } }}
                    />
                    {error && <Typography color="error" style={{ marginTop: '10px', fontSize: '14px' }}>{error}</Typography>}
                    <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                    <Typography style={{ marginTop: '20px' }}>Already don't have an account? <Link to="/registration">Register</Link></Typography>
                </Paper>
            </Container>
        </>
    );
};

export default Login;