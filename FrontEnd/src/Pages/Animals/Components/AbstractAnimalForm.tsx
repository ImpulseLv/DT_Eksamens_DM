import React, { useState } from "react";
import {Link, useLocation} from "react-router-dom";
import { Formik, Form } from "formik";
import { Button, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import {Animal} from "../../../Types/Animal";

export interface AbstractAnimalFormProps {
    initialValues: Animal
    handleFormSubmit: (animal: Animal) => void
    isLoading: boolean;
}

export const AbstractAnimalForm: React.FC<AbstractAnimalFormProps> = (props) => {
    const location = useLocation();
    const defaultStatus = location.state?.status || 'free'; // Check if there's a status passed in location state

    return (
        <div className="centered-container">
            <Formik initialValues={{ ...props.initialValues, statuss: defaultStatus }} onSubmit={props.handleFormSubmit}>
                {({
                      values, handleChange, handleSubmit, setFieldValue
                  }) => (
                    <Form onSubmit={handleSubmit}>
                        <p>
                            <Link to={"/animals/"}><Button variant="text" size="small">← Back</Button></Link>
                        </p>
                        <p>
                            <TextField fullWidth label="Name" variant="outlined" name="name" value={values.name} onChange={handleChange} />
                        </p>
                        <p>
                            <TextField fullWidth label="Type" variant="outlined" name="type" value={values.type} onChange={handleChange} />
                        </p>
                        <p>
                            <TextField fullWidth label="Price" variant="outlined" name="price" value={values.price} onChange={handleChange} />
                        </p>
                        <p>
                            <DatePicker
                                onChange={(date) => setFieldValue("date_of_birth", date)}
                                format="YYYY-MM-DD"
                            />
                        </p>
                        <p>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={values.gender}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </p>
                        <Button variant="outlined" type='submit' size="small" disabled={props.isLoading}>Save</Button>
                    </Form>
                )}
            </Formik>
            <hr />
        </div>
    );
};