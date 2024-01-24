import { Box, Typography } from "@mui/material";
import { PossibleEffect } from '../../hooks/dofus-data/useDofusItems'
import useDofusEffects from "../../hooks/dofus-data/useDofusEffects";

interface EffectProps {
    id: number,
    value: number,
    possibleEffect?: PossibleEffect
}

const Effect = ({ id, value, possibleEffect }: EffectProps) => {
    const effects = useDofusEffects().data
    const effect = effects?.find(ef => ef.id === id);

    const exo = typeof possibleEffect !== "undefined";
    const over = possibleEffect && value > possibleEffect?.diceSide && possibleEffect?.diceSide > possibleEffect?.diceNum;
    const perf = possibleEffect && possibleEffect?.diceSide > possibleEffect?.diceNum ? value === possibleEffect?.diceSide : value === possibleEffect?.diceNum;
    
    return <Box data-statid={id} key={id} sx={{ display: "flex", alignItems: "center" }}>
        <Box>
            {/* eslint-disable-next-line no-nested-ternary */}
            <Typography component="span" sx={{ fontWeight: exo || over ? 300 : 700, color: exo ? perf || over ? "green" : "inherit" : "blue" }}>
                {effect?.operator === '/'
                    ? `${effect?.description.replace('#4', value.toString())}`
                    : `${effect?.description.replace(/[-]{0,1}#1{~1~2 à [-]{0,1}}#2/, `${value * (effect?.operator === '-' ? -1 : 1)}`).replace('{~ps}{~zs}', value > 1 ? 's' : '')}`}
            </Typography>
        </Box>
    </Box>
}

export default Effect;