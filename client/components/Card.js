import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function OutlinedCard({ title, price }) {
    return (
        <Box sx={{ minWidth: 275, mb: 1 }}>
            <Card variant="outlined" title={title} price={price}>
                <React.Fragment>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            <em>Title:</em> {title}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            <em>Price:</em> ${price}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Buy Ticket</Button>
                    </CardActions>
                </React.Fragment>
            </Card>
        </Box>
    );
}
