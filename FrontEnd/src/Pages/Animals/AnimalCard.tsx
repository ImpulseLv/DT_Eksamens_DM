import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from "../Axios/AxiosConfig";
import Navbar from "../MainPage/Navbar";
import Footer from "../MainPage/Footer";
import dogImage from "../../images/dog.png";
import moment from "moment/moment"; // Импортируем изображение собаки

const useStyles = makeStyles({
    card: {
        width: 345,
        margin: '20px',
        marginTop: 70,
    },
    media: {
        height: 140,
    },
    animalCardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    dialogMedia: {
        height: 200,
        objectFit: 'cover',
    },
});

const AnimalCard = ({ animal }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image={dogImage} // Указываем путь к изображению собаки
                    title={animal.name}
                />
                <CardContent>
                    <Typography variant="h5" component="div" style={{ textAlign: 'center', fontWeight: 'bold'}}>
                        {animal.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <h4>Type: {animal.type}</h4>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <h4>Gender: {animal.gender}</h4>
                    </Typography>
                    <Button size="small" color="primary" onClick={handleClickOpen}>
                        Read More
                    </Button>
                </CardContent>
            </Card>
            <Dialog open={open} onClose={handleClose} sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "345px",  // Set your width here
                    },
                },
            }}>
                <CardMedia
                    className={classes.dialogMedia}
                    image={dogImage}
                    title={animal.name}
                />
                <DialogTitle color="text.primary" fontWeight="bold">{animal.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        <h4>Type: {animal.type}</h4>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <h4>Gender: {animal.gender}</h4>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <h4>Date of Birth: {moment(animal.date_of_birth).format('YYYY-MM-DD')}</h4>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <h4>Status: {animal.statuss}</h4>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const AnimalCards = () => {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        axios.get('/animals')
            .then(response => {
                setAnimals(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const classes = useStyles();

    return (
        <>
            <Navbar />
            <div className={classes.animalCardContainer}>
                {animals.map(animal => (
                    <AnimalCard key={animal.id} animal={animal} />
                ))}
            </div>
            <Footer />
        </>
    );
};

export default AnimalCards;