
import { Tooltip, Box } from '@mui/material';

const Progress = ({ value, min, max, low, high, optimum, placement="right" }: any) => <Box>
    <Tooltip title={max ? `${value}/${max}` : value} placement={placement}>
        <meter min={min} max={max} low={low} high={high} optimum={optimum} value={value} />
    </Tooltip>
</Box>

export default Progress