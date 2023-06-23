import React from 'react';
import { Box, BoxProps } from '@mui/system';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@material-ui/core/styles';

interface EmptyStateProps extends BoxProps {
}

const EmptyState = (props: EmptyStateProps) => {
    const theme = useTheme();
    
    return (
    <Box sx={{
        backgroundColor: alpha(theme.palette.primary.light, .5),
        padding: (theme) => theme.spacing(4),
        borderRadius: (theme) => theme.spacing(.5),
    }}>
        <Typography variant="h6" align="center" sx={{color: theme.palette.primary.dark}}>{props.children}</Typography>
    </Box>
)}

export default EmptyState;