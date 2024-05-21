import React from "react";

import {Link} from "react-router-dom";
import { Form, Formik} from "formik";
import Button from "@mui/material/Button";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {User} from "../../../Types/User";
import {prop} from "react-data-table-component/dist/src/DataTable/util";

export interface AbstractUserFormProps{
    initialValues : User
    handleFormSubmit : (user : User) => void
    isLoading: boolean;
}
export const AbstractUserForm: React.FC<AbstractUserFormProps> = (props) => {
    console.log(props)
    const isEditing = !props.initialValues.id;
    return (
        <div className="centered-container">
            <Formik initialValues={props.initialValues} onSubmit={props.handleFormSubmit}>
                {({
                      values, handleChange, handleSubmit, setFieldValue
                  }) => (
                    <Form onSubmit={handleSubmit}>
                        <p>
                            <Link to={"/users/"}><Button variant="text" size="small">← Back</Button></Link>
                        </p>
                        <p>
                            <TextField fullWidth id="outlined-basic" required label="Username" variant="outlined"  name="username" value={values.username} onChange={handleChange}  />
                        </p>
                        <p>
                            <TextField fullWidth id="outlined-basic" required = {isEditing} label="Password" variant="outlined"  name="password" value={values.password} onChange={handleChange} />
                        </p>
                        <p>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Roles</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    required
                                    name="roles"
                                    value={values.roles}
                                    label="Roles"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"USER"}>USER</MenuItem>
                                    <MenuItem value={"MODERATOR"}>MODERATOR</MenuItem>
                                    <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                                </Select>
                            </FormControl>
                        </p>
                        <Button variant="outlined" type='submit' size="small" disabled={props.isLoading} >Save</Button>
                    </Form>
                )}
            </Formik>
            <hr />
        </div>
    );
};