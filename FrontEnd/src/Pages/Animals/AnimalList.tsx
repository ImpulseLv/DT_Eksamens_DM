import React, { useEffect, useState } from "react";
import { Animal } from "../../Types/Animal";
import { Link } from "react-router-dom";
import { AnimalStatusLabel } from "./Components/AnimalStatusLabel";
import DataTable from 'react-data-table-component';
import moment from "moment";
import { TableColumn } from "react-data-table-component/dist/src/DataTable/types";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import axios from "../Axios/AxiosConfig";
import Navbar from "../MainPage/Navbar";
import Footer from "../MainPage/Footer";
import { Role } from "../../Types/Role";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const baseURL = "http://localhost:8080/animals";

export function MyComponent() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);

    useEffect(() => {
        axios.get<Role>("http://localhost:8080/roles/currentRole")
            .then(response => {
                setUserRole(response.data);
            })
            .catch(error => {
                console.error("Error fetching user role:", error);
            });

        axios.get<Animal[]>(baseURL)
            .then((response) => {
                setAnimals(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleClickOpen = (animal: Animal) => {
        setSelectedAnimal(animal);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAnimal(null);
        setImages([]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setImages(prevImages => prevImages.concat(fileArray));
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (!selectedAnimal) return;

        const formData = new FormData();
        images.forEach(image => {
            formData.append("files", image);
        });

        axios.post(`http://localhost:8080/animals/${selectedAnimal.id}/uploadImages`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(response => {
                console.log("Images uploaded successfully");
                handleClose();
            })
            .catch(error => {
                console.error("Error uploading images:", error);
            });
    };

    const columns: TableColumn<Animal>[] = [
        {
            name: 'ID',
            cell: (row: Animal) => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            cell: (row: Animal) => row.name,
            sortable: true,
        },
        {
            name: 'Type',
            cell: (row: Animal) => row.type,
            sortable: true,
        },
        {
            name: 'Status',
            cell: (row: Animal) => <AnimalStatusLabel status={row.statuss} />,
            sortable: true,
        },
        {
            name: 'Date Of Birth',
            cell: (row: Animal) => row.date_of_birth,
            sortable: true,
        },
        {
            name: 'Gender',
            cell: (row: Animal) => row.gender,
            sortable: true,
        },
        {
            name: 'Creation Date',
            cell: (row: Animal) => moment(row.creation_date).format('YYYY-MM-DD'),
            sortable: true,
        },
        {
            name: 'Update Date',
            cell: (row: Animal) => moment(row.update_date).format('YYYY-MM-DD'),
            sortable: true,
        },
        {
            name: '',
            cell: (row: Animal) => {
                return (
                    <>
                        {userRole && userRole.name !== "USER" && (
                            <Link to={'/animals/' + row.id}>
                                <Button variant="outlined">Edit</Button>
                            </Link>
                        )}
                    </>
                );
            }
        },
        {
            name: '',
            cell: (row: Animal) => {
                return (
                    <>
                        {userRole && userRole.name !== "USER" && (
                            <Button variant="outlined" onClick={() => handleClickOpen(row)}>Images</Button>
                        )}
                    </>
                );
            }
        },
    ];

    return (
        <>
            <Navbar />
            <form>
                <div className="animalListBlock">
                    {userRole && userRole.name !== "USER" && (
                        <Link to={'/animals/newAnimal/'} style={{ float: "right", margin: 2 }}>
                            <Button variant="outlined" size="small">Create</Button>
                        </Link>
                    )}
                    <DataTable<Animal>
                        columns={columns}
                        data={animals}
                    />
                </div>
            </form>
            <Footer />

            <Dialog  open={open} onClose={handleClose}>
                <DialogTitle>Upload Images</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'block', marginBottom: '20px' }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {images.map((image, index) => (
                            <div key={index} style={{ position: 'relative', margin: '10px' }}>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`image-${index}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                <IconButton
                                    size="small"
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} color="primary" variant="contained">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}