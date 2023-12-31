import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

const OrderShow = ({ order }) => {
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(order.expiresAt));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeRemaining(calculateTimeRemaining(order.expiresAt));
        }, 1000);

        return () => clearTimeout(timer);
    }, [order.expiresAt, timeRemaining]);

    function calculateTimeRemaining(expiresAt) {
        const expirationTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = expirationTime - currentTime;
        const seconds = Math.floor(timeDiff / 1000);

        if (seconds <= 0) {
            return 'Order expired. You need to make an Order again.';
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `Time left to pay: ${minutes}m ${remainingSeconds}s`;
    }

    return (
        <Box sx={{
            width: '100%',
            my: 14,
            mx: 5
        }}>
            <Typography sx={{ background: 'transparent' }} gutterBottom variant="h5" component="div">
                <span style={{ background: '#90CAF9', padding: '4px' }}>{timeRemaining}</span>
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
                <em>Title:</em> {order.ticket.title}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
                <em>Price:</em> ${order.ticket.price}
            </Typography>
            <Button variant="contained" endIcon={<PaidOutlinedIcon />}>
                Pay
            </Button>
        </Box>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/getone/${orderId}`);

    return { order: data.existingOrder };
};

export default OrderShow;
