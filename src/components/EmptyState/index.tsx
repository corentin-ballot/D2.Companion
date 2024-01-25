import React from 'react';
import {Typography, Box, BoxProps} from '@mui/material';

const EmptyState = ({children}: BoxProps) => <Box>
        <Typography variant="subtitle1" align="center">{children}</Typography>
    </Box>

export default EmptyState;