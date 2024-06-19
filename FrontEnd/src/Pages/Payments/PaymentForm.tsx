import React, {useEffect, useState} from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {Link, useNavigate, useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import {AnimalStatuss} from "../../Types/Animal";

const PaymentForm = () => {
    const baseURL = "/animals";
    const navigate = useNavigate();
    const { animalId } = useParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const [state, setState] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    });

    const [animalData, setAnimalData] = useState<{ name: string, price: number, id: string } | null>(null);
    const [formFilled, setFormFilled] = useState(false);
    const getAnimalById = (id: string) => {
        axios
            .get(`${baseURL}/${id}`)
            .then((response) => {
                setAnimalData({
                    name: response.data.name,
                    price: response.data.price,
                    id: response.data.id
                });
            })
            .catch((error) => {
                console.error("Error fetching animal data:", error);
            });
    };

    useEffect(() => {
        if (animalId) {
            getAnimalById(animalId);
        }
    }, [animalId]);
    const handleInputChange = (evt) => {
        let { name, value } = evt.target;
        function restrictNumericInput(value : string) {
            // Regular expression to match only numeric characters
            const regex = /[^0-9]/g;

            // Remove any non-numeric characters using the regex
            return (
                value.replace(regex, '')
        );
        }

        if (name === 'number') {
            // Limit card number to 16 digits
            if (value.length > 16) return;
            value = restrictNumericInput(value);
        }

        if (name === 'cvc') {
            // Limit CVC to 3 digits
            if (value.length > 3) return;
            value = restrictNumericInput(value);
        }


        if (name === 'expiry') {
            value = restrictNumericInput(value);
            // Automatically format expiry as MM/YY
            let formattedValue = value.replace(/[^\d]/g, '');
            if (formattedValue.length > 4) return;

            if (formattedValue.length > 2) {
                formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
            }

            setState((prev) => ({ ...prev, [name]: formattedValue }));
            return;
        }

        setState((prev) => ({ ...prev, [name]: value }));

        // Check if all fields are filled
        const { number, expiry, cvc, name: fullName } = { ...state, name: value };
        setFormFilled(number !== '' && expiry !== '' && cvc !== '' && fullName !== '');
    }

    const handleInputFocus = (evt) => {
        setState((prev) => ({ ...prev, focus: evt.target.name }));
    }

    const handlePay = () => {
        if (animalData) {
            axios.put(`${baseURL}/${animalData.id}/status?status=${AnimalStatuss.taken}`)
                .then(() => {
                    console.log('Animal status updated to Taken');
                    setIsSuccess(true); // Устанавливаем флаг успеха для перехода на следующую страницу
                })
                .catch((error) => {
                    console.error('Error updating animal status:', error);
                });
        }
    }

    return (
        <>
        <div className="form-container">
            <h2>Payment Form</h2>
            <div className="card-container">
                <Cards
                    number={state.number}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    name={state.name}
                    focused={state.focus as any}
                />
            </div>
            <form>
                <input
                    type="text"
                    name="number"
                    placeholder="Card Number"
                    value={state.number}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    maxLength={16}

                />
                <input
                    type="text"
                    name="expiry"
                    placeholder="Expiry (MM/YY)"
                    value={state.expiry}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}

                />
                <input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    value={state.cvc}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    maxLength={3}

                />
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={state.name}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    maxLength={18}

                />
            </form>
            {animalData && (
                <div>
                    <p>Animal Name: {animalData.name}</p>
                    <p>Animal Price: ${animalData.price}</p>
                </div>
            )}
            <Button variant="contained" size="small" color="primary" style={{marginRight: 10}} onClick={handlePay} disabled={!formFilled}>
                Pay
            </Button>
            <Link to="/animalCard" ><Button variant="outlined" size="small">Back</Button></Link>
        </div>
        </>
    );
}

export default PaymentForm;