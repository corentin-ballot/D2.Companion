/* eslint-disable no-unused-vars */
import { Box, Card, CardActions, CardContent, CardMedia, Stack } from "@mui/material";
import Progress from "../Progress";
import Effect from "../Effect";
import { Item } from '../../hooks/dofus-data/useDofusItems'
import { ObjectEffect } from "../../providers/sockets/ChatServerContext";
import useDofusEffects from "../../hooks/dofus-data/useDofusEffects";
import { formatNumber } from "../../utils/formatter";

interface ItemProps {
    item: Item | undefined
    itemEffects?: ObjectEffect[]
    noImage?: boolean
    price?: number
}

const ItemComponent = ({ item, itemEffects, noImage = false, price }: ItemProps) => {
    const effects = useDofusEffects().data
    const possibleEffectZeros = item?.possibleEffects.filter(pe => !itemEffects?.map(ie => ie.actionId).includes(pe.effectId))

    if (!itemEffects) return <Card sx={{ display: 'flex' }}>
        {!noImage && <Box sx={{ width: "100%", margin: "auto" }}>
            <CardMedia
                component="img"
                sx={{ maxWidth: 60, margin: "auto" }}
                image={`${process.env.PUBLIC_URL}/img/items/${item?.iconId}.png`}
                alt=""
            />
        </Box>}
        <CardContent sx={{ whiteSpace: "nowrap", width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
            {possibleEffectZeros?.map(possibleEffect => {
                const effect = effects?.find(e => e.id === possibleEffect.effectId)

                if (!effect) return <span />

                return <Stack key={possibleEffect?.effectId} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                    <Effect id={effect?.id} possibleEffect={possibleEffect} />
                </Stack>
            })}
        </CardContent>
    </Card>

    return <Card sx={{ display: 'flex', height: "100%" }}>
        {!noImage && <Box sx={{ width: "100%", margin: "auto" }}>
            <CardMedia
                component="img"
                sx={{ maxWidth: 60, margin: "auto" }}
                image={`${process.env.PUBLIC_URL}/img/items/${item?.iconId}.png`}
                alt=""
            />
        </Box>}
        <CardContent sx={{ whiteSpace: "nowrap", width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
            <Box>
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
            </Box>
            {typeof price === "number" && <Box sx={{
                display: "flex",
                justifyContent: "center",
                backgroundImage: `linear-gradient(to right, #462523 0, #cb9b51 22%, #ffd662 50%, #cb9b51 78%, #462523 100%)`,
                color: "transparent",
                backgroundClip: "text",
                fontWeight: "bold",
                fontSize: "20px",
            }}>
                {formatNumber(price)} Ҝ
            </Box>}
        </CardContent>
    </Card>
}

export default ItemComponent;