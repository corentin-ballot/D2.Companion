import React from 'react';
import { Box } from '@mui/material';
import ItemPricesOverTime from '../../../components/ItemPricesOverTime';

const Prices = () => <Box sx={{ flexGrow: 1 }}>
  <ItemPricesOverTime ids={[797, 801, 805, 810, 814, 817]} colors={["#714501", "#00a816", "#81028a", "#b9c301", "#0073ba", "#e60201"]} />
</Box>;

export default Prices;