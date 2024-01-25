
import { Tooltip, Box } from '@mui/material';

const Progress = ({ value, min, max, low, high, optimum, placement = "right" }: any) => {
    if (typeof value !== "number") return <span />

    if (min > max) return <Box>
        <Tooltip title={max ? `${value}/${max}` : value} placement={placement}>
            <meter min={max} max={min} low={high} high={low} optimum={optimum} value={value} />
        </Tooltip>
    </Box>

    return <Box>
        <Tooltip title={max ? `${value}/${max}` : value} placement={placement}>
            <meter min={min} max={max} low={low} high={high} optimum={optimum} value={value} />
        </Tooltip>
    </Box>
}

export default Progress