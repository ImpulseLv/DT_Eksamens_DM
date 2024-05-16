import React, {useState} from "react";
import {Animal} from "../../../Types/Animal";
import {Link} from "react-router-dom";
import { Form, Formik} from "formik";
import Button from "@mui/material/Button";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers';




export interface AbstractAnimalFormProps{
    initialValues : Animal
    handleFormSubmit : (animal : Animal) => void
    isLoading: boolean;
}
export const AbstractAnimalForm: React.FC<AbstractAnimalFormProps> = (props) => {

    return (
        <div className="centered-container">
            <Formik initialValues={props.initialValues} onSubmit={props.handleFormSubmit}>
                {({
                      values, handleChange, handleSubmit, setFieldValue
                  }) => (
                    <Form onSubmit={handleSubmit}>
                        <p>
                            <Link to={"/animals/"}><Button variant="text" size="small">← Back</Button></Link>
                        </p>
                        <p>
                            <TextField fullWidth id="outlined-basic" label="Name" variant="outlined"  name="name" value={values.name} onChange={handleChange}  />
                        </p>
                        <p>
                            <TextField fullWidth id="outlined-basic" label="Type" variant="outlined"  name="type" value={values.type} onChange={handleChange} />
                        </p>
                        <p>
                            <TextField fullWidth id="outlined-basic" label="Status" variant="outlined"  name="statuss" InputProps={{readOnly: true}} value={values.statuss} onChange={handleChange} />
                        </p>
                        <p>
                                <DatePicker
                                    onChange={(date) => setFieldValue("date_of_birth", date)}
                                    format="YYYY-MM-DD"
                                />

                        </p>
                        <p>
                            <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="gender"
                                value={values.gender}
                                label="Gender"
                                onChange={handleChange}
                            >
                                <MenuItem value={"male"}>Male</MenuItem>
                                <MenuItem value={"female"}>Female</MenuItem>
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