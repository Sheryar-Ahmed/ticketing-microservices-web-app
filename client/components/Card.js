import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function OutlinedCard({ title, price, id }) {
    return (
        <Box sx={{ minWidth: 275, mb: 1 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ textDecoration: 'none' }}>
                        <em>Title:</em> {title}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div" sx={{ textDecoration: 'none' }}>
                        <em>Price:</em> ${price}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link href='/tickets/[ticketId]' as={`/tickets/${id}`} >
                        <Button size="small" sx={{ textDecoration: 'none' }}>View</Button>
                    </Link>
                </CardActions>
            </Card>
        </Box>
    );
}
