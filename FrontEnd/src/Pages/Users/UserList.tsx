import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import axios from "../Axios/AxiosConfig"
import Navbar from "../MainPage/Navbar";
import Footer from "../MainPage/Footer";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const baseURL = "/users";

export function UserComponent() {
    const [users, setUsers] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<any>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        axios.get("/roles/currentRole")
            .then(response => {
                setUserRole(response.data);
            })
            .catch(error => {
                console.error("Error fetching user role:", error);
            });

        axios.get(baseURL + "/allUsers")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleDelete = () => {
        if (selectedUserId) {
            axios.delete(`${baseURL}/users/${selectedUserId}`)
                .then(response => {
                    console.log(response.data);
                    setUsers(users.filter(user => user.id !== selectedUserId));
                    setModalOpen(false);
                })
                .catch(error => {
                    console.error("Error deleting user:", error);
                });
        }
    };

    const handleModalOpen = (userId: number) => {
        setSelectedUserId(userId);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const columns = [
        {
            name: 'ID',
            selector: (row: any) => row.id,
            sortable: true,
        },
        {
            name: 'Username',
            selector: (row: any) => row.username,
            sortable: true,
        },
        {
            name: 'Password',
            selector: (row: any) => row.password,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row) => row.roles && row.roles.length > 0 ? row.roles[0].name : 'N/A',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: any) => {
                return (
                    <>
                        {userRole && userRole.name !== "USER" && (
                            <>
                                <Link to={`/users/${row.id}`}>
                                    <Button variant="outlined" style={{marginRight: 8}}>Edit</Button>
                                </Link>
                                <Button variant="outlined" onClick={() => handleModalOpen(row.id)}>Delete</Button>
                            </>
                        )}
                    </>
                );
            }
        },
    ];

    return (
        <>
            <Navbar />
            <div className="animalListBlock">
                {userRole && userRole.name !== "USER" && (
                    <Link to={'/users/newUsers/'} style={{ float: "right", margin: 2 }}>
                        <Button variant="outlined" size="small">Create</Button>
                    </Link>
                )}
                <DataTable
                    columns={columns}
                    data={users}
                />
                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="modal-container">
                        <h2 className="modal-title" id="modal-modal-title">Delete User</h2>
                        <p className="modal-description" id="modal-modal-description">Are you sure you want to delete this user?</p>
                        <Button className="modal-button" variant="outlined"  onClick={handleDelete}>Yes</Button>
                        <Button className="modal-button" variant="outlined"  onClick={handleModalClose}>No</Button>
                    </div>
                </Modal>
            </div>
            <Footer />
        </>
    );
}