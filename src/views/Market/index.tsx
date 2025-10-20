import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, GridLegacy, MenuItem, Stack, TextField, Typography } from '@mui/material';
import EmptyState from '../../components/EmptyState';
import { useMarket } from '../../providers/sockets/MarketContext';
import ItemComponent from '../../components/Item';
import Effect from '../../components/Effect';
import useDofusEffects from '../../hooks/dofus-data/.useDofusEffects';

interface StatFilterObject {
    id: number;
    min: number;
}

const ITEMS_EFFECT = [111,112,115,116,117,118,119,121,122,123,124,125,126,127,128,138,142,145,151,152,153,154,155,156,157,158,159,160,161,163,171,176,174,178,182,210,211,212,213,214,225,240,241,242,243,244,410,411,412,413,414,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,752,753,754,755,2800,2801,2802,2803,2804,2805,2806,2807,2808,2809,2812,2813]

const Market = () => {
    const effects = useDofusEffects().data;
    const { items } = useMarket();
    const [displayedItems, setDisplayedItems] = useState([...items].sort((a, b) => parseInt(a.prices[0], 10) - parseInt(b.prices[0], 10)));
    const [itemId, setItemId] = useState(0);

    useEffect(() => {
        setDisplayedItems([...items].sort((a, b) => parseInt(a.prices[0], 10) - parseInt(b.prices[0], 10)));
    }, [items]);

    useEffect(() => {
        if(displayedItems && displayedItems.length > 0) {
            setItemId(displayedItems[0].gid);
        }
    }, [displayedItems]);

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
        <GridLegacy container spacing={2} sx={{ alignItems: "stretch" }}>
            {/* Not item to display */}
            {displayedItems.length === 0 &&
                <GridLegacy item xs={12}>
                    <EmptyState>
                        Go to the equipments shop to get advanced filters.
                    </EmptyState>
                </GridLegacy>
            }

            {/* Items display */}
            {displayedItems && displayedItems.length > 0 &&
                <>
                    <GridLegacy item xs={4}>
                        {/* Default item */}
                        <ItemComponent id={itemId} />
                    </GridLegacy>
                    <GridLegacy item xs={8}>
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
                    </GridLegacy>

                    {/* Item list */}
                    {displayedItems.filter(
                        i => i.effects.filter(
                            effect => statFilters.filter(
                                filter => effect.action === filter.id && effect.valueInt && effect.valueInt >= filter.min
                            ).length
                        ).length === statFilters.length
                    )
                        .map(i =>
                            <GridLegacy item xs={3} key={i.uid}>
                                <ItemComponent key={i.uid} statsOnly id={i.gid} itemEffects={i.effects} price={parseInt(i.prices[0], 10)} />
                            </GridLegacy>
                        )
                    }
                </>
            }
        </GridLegacy>
    </Box>
}
export default Market;