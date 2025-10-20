/* eslint-disable no-nested-ternary */
import { Typography } from "@mui/material";
import { PossibleEffect } from "../../hooks/dofus-data/useDofusItem";
import useDofusEffect from "../../hooks/dofus-data/useDofusEffect";

interface EffectProps {
    id: number,
    value?: number,
    possibleEffect?: PossibleEffect
}

const Effect = ({ id, value, possibleEffect }: EffectProps) => {
    const effect = useDofusEffect(id).data;

    if (!effect?.description) return <span />

    if (typeof value === "undefined") return <Typography component="span" sx={{ fontWeight: 300, color: "inherit" }}>
        {effect?.characteristicOperator === '/'
            ? `${effect?.description.fr.replace('#4', `${possibleEffect?.diceSide}`)}`
            : `${effect?.description.fr.replace(/[-]{0,1}#1{~1~2/, `${(possibleEffect?.diceNum ?? 0) * (effect?.characteristicOperator === '-' ? -1 : 1)}`)
                .replace(/[-]{0,1}}#2/, `${(possibleEffect?.diceSide ?? 0) * (effect?.characteristicOperator === '-' ? -1 : 1)}`)
                .replace('{~ps}{~zs}', (possibleEffect?.diceSide ?? 0) > 1 ? 's' : '')}`}
    </Typography>

    const exo = typeof possibleEffect === "undefined";
    const over = possibleEffect && value && value > possibleEffect?.diceSide && possibleEffect?.diceSide > possibleEffect?.diceNum;
    const perf = possibleEffect && possibleEffect?.diceSide > possibleEffect?.diceNum ? value === possibleEffect?.diceSide : value === possibleEffect?.diceNum;

    return <Typography component="span" sx={{ fontWeight: (exo || over) ? 700 : 300, color: exo ? "blue" : (perf || over) ? "green" : "inherit" }}>
        {effect?.characteristicOperator === '/'
            ? `${effect?.description.fr.replace('#4', value.toString())}`
            : `${effect?.description.fr.replace(/[-]{0,1}#1{{~1~2 à [-]{0,1}}}#2/, `${value * (effect?.characteristicOperator === '-' ? -1 : 1)}`).replace('{~ps}{~zs}', value > 1 ? 's' : '')}`}
    </Typography>
}

export default Effect;