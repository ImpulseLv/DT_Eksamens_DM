import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from "moment";
import Button from '@mui/material/Button';
import axios from "../Axios/AxiosConfig"
import Navbar from "../MainPage/Navbar";
import Footer from "../MainPage/Footer";

const baseURL = "/users";

export function UserComponent() {
    const [users, setUsers] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<any>(null);

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
                console.log(response.data);
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const columns = [
        {
            name: 'ID',
            selector: (row: any) => row.id,
            sortable:true,
        },
        {
            name: 'Username',
            selector: (row: any) => row.username,
            sortable:true,
        },
        {
            name: 'Password',
            selector: (row: any) => row.password,
            sortable:true,
        },
        {
            name: 'Role',
            selector: (row) => row.roles && row.roles.length > 0 ? row.roles[0].name : 'N/A',
            sortable:true,
        },
        {
            name: '',
            cell: (row: any) => {
                return (
                    <>
                        {userRole && userRole.name !== "USER" && (
                            <Link to={`/users/${row.id}`}>
                                <Button variant="outlined">Edit</Button>
                            </Link>
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
            </div>
            <Footer />
        </>
    );
}