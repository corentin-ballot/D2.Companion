/* eslint-disable no-unused-vars */
import { Box, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import Progress from "../Progress";
import Effect from "../Effect";
import useDofusEffects from "../../hooks/dofus-data/.useDofusEffects";
import useDofusItem from "../../hooks/dofus-data/useDofusItem";
import { formatNumber } from "../../utils/formatter";

interface ItemProps {
    id: number
    itemEffects?: any
    statsOnly?: boolean
    price?: number
}

const ItemComponent = ({ id, itemEffects, statsOnly = false, price }: ItemProps) => {
    const itemRequest = useDofusItem(id);
    const effects = useDofusEffects().data

    if(itemRequest.isPending) return <span>Loading...</span>;

    const possibleEffectZeros = itemRequest.data?.possibleEffects.filter(pe => !itemEffects?.map((ie: { action: any; }) => ie.action).includes(pe.effectId))

    if (!itemEffects) return <Card sx={{ height: "100%" }}>
        {!statsOnly && <Typography variant="h2" align="center">{itemRequest.data?.name.fr}</Typography>}
        <Box sx={{ display: 'flex' }}>
            {!statsOnly && <Box sx={{ width: "100%", margin: "auto" }}>
                <CardMedia
                    component="img"
                    sx={{ maxWidth: 60, margin: "auto" }}
                    image={`http://localhost:3960/images/items/${itemRequest.data?.iconId}`}
                    alt=""
                />
            </Box>}
            <CardContent sx={{ whiteSpace: "nowrap", width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                {possibleEffectZeros?.map(possibleEffect => {
                    const effect = effects?.find(e => e.id === possibleEffect.effectId)

                    if (!effect) return <span key={possibleEffect?.effectId} />

                    return <Stack key={possibleEffect?.effectId} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                        <Effect id={effect?.id} possibleEffect={possibleEffect} />
                    </Stack>
                })}
            </CardContent>
        </Box>
    </Card>

    return <Card sx={{ height: "100%" }}>
        {!statsOnly && <Typography variant="h2" align="center">{itemRequest.data?.name.fr}</Typography>}
        <Box sx={{ display: 'flex', height: "100%" }}>
            {!statsOnly && <Box sx={{ width: "100%", margin: "auto" }}>
                <CardMedia
                    component="img"
                    sx={{ maxWidth: 120, margin: "auto" }}
                    image={`http://localhost:3960/images/items/${itemRequest.data?.iconId}`}
                    alt=""
                />
            </Box>}
            <CardContent sx={{ whiteSpace: "nowrap", width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                <Box>
                    {itemEffects?.map((effect: any) => {
                        const possibleEffect = itemRequest.data?.possibleEffects.find((pe: any) => pe.effectId === effect.action);

                        if (!effect.valueInt) return <span key={possibleEffect?.effectId} />

                        return <Stack key={possibleEffect?.effectId} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                            <Effect id={effect.action} value={effect.valueInt} possibleEffect={possibleEffect} />
                            <Progress min={possibleEffect?.diceNum} max={possibleEffect?.diceSide} low={possibleEffect?.diceNum} high={possibleEffect?.diceSide} optimum={possibleEffect?.diceSide} value={effect?.value} />
                        </Stack>
                    })}

                    {possibleEffectZeros?.map(possibleEffect => {
                        const effect = effects?.find(e => e.id === possibleEffect.effectId)

                        if (!effect) return <span key={possibleEffect?.effectId} />

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
        </Box>
    </Card>
}

export default ItemComponent;