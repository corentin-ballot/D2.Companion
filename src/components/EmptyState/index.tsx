import React from 'react';
import {Typography, Box, BoxProps} from '@mui/material';

const EmptyState = ({children}: BoxProps) => <Box sx={{height: 300, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: '#66B2FF40', borderRadius: "16px" }}>
        <Typography variant="subtitle1" align="center">{children}</Typography>
    </Box>

export default EmptyState;