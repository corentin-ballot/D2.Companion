import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import EmptyState from '../../components/EmptyState';
import { useMarket } from '../../providers/sockets/MarketContext';
import useDofusItems, { Item } from '../../hooks/dofus-data/useDofusItems';
import ItemComponent from '../../components/Item';
import Effect from '../../components/Effect';
import useDofusEffects from '../../hooks/dofus-data/useDofusEffects';

interface StatFilterObject {
    id: number;
    min: number;
}

const ITEMS_EFFECT = [111,112,115,116,117,118,119,121,122,123,124,125,126,127,128,138,142,145,151,152,153,154,155,156,157,158,159,160,161,163,171,176,174,178,182,210,211,212,213,214,225,240,241,242,243,244,410,411,412,413,414,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,752,753,754,755,2800,2801,2802,2803,2804,2805,2806,2807,2808,2809,2812,2813]

const Market = () => {
    const d2items = useDofusItems().data;
    const effects = useDofusEffects().data;
    const { items } = useMarket();
    const [displayedItems, setDisplayedItems] = useState([...items].sort((a, b) => a.prices[0] - b.prices[0]));
    const [item, setItem] = useState<Item | undefined>(undefined);

    useEffect(() => {
        setDisplayedItems([...items].sort((a, b) => a.prices[0] - b.prices[0]));
    }, [items]);

    useEffect(() => {
        if (displayedItems && displayedItems.length > 0 && d2items && d2items.length > 0) setItem(d2items.find(i => i.id === displayedItems[0].objectGID))
    }, [displayedItems, d2items]);

    const [statFilters, setStatFilters] = useState([] as StatFilterObject[]);
    const [minStatInputValue, setMinStatInputValue] = useState("");
    const [statInputValue, setStatInputValue] = useState("");

    const addStatFilter = (stat: StatFilterObject) => {
        setStatFilters([...statFilters, stat]);
    }

    const removeStatFilter = (stat: StatFilterObject) => {
        setStatFilters(statFilters.filter(s => s.id !== stat.id));
    }

    const handleAddCurrentStatClicked = () => {
        if (typeof statInputValue === "number") {
            addStatFilter({ id: Number(statInputValue), min: Number(minStatInputValue) });
        }
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
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
                        <Typography variant="h2">{item?.name}</Typography>

                        {/* Default item */}
                        <ItemComponent item={item} />
                    </Grid>
                    <Grid item xs={8}>
                        {/* Filters */}
                        <Box>
                            <Typography variant="h2">Filter items effects</Typography>
                            <Box component="form" sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2), marginBottom: (theme) => theme.spacing(1) }}>
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
                                    {ITEMS_EFFECT.map(effectId => {
                                        const effect = effects?.find(e => e.id === effectId);
                                        const label = effect && effect.description 
                                                ? effect.description.replace(/#1{~1~2 à (-)*}#2(%s)*/, "").replace("{~ps}{~zs}", "")
                                                : "Not found"
                                        return <MenuItem key={effectId} value={effectId}>{label}</MenuItem>
                                    })}
                                    {/* {Array.from(equipmentStats.keys()).filter(statId => !equipmentStats.get(statId)?.negative && statId && equipmentStats.get(statId)?.name).map(statId => <MenuItem key={statId} value={statId}>{equipmentStats.get(statId)?.name}</MenuItem>)} */}
                                </TextField>
                                <Button onClick={handleAddCurrentStatClicked} variant="contained">Add</Button>
                            </Box>
                            <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
                                {statFilters.map(stat => <Chip key={stat.id} label={<Effect id={stat.id} value={stat.min} key={stat.id} />} onDelete={() => removeStatFilter(stat)} />)}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Item list */}
                    {displayedItems.filter(
                        i => i.effects.filter(
                            effect => statFilters.filter(
                                filter => effect.actionId === filter.id && effect.value >= filter.min
                            ).length
                        ).length === statFilters.length
                    )
                        .map(i =>
                            <Grid item xs={3} key={i.objectUID}>
                                <ItemComponent noImage item={item} itemEffects={i.effects} price={i.prices[0]} />
                            </Grid>
                        )
                    }
                </>
            }
        </Grid>
    </Box>
}
export default Market;