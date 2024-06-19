import React, { useEffect, useState } from "react";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import axios from "../Axios/AxiosConfig";
import Navbar from "../MainPage/Navbar";
import Footer from "../MainPage/Footer";
import dogImage from "../../images/dog.png";
import moment from "moment/moment";
import {Link, useNavigate} from "react-router-dom";

const AnimalCard = ({ animal }) => {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBuyClick = () => {
        navigate(`/checkout/${animal.id}`);
    };

    useEffect(() => {
        // Получаем изображения для животного
        axios.get(`animals/animals/${animal.id}/images`)
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error("Error fetching images:", error);
            });
    }, [animal.id]);


    const imageUrl = images.length > 0 ? images[0].url : dogImage;
// http://localhost:8080/animals/getImage/3/3_1.png
    return (
        <>
            <Card className="card">
                <CardMedia
                    className="media"
                    image={dogImage}
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
                        maxWidth: "345px",
                    },
                },
            }}>
                {images.map((image, index) => (
                    <CardMedia
                        key={index}
                        className="dialogMedia"
                        image={dogImage}
                        title={`${animal.name} - ${index + 1}`}
                    />
                ))}
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
                    <Typography variant="body2" color="text.secondary">
                        <h4>Price: {animal.price + ",00 $"}</h4>
                    </Typography>
                </DialogContent>
                <DialogActions>
                        <Button onClick={handleBuyClick} color="primary">
                            Buy
                        </Button>

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
    const [sortedBy, setSortedBy] = useState('creationDate');
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`/animals?sort=${sortedBy}`)
            .then(response => {
                const freeAnimals = response.data.filter(animal => animal.statuss === 'free');
                setAnimals(freeAnimals);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [sortedBy]);

    return (
        <>
            <Navbar />
            <div className="animalCardContainer">
                <Card className="card">
                    <CardContent>
                        <div>
                            <Button onClick={() => setSortedBy("name")}>Sort by Name</Button>
                            <Button onClick={() => setSortedBy("type")}>Sort by Type</Button>
                            <Button onClick={() => setSortedBy("gender")}>Sort by Gender</Button>
                            <Button onClick={() => setSortedBy("creationDate")}>Sort by Creation date</Button>
                            <Button onClick={() => navigate('/animals/newAnimal', { state: { status: 'notVerified' } })}>Add your own animal</Button>
                        </div>
                    </CardContent>
                </Card>
                {animals.map(animal => (
                    <AnimalCard key={animal.id} animal={animal} />
                ))}
            </div>
            <Footer />
        </>
    );
};

export default AnimalCards;