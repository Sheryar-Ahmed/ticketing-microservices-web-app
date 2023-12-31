import { Box, Typography } from '@mui/material';
import OutlinedCard from '../components/Card';

const LandingPage = ({ currentUser, tickets }) => {
    return (
        <Box sx={{ mx: 5, my: 10 }}>
            <Typography spacing={5} sx={{ mb: 3 }} variant="h4" component="h2" align="center">
                Tickets for Sale
            </Typography>
            {tickets && tickets.map((item) => <OutlinedCard title={item.title} price={item.price} />)}
        </Box>
    );
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/ticket/getall');
    return { tickets: data.alltickets };
}

export default LandingPage;
