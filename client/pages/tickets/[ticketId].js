import React from 'react';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import useRequest from '../../hooks/use-request';
import CustomizedSnackbars from '../../components/Alert';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
    const [doRequest, errors] = useRequest({
        url: `/api/orders/create/${ticket.id}`,
        method: 'post',
        body: {},
        onSuccess: ({ order }) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    const CreateOrder = async () => {
        await doRequest();
    };
    console.log(errors);
    // Change isOpen to open
    const open = !!errors;

    return (
        <Box sx={{ width: 'full', m: 3 }}>
            <CardContent>
                <Typography gutterBottom variant="h4">
                    {ticket.title}
                </Typography>
                <Typography gutterBottom variant="h6">
                    Price: ${ticket.price}
                </Typography>
            </CardContent>
            <CardActions>
                <Button sx={{ backgroundColor: '#e3f2fd', ml: 1 }} size="small" onClick={CreateOrder}>
                    Purchase
                </Button>
            </CardActions>
            {open && <CustomizedSnackbars message={errors} severity="info" open={open} />}
        </Box>
    );
};

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query; //take the id from the page url
    const { data } = await client.get(`/api/ticket/getone/${ticketId}`);
    return { ticket: data.ticket };
};

export default TicketShow;
