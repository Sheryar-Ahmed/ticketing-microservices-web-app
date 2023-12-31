import React from 'react';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const TicketShow = ({ ticket }) => {
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
                <Button sx={{ backgroundColor: '#e3f2fd', ml: 1 }} size="small">
                    Purchase
                </Button>
            </CardActions>
        </Box>
    );
};

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query; //take the id from the page url
    const { data } = await client.get(`/api/ticket/getone/${ticketId}`);
    return { ticket: data.ticket }
}

export default TicketShow;