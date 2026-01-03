import React from 'react';
import { useRoutes, Navigate, useLocation, Link } from 'react-router-dom';
import { Tab, Tabs, Box, Paper } from '@mui/material';
import Paddock from './Paddock';
import BreedingObjects from './BreedingObjects';
import Prices from './Prices';

const defaultTab = "paddock";

const Farming = () => {
    const location = useLocation();

    const tabRoutes = [
        {
            // Redirects the base URL (/settings) to the default tab (/settings/overview)
            path: '/', 
            element: <Navigate to="paddock" replace /> 
        },
        {
            path: 'paddock',
            element: <Paddock/>,
        },
        {
            path: 'objects',
            element: <BreedingObjects />,
        },
        {
            path: 'prices',
            element: <Prices />,
        }
    ];
    
    const element = useRoutes(tabRoutes);

    const currentValue = location.pathname.split('/').pop() || defaultTab;

    return <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{marginBottom: 2}}>
            <Tabs
                value={currentValue}
                // onChange={handleTabChange}
            >
                <Tab label="Paddock" value='paddock' component={Link} to='paddock' />
                <Tab label="Farming objects" value="objects" component={Link} to='objects' />
                <Tab label="Prices" value="prices" component={Link} to='prices' />
            </Tabs>
        </Paper>

        <Box>
            {element}
        </Box>
    </Box>;
}

export default Farming;