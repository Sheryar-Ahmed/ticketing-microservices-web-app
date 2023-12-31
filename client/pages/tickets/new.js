import { Box, TextField, Grid, Button, Alert, Typography } from "@mui/material";
import React from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const CreateTicket = () => {

    const [title, setTitle] = React.useState('');
    const [price, setPrice] = React.useState('');

    const [doRequest, errors] = useRequest({
        url: '/api/ticket/new',
        method: 'post',
        body: { title, price },
        onSuccess: () => Router.push('/')
    });

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };
    const onBlurHandler = () => {
        const value = parseFloat(price);
        if(isNaN(value) || value <=0){
            return;
        }
        setPrice(value.toFixed(2));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };

    const isOpen = !!errors;


    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 20, mx:2 }}>
            <Typography spacing={5} sx={{ mb: 3 }} variant="h4" component="h2" align="center">
                Create a Ticket
            </Typography>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="title"
                        label="Title of the Ticket"
                        name="title"
                        autoComplete="title"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="price"
                        label="Price of the Ticket"
                        type="number"
                        id="price"
                        autoComplete="price"
                        onBlur={onBlurHandler}
                        value={price}
                        onChange={handlePriceChange}
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, p:2 }}
            >
                Create
            </Button>
            {isOpen && <Alert message={errors} severity="error" isOpen={isOpen} />}
        </Box>
    );
};


export default CreateTicket;