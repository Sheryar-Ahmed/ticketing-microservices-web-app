import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import useRequest from '../../hooks/use-request';
import { useEffect } from 'react';
import Router from 'next/router'; // Make sure to import Router

export default () => {
    const [doRequest, errors] = useRequest({
        url: '/api/users/logout',
        method: 'get',
        body: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        doRequest();
    }, [doRequest]); // Include doRequest as a dependency

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}
        >
            <Alert severity="success">Signing You Out...</Alert>
        </Box>
    );
};
