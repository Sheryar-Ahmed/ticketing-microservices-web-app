import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import { Box, Grid } from '@mui/material';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));



const OrderCard = ({ order, currentUser }) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345, background: `${order.status === 'cancelled' ? '#f44336' : '#69f0ae'}` }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {currentUser.email.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={`Order ID: ${order.id}`}
                subheader={`Expires At: ${new Date(order.expiresAt).toLocaleDateString()}`}
            />
            <Grid sx={{ width: '100%' }}>
                <RedeemOutlinedIcon sx={{ fontSize: '100px' }} htmlColor='white' />
            </Grid>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {/* Display other relevant information from the order */}
                    Order Status: {order.status}
                    <br />
                    Order Price: ${order.ticket.price}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography sx={{ color: 'white' }} variant="body1" color="text.secondary">TicketID: {order.ticket.id}</Typography>
                    <Typography sx={{ color: 'white' }} variant="body1" color="text.secondary">Ticket Title: {order.ticket.title}</Typography>
                    <Typography sx={{ color: 'white' }} variant="body1" color="text.secondary">Ticket Price: ${order.ticket.price}</Typography>
                    <Typography sx={{ color: 'white' }} variant="body1" color="text.secondary">Ticket version: {order.ticket.version}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

const MyOrders = ({ orders, currentUser }) => {
    return <>
        <Typography spacing={5} sx={{ mt: 10, mb: 3 }} variant="h4" component="h2" align="center">
            MY Orders
        </Typography>
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
        }}>
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} currentUser={currentUser.payload} />
            ))}
        </Box>
    </>
};


MyOrders.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data.orders }
}


export default MyOrders;