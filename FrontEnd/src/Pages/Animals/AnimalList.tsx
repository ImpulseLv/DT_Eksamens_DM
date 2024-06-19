import React, { useEffect, useState } from "react";
import { Animal } from "../../Types/Animal";
import { Link } from "react-router-dom";
import { AnimalStatusLabel } from "./Components/AnimalStatusLabel";
import DataTable, {TableColumn} from 'react-data-table-component';
import moment from "moment";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import axios from "../Axios/AxiosConfig";
import Navbar from "../MainPage/Navbar";
import Footer from "../MainPage/Footer";
import { Role } from "../../Types/Role";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import { message } from "antd";

export function MyComponent() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        axios.get<Role>("/roles/currentRole")
            .then(response => {
                setUserRole(response.data);
            })
            .catch(error => {
                console.error("Error fetching user role:", error);
            });

        axios.get<Animal[]>('/animals')
            .then((response) => {
                setAnimals(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        if (isSuccess) {
            messageApi.success("Images uploaded successfully!");
            setIsSuccess(false);
        }
    }, [isSuccess, messageApi]);

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

        axios.post(`/animals/${selectedAnimal.id}/uploadImages`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(response => {
                console.log("Images uploaded successfully");
                setIsSuccess(true);
                handleClose();
            })
            .catch(error => {
                console.error("Error uploading images:", error);
            });
    };

    const handleModalOpen = (animal: Animal) => {
        setAnimalToDelete(animal);
        setDeleteDialogOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
        setAnimalToDelete(null);
    };

    const handleDelete = () => {
        if (animalToDelete) {
            axios.delete(`/animals/${animalToDelete.id}`)
                .then(response => {
                    console.log("Animal deleted successfully");
                    setAnimals(prevAnimals => prevAnimals.filter(animal => animal.id !== animalToDelete.id));
                    setDeleteDialogOpen(false);
                    message.success("Animal deleted successfully!");
                })
                .catch(error => {
                    console.error("Error deleting animal:", error);
                    message.error("Error deleting animal!");
                });
        }
    };

    const handleChangeStatus = (animalId: number) => {
        axios.put(`/animals/${animalId}/status`, null, {
            params: {
                status: 'free'
            }
        })
            .then(response => {
                setAnimals(prevAnimals =>
                    prevAnimals.map(animal =>
                        animal.id === animalId ? { ...animal, statuss: 'free' as Animal['statuss'] } : animal
                    )
                );
                message.success("Status updated successfully!");
            })
            .catch(error => {
                console.error("Error updating status:", error);
                message.error("Error updating status!");
            });
    };

    const columns: TableColumn<Animal>[] = [
        {
            name: 'ID',
            selector: (row: Animal) => row.id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row: Animal) => row.name,
            sortable: true,
        },
        {
            name: 'Type',
            selector: (row: Animal) => row.type,
            sortable: true,
        },
        {
          name: "Price",
          selector: (row: Animal) => row.price + ",00 $",
          sortable:true,
        },
        {
            name: 'Status',
            selector: (row: Animal) => row.statuss,
            cell: (row: Animal) => (
                <>
                    <AnimalStatusLabel status={row.statuss} />
                    {row.statuss === "notVerified" && (
                        <Button onClick={() => handleChangeStatus(row.id)}>Verify</Button>
                    )}
                </>
            ),
            sortable: true,
        },
        {
            name: 'Taken by',
            selector: (row: Animal) => row.statuss === 'free' ? '' : row.takenBy,
            sortable: true,
        },
        {
            name: 'Date Of Birth',
            selector: (row: Animal) => moment(row.date_of_birth).format('YYYY-MM-DD'),
            sortable: true,
        },
        {
            name: 'Gender',
            selector: (row: Animal) => row.gender,
            sortable: true,
        },
        {
            name: 'Creation Date',
            selector: (row: Animal) => moment(row.creationDate).format('YYYY-MM-DD'),
            sortable: true,
        },
        {
            name: 'Update Date',
            selector: (row: Animal) => moment(row.update_date).format('YYYY-MM-DD'),
            sortable: true,
        },
        {
            name: '',
            cell: (row: Animal) => {
                return (
                    <>
                        {userRole && userRole.name !== "USER" && (
                            <>
                                <Link to={'/animals/' + row.id}>
                                    <IconButton>
                                        <EditIcon style={{color: 'steelblue'}}/>
                                    </IconButton>
                                </Link>
                                <IconButton onClick={() => handleClickOpen(row)}>
                                    <ImageIcon style={{color: 'steelblue'}}/>
                                </IconButton>
                                <IconButton onClick={() => handleModalOpen(row)}>
                                    <DeleteIcon style={{color: 'steelblue'}}/>
                                </IconButton>
                            </>
                        )}
                    </>
                );
            }
        },
    ];

    return (
        <>
            {contextHolder}
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

            <Dialog open={open} onClose={handleClose}>
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

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteClose}
            >
                <DialogTitle>Delete Animal</DialogTitle>
                <DialogContent>Are you sure you want to delete this animal?</DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">No</Button>
                    <Button onClick={handleDelete} color="primary" variant="contained">Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}