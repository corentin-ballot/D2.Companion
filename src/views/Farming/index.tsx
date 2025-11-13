import React from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import Paddock from './Paddock';
import BreedingObjects from './BreedingObjects';
import Prices from './Prices';

const Farming = () => {
    const [tab, setTab] = React.useState('paddock');

    const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
        setTab(newTab);
    };

    return <Box sx={{ flexGrow: 1 }}>
        <Tabs
            value={tab}
            onChange={handleTabChange}
        >
            <Tab label="Paddock" value="paddock" />
            <Tab label="Farming objects" value="objects" />
            <Tab label="Prices" value="prices" />
        </Tabs>

        {/* Paddock */}
        <Box sx={{ display: tab === "paddock" ? "block" : "none" }}>
            <Paddock/>
        </Box>
        {/* Farming objects */}
        <Box sx={{ display: tab === "objects" ? "block" : "none" }}>
            <BreedingObjects />
        </Box>
        {/* Prices */}
        <Box sx={{ display: tab === "prices" ? "block" : "none" }}>
            <Prices />
        </Box>
    </Box>;
}

export default Farming;