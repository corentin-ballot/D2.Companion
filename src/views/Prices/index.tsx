import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField, Autocomplete, GridLegacy } from '@mui/material';
import { useDofusItemSearch } from '../../hooks/dofus-data/useDofusItem';
import ItemComponent from '../../components/Item';
import { ItemPricesOverTime } from '../../components/ItemPricesOverTime';

// const MAX_AUTOCOMPLETE = 20;

const Prices = () => {
    const [search, setSearch] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(0);

    const items = useDofusItemSearch(search).data;

    const [autoCompleteOptions, setautoCompleteOptions] = useState([] as { id: number, name: string }[]);

    const handlerInputChange = (event: React.SyntheticEvent, value: { id: number, name: string } | null) => {
        setSelectedItemId(value?.id || 0);
    }

    const handlerInputValueChange = (event: React.SyntheticEvent, value: string) => {
        setSearch(value);
    }

    useEffect(() => {
        if (items && items.map)
            setautoCompleteOptions(items.map(i => ({ id: i.id, name: i.name.fr })) || []);
    }, [items]);

    return <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ padding: "16px", marginBottom: "32px" }}>
            <Typography variant="h2" sx={{ marginBottom: "16px" }}>Search</Typography>
            <Box component="form" sx={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "16px" }}>
                <Autocomplete
                    disablePortal
                    id="scope-autocomplete"
                    options={autoCompleteOptions}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => option.name}
                    sx={{ minWidth: 200 }}
                    onChange={handlerInputChange}
                    onInputChange={handlerInputValueChange}
                    renderInput={(params) => <TextField
                        {...params}
                        id="scope-value"
                        label="Item"
                    />}
                />
            </Box>
        </Paper>

        <GridLegacy container spacing={2} sx={{ alignItems: "stretch" }}>
            <GridLegacy item xs={4}>
                <ItemComponent id={selectedItemId} />
            </GridLegacy>
            <GridLegacy item xs={8}>
                <ItemPricesOverTime ids={[selectedItemId]} />
            </GridLegacy>
        </GridLegacy>
    </Box>
}

export default Prices;