import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Typography, Card, Stack,
    CardMedia,
    CardContent, Tooltip,
} from '@mui/material';
import EmptyState from '../../components/empty-state/EmptyState';

import { useAppSelector } from '../../app/hooks';
import { selectItem } from './forgemagieSlice';

import { equipmentStats, statImage } from '../../app/equipmentStats';
import { ObjectEffectInteger } from '../../app/dofusInterfaces';

function Forgemagie() {
    const item = useAppSelector(selectItem);

    const [equipment, setEquipment] = useState<any>(null);
    const [equipments, setEquipments] = useState<any[]>([]);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/items.json').then(res => res.json()).then(res => setEquipments(res));
        if (item) setEquipment(equipments.find(e => e._id === item.objectGID));
    }, []);

    useEffect(() => {
        if (item && equipments.length) {
            const eq = equipments.find(e => e._id === item.objectGID);
            if (typeof eq !== "undefined") setEquipment(eq);
        }
    }, [item, equipments]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                {/* Not item to display */}
                {item === null &&
                    <Grid item xs={12}>
                        <EmptyState>
                            Go to the fm interface and select an item.
                        </EmptyState>
                    </Grid>
                }

                {/* Not item to display */}
                {typeof equipment === "undefined" &&
                    <Grid item xs={12}>
                        <EmptyState>
                            Equipment is undefined.
                        </EmptyState>
                    </Grid>
                }

                {/* Items display */}
                {item !== null && equipment &&
                    <>
                        <Grid item xs={12}><Typography variant="h2">{equipment.name}</Typography></Grid>
                        <Grid item xs={4}>

                            <Card sx={{ display: 'flex', alignItems: "center" }}>
                                <CardMedia
                                    component="img"
                                    sx={{ maxWidth: 60, flexShrink: 0 }}
                                    image={process.env.PUBLIC_URL + "/img/items/" + equipment?.iconId + ".png"}
                                    alt=""
                                />
                                <CardContent>
                                    {equipment.possibleEffects.map((stat: any) => {
                                        const effect = item.effects.find(effect => effect.actionId === stat.effectId);

                                        return <Stack key={stat.effectId} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                                            <Statistic id={stat.effectId} possibleEffects={equipment.possibleEffects} key={stat.effectId} />
                                            <Progress min={stat.diceNum} max={stat.diceSide} low={stat.diceNum} high={stat.diceSide} optimum={stat.diceSide} value={effect ? effect.value : 0} />
                                        </Stack>
                                    })}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={8}>
                            <Typography variant="h2">Reliquat : {Math.floor(item.magicPool)}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            {item.history.map((h, index) => <HistoryItem key={index} craftResult={h.craftResult} effects={h.objectInfo.effects} magicPoolStatus={h.magicPoolStatus} />)}
                        </Grid>
                    </>
                }
            </Grid>
        </Box >)
}

export default Forgemagie;

interface StatisticProps {
    id: number | string;
    value?: number | string;
    possibleEffects: {
        effectId: number,
        diceNum: number,
        diceSide: number,
    }[];
}

function Statistic(props: StatisticProps) {
    const effect = props.possibleEffects.find((e) => e.effectId === props.id);
    const statistic = typeof props.id == "number" ? equipmentStats.get(props.id) : { name: props.id, negative: false, reverse: false };

    return <Box data-statid={props.id} key={props.id} sx={{ display: "flex", alignItems: "center" }}>
        {/* @ts-ignore */}
        <img src={process.env.PUBLIC_URL + statImage.get(statistic?.name)} alt="" />
        <Box data-negative={statistic?.negative}>
            {typeof props.value == "undefined" ?
                <Typography component="span">{`${statistic?.reverse ? statistic?.name + " " : ""}${statistic?.negative ? "-" : ""}${effect?.diceNum} ${effect?.diceSide ? (' à ' + (statistic?.negative ? "-" : "") + effect?.diceSide) : ""}${!statistic?.reverse ? " " + statistic?.name + " " : ""}`}</Typography>
                : <Typography component="span"
                    sx={{
                        fontWeight: !effect || effect?.diceSide && props.value >= effect?.diceSide ? 700 : 300,
                        color: effect ? (effect.diceSide && props.value > effect?.diceSide ? "green" : "inherit") : "blue",
                    }}
                >{statistic?.reverse ? statistic?.name + " " : ""}{statistic?.negative ? -props.value : props.value}{!statistic?.reverse ? " " + statistic?.name + " " : ""}</Typography>
            }
        </Box>
    </Box>
}

function Progress(props: { min: number, max: number, low: number, high: number, optimum: number, value: number }) {
    return <Tooltip title={props.value} placement="right">
        <meter min={props.min} max={props.max} low={props.low} high={props.high} optimum={props.optimum} value={props.value}></meter>
    </Tooltip>
}

function HistoryItem(props: { effects: ObjectEffectInteger[], craftResult: number, magicPoolStatus: number }) {
    const reliquat = (props.effects.reduce((prev, curr) => {
        const stat = equipmentStats.get(curr.actionId);
        return prev + curr.value * (stat ? stat.density : 0);
    }, 0));

    return <Box data-result={props.craftResult} data-reliquat={props.magicPoolStatus}>
        {props.effects.map(effect => <Box key={effect.actionId}>{(effect.value > 0 ? `+${effect.value}` : `${effect.value}`) + ` ${equipmentStats.get(effect.actionId)?.name}`}</Box>)}
        {props.magicPoolStatus === 2 && <Box>+{reliquat} reliquat</Box>}
        {props.magicPoolStatus === 3 && <Box>{reliquat} reliquat</Box>}
    </Box>
}