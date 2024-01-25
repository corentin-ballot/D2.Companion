import { Box, Typography } from "@mui/material";
import { PossibleEffect } from '../../hooks/dofus-data/useDofusItems'
import useDofusEffects from "../../hooks/dofus-data/useDofusEffects";

interface EffectProps {
    id: number,
    value?: number,
    possibleEffect?: PossibleEffect
}

const Effect = ({ id, value, possibleEffect }: EffectProps) => {
    const effects = useDofusEffects().data
    const effect = effects?.find(ef => ef.id === id);

    if (!effect?.description) return <span />

    if (typeof value === "undefined") return <Box data-statid={id} key={id} sx={{ display: "flex", alignItems: "center" }}>
        <Box>
            {/* eslint-disable-next-line no-nested-ternary */}
            <Typography component="span" sx={{ fontWeight: 300, color:"inherit" }}>
                {effect?.operator === '/'
                    ? `${effect?.description.replace('#4', `${possibleEffect?.diceSide}`)}`
                    : `${effect?.description.replace(/[-]{0,1}#1{~1~2/, `${(possibleEffect?.diceNum ?? 0) * (effect?.operator === '-' ? -1 : 1)}`)
                                            .replace(/[-]{0,1}}#2/, `${(possibleEffect?.diceSide ?? 0) * (effect?.operator === '-' ? -1 : 1)}`)
                                            .replace('{~ps}{~zs}', (possibleEffect?.diceSide ?? 0) > 1 ? 's' : '')}`}
            </Typography>
        </Box>
    </Box>

    const exo = typeof possibleEffect === "undefined";
    const over = possibleEffect && value && value > possibleEffect?.diceSide && possibleEffect?.diceSide > possibleEffect?.diceNum;
    const perf = possibleEffect && possibleEffect?.diceSide > possibleEffect?.diceNum ? value === possibleEffect?.diceSide : value === possibleEffect?.diceNum;

    return <Box data-statid={id} key={id} sx={{ display: "flex", alignItems: "center" }}>
        <Box data-test={`${exo} ${over} ${perf}`}>
            {/* eslint-disable-next-line no-nested-ternary */}
            <Typography component="span" sx={{ fontWeight: (exo || over) ? 700 : 300, color: exo ? "blue" : (perf || over) ? "green" : "inherit" }}>
                {effect?.operator === '/'
                    ? `${effect?.description.replace('#4', value.toString())}`
                    : `${effect?.description.replace(/[-]{0,1}#1{~1~2 à [-]{0,1}}#2/, `${value * (effect?.operator === '-' ? -1 : 1)}`).replace('{~ps}{~zs}', value > 1 ? 's' : '')}`}
            </Typography>
        </Box>
    </Box>
}

export default Effect;