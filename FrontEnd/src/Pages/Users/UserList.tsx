import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import axios from "../Axios/AxiosConfig"
import Navbar from "../MainPage/Navbar";
import Footer from "../MainPage/Footer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const baseURL = "/users";

export function UserComponent() {
    const [users, setUsers] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<any>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

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
                    setDeleteDialogOpen(false);
                    messageApi.success("User deleted successfully!");
                })
                .catch(error => {
                    console.error("Error deleting user:", error);
                    messageApi.error("Error deleting user!");
                });
        }
    };

    const handleDeleteOpen = (userId: number) => {
        setSelectedUserId(userId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
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
                                    <IconButton>
                                        <EditIcon style={{color: 'steelblue'}}/>
                                    </IconButton>
                                </Link>
                                <IconButton onClick={() => handleDeleteOpen(row.id)}>
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
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteClose}
                >
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogContent>Are you sure you want to delete this user?</DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteClose} color="primary">No</Button>
                        <Button onClick={handleDelete} color="primary" variant="contained">Yes</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Footer />
        </>
    );
}