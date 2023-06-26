import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, Grid, Stack, Typography, Card, CardContent, CardMedia, CardActions, MenuItem, TextField } from '@mui/material';

import { useAppSelector } from '../../app/hooks';
import { selectItems } from './marketSlice';
import { equipmentStats, statImage } from '../../app/equipmentStats';
import NumberFormat from '../../components/numberFormat/NumberFormat';
import EmptyState from '../../components/empty-state/EmptyState';

interface StatFilterObject {
    id: number;
    min: number;
}

function Market() {
    const items = useAppSelector(selectItems);
    const [displayedItems, setDisplayedItems] = useState([...items].sort((a, b) => a.prices[0] - b.prices[0]));
    const [possibleEffects, setPossibleEffects] = useState(displayedItems.length ? displayedItems[0].possibleEffects : []);
    const [statFilters, setStatFilters] = useState([] as StatFilterObject[]);
    const [minStatInputValue, setMinStatInputValue] = useState("");
    const [statInputValue, setStatInputValue] = useState("");
    
    useEffect(() => {
        setDisplayedItems([...items].sort((a, b) => a.prices[0] - b.prices[0]));
        setPossibleEffects(displayedItems.length ? displayedItems[0].possibleEffects : []);
    }, [items]);

    const addStatFilter = (stat: StatFilterObject) => {
        setStatFilters([...statFilters, stat]);
    }

    const removeStatFilter = (stat: StatFilterObject) => {
        setStatFilters(statFilters.filter(s => s.id !== stat.id));
    }

    const handleAddCurrentStatClicked = () => {
        console.log("minStatInputValue", typeof minStatInputValue, "statInputValue", typeof statInputValue);
        if (typeof statInputValue === "number") {
            addStatFilter({ id: Number(statInputValue), min: Number(minStatInputValue) });
        }
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ alignItems: "stretch"}}>
            {/* Not item to display */}
            {displayedItems.length === 0 &&
                <Grid item xs={12}>
                    <EmptyState>
                        Go to the equipments shop to get advanced filters.
                    </EmptyState>
                </Grid>
            }

            {/* Items display */}
            {displayedItems && displayedItems.length > 0 &&
                <>
                    <Grid item xs={4}>
                        <Typography variant="h6">{displayedItems[0]?.name}</Typography>

                       {/* Default item */}
                       <Card  sx={{ display: 'flex', alignItems: "center" }}>
                            <CardMedia
                                component="img"
                                sx={{ maxWidth: 60, flexShrink: 0 }}
                                image={ process.env.PUBLIC_URL + displayedItems[0].imgUrl}
                                alt=""
                            />
                            <CardContent>
                                {possibleEffects.map(stat => {
                                    // const key = equipmentStats.get(stat.effectId);
                                    return <Statistic id={stat.effectId} 
                                    // value={{ min: stat.diceNum, max: stat.diceSide }} 
                                    possibleEffects={possibleEffects} key={stat.effectId} />
                                })}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={8}>
                        {/* Filters */}
                        <Box>
                            <Typography variant="h6">Filter items effects</Typography>
                            <Box component="form" sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2), marginBottom: (theme) => theme.spacing(1)}}>
                                <TextField
                                    id="statistic-minimum-value"
                                    label="Minimum"
                                    type="number"
                                    value={minStatInputValue}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setMinStatInputValue(event.target.value);
                                    }}
                                />

                                <TextField
                                    id="statistic-select"
                                    label="Statistic"
                                    select
                                    sx={{ minWidth: 200 }}
                                    value={statInputValue}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setStatInputValue(event.target.value);
                                    }} 
                                >
                                    {Array.from(equipmentStats.keys()).filter(statId => !equipmentStats.get(statId)?.negative && statId && equipmentStats.get(statId)?.name).map(statId => <MenuItem key={statId} value={statId}>{equipmentStats.get(statId)?.name}</MenuItem>)}
                                </TextField>
                                <Button onClick={handleAddCurrentStatClicked} variant="contained">Add</Button>
                            </Box>
                            <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
                                {statFilters.map(stat => <Chip key={stat.id} label={<Statistic id={stat.id} value={stat.min} key={stat.id} possibleEffects={possibleEffects} />} onDelete={() => removeStatFilter(stat)} />)}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Item list */}
                    {displayedItems.filter(
                        item => item.effects.filter(
                            effect => statFilters.filter(
                                filter => effect.actionId === filter.id && effect.value >= filter.min
                            ).length
                        ).length === statFilters.length
                    )
                        .map(item =>
                            <Grid item xs={2} key={item.objectUID}>
                                <Card>
                                    <CardContent>
                                        {item.effects.map(effect => <Statistic id={effect.actionId} value={effect.value} key={effect.actionId} possibleEffects={possibleEffects} />)}
                                    </CardContent>
                                    <CardActions>
                                        <NumberFormat value={item.prices[0]} />
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    }

                    {/* {displayedItems && <div><pre>{JSON.stringify(displayedItems, null, 2) }</pre></div>} */}
                </>
            }
        </Grid>
    </Box>
}

export default Market;

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

    return <Box data-statid={props.id} key={props.id} sx={{display: "flex", alignItems: "center"}}>
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