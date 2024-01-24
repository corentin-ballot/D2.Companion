/* eslint-disable no-unused-vars */
import { Card, CardContent, CardMedia, Stack } from "@mui/material";
import Progress from "../Progress";
import Effect from "../Effect";
import { Item } from '../../hooks/dofus-data/useDofusItems'
import { ObjectEffect } from "../../providers/sockets/ChatServerContext";
import useDofusEffects from "../../hooks/dofus-data/useDofusEffects";

interface ItemProps {
    item: Item | undefined
    itemEffects?: ObjectEffect[]
}

const ItemComponent = ({ item, itemEffects }: ItemProps) => {
    const effects = useDofusEffects().data
    const possibleEffectZeros = item?.possibleEffects.filter(pe => !itemEffects?.map(ie => ie.actionId).includes(pe.effectId))

    return <Card sx={{ display: 'flex', alignItems: "center" }}>
        {/* <Box> */}
            <CardMedia
                component="img"
                sx={{ maxWidth: 60, flexShrink: 0, margin: "auto" }}
                image={`${process.env.PUBLIC_URL}/img/items/${item?.iconId}.png`}
                alt=""
            />
        {/* </Box> */}
        <CardContent>
            {itemEffects?.map((effect: ObjectEffect) => {
                const possibleEffect = item?.possibleEffects.find((pe: any) => pe.effectId === effect.actionId);

                if (!effect.value) return <span />

                return <Stack key={possibleEffect?.effectId} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                    <Effect id={effect.actionId} value={effect.value} possibleEffect={possibleEffect} />
                    <Progress min={possibleEffect?.diceNum} max={possibleEffect?.diceSide} low={possibleEffect?.diceNum} high={possibleEffect?.diceSide} optimum={possibleEffect?.diceSide} value={effect?.value} />
                </Stack>
            })}

            {possibleEffectZeros?.map(possibleEffect => {
                const effect = effects?.find(e => e.id === possibleEffect.effectId)

                if (!effect) return <span />

                return <Stack key={possibleEffect?.effectId} direction="row" spacing={2} sx={{ color: "grey", justifyContent: "space-between" }}>
                    <Effect id={effect?.id} value={0} possibleEffect={possibleEffect} />
                    <Progress min={possibleEffect?.diceNum} max={possibleEffect?.diceSide} low={possibleEffect?.diceNum} high={possibleEffect?.diceSide} optimum={possibleEffect?.diceSide} value={0} />
                </Stack>
            })}
        </CardContent>
    </Card>
}

export default ItemComponent;