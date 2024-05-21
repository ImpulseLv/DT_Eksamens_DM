import {Box} from "@mui/system";
import React, {useEffect, useState} from "react";
import AboutPage from "./AboutPage";
import {Container, Grid, Paper, Typography} from "@mui/material";
import axios from "axios";

const HomePage = () => {

    const [numUsers, setNumUsers] = useState(0);
    const [numAnimals, setNumAnimals] = useState(0);

    useEffect(() => {
        // Fetch all users and count them
        axios.get('http://localhost:8080/users/allUsers')
            .then(response => {
                setNumUsers(response.data.length);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

        // Fetch all animals and count them
        axios.get('http://localhost:8080/animals')
            .then(response => {
                setNumAnimals(response.data.length);
            })
            .catch(error => {
                console.error('Error fetching animals:', error);
            });
    }, []);

    return(
        <Container style={{padding: '0'}}>
            <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ minHeight: '50vh' }}>
                <Grid item>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center',height: '135px', width: '200px' }}>
                        <Typography variant="h5">Number of Registered Users</Typography>
                        <Typography variant="h3">{numUsers}</Typography>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', height: '165px', width: '220px' }}>
                        <Typography variant="h5">Number of Additional Services</Typography>
                        <Typography variant="h3">2</Typography>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', height: '135px', width: '200px' }}>
                        <Typography variant="h5">Number of Animals</Typography>
                        <Typography variant="h3">{numAnimals}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
export default HomePage;