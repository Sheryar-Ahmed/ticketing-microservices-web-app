import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Alert from '../../components/Alert';


const OrderShow = ({ order, currentUser }) => {

    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(order.expiresAt));
    const [doRequest, errors] = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => console.log(payment)
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeRemaining(calculateTimeRemaining(order.expiresAt));
        }, 1000);

        return () => clearTimeout(timer);
    }, [order.expiresAt, timeRemaining]);

    const open = !!errors;

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

        return <div>
            {`Time left to pay: ${minutes}m ${remainingSeconds}s`}<br />
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey='pk_test_51OSz2MFlXzAcSOjROyFfwYcf94CDCf9NyxFVV9x0uc9i3DxrX52BwGFOOlJuu2Lut8BwnyYHhsLSzNNITXzcf49C002atOsUFD'
                email={currentUser.payload.email}
                amount={order.ticket.price * 100}
            />
        </div>
    }

    return (
        <Box sx={{
            width: '100%',
            my: 14,
            mx: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
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
            {open && <Alert message={errors} severity="error" open={open} />}

        </Box>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/getone/${orderId}`);

    return { order: data.existingOrder };
};

export default OrderShow;
