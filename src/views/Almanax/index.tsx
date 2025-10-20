import React, { useState } from 'react';
import { Box, Paper, GridLegacy, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, FormControl, InputLabel, Select, MenuItem, Avatar, Typography, CircularProgress, } from '@mui/material';
import useDofusMonthlyAlmanax, { Quest } from '../../hooks/dofus-data/useDofusMonthlyAlmanax';
import useDofusItem from '../../hooks/dofus-data/useDofusItem';

const getKamasReward = (kamasScaleWithPlayerLevel: boolean, optimalLevel: number, kamasRatio: number, duration: number, i: number) => {
    const o = kamasScaleWithPlayerLevel && i !== -1 ? i : optimalLevel; 
    return Math.floor((o ** 2 + 20 * o - 20) * kamasRatio * duration)
}

interface ItemProps {
    quest: Quest
}

const QuestRow = ({quest}:ItemProps) => {
    const id = quest.need.items[0];
    if(!id) return null;
    const item = useDofusItem(id);
    const quantity = quest.need.quantities[0];
    const step = quest.steps[0];
    const stepRreward = quest.steps[0].rewards[quest.steps[0].rewards.length-1];
    const reward = getKamasReward(stepRreward.kamasScaleWithPlayerLevel, step.optimalLevel, stepRreward.kamasRatio, step.duration, -1);
    const rentability = Math.floor(reward/quantity);
    const averagePrice = item.data?.estimatedPrice || -1;


    return <TableRow
            key={quest.id}
            data-id={quest.id}
            sx={{ backgroundColor: rentability > averagePrice ? "lightGreen" : "null" }}>
        <TableCell sx={{ width: "0px" }} />
        <TableCell>
            {new Date(quest.date * 86400 * 1000).toLocaleDateString()}
        </TableCell>
        <TableCell align="right">
            <Box sx={{display: "flex", justifyContent: "start", alignItems: "center", gap: 1}}>
                {item.data && <>
                    <Avatar sx={{ width: 32, height: 32 }} variant="square" src={`http://localhost:3960/images/items/${item.data?.iconId}`} alt={item.data?.name.fr} />
                    <Typography variant="body1">{item.data?.name.fr}</Typography>
                </>}
            </Box>    
        </TableCell>
        <TableCell align="right">{quantity} ({quantity*19})</TableCell>
        <TableCell align="right">{new Intl.NumberFormat().format(reward)}</TableCell>
        <TableCell align="right">{new Intl.NumberFormat().format(rentability)}</TableCell>
        <TableCell align="right">{new Intl.NumberFormat().format(averagePrice)}</TableCell>
    </TableRow>
}

const Sales = () => {
    const today = new Date();
    const [month, setMonth] = useState<any>(today.getMonth()+1);
    const [year, setYear] = useState<any>(today.getFullYear());

    const almanaxQuests = useDofusMonthlyAlmanax(year, month);

    return <Box sx={{ flexGrow: 1 }}>
        <Box>
            <GridLegacy container spacing={2}>
                <GridLegacy item xs={12}>
                    <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: (theme: any) => theme.spacing(1) }}>
                        <Box>
                            <FormControl>
                                <InputLabel id="month-label">Month</InputLabel>
                                <Select
                                    labelId="month-label"
                                    value={month}
                                    label="Month"
                                    onChange={(e) => setMonth(e.target.value)}
                                >
                                    {Array.from({ length: 12 }, (_, i) => new Date(2025, i).toLocaleString('fr', { month: 'long' })).map((m, i) => (
                                        <MenuItem key={m} value={i + 1}>
                                            {m}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="year-label">Year</InputLabel>
                                <Select
                                    labelId="year-label"
                                    value={year}
                                    label="Year"
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                                        <MenuItem key={y} value={y}>
                                            {y}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Button onClick={() => { }}>
                            Export
                        </Button>
                    </Paper>
                </GridLegacy>

                <GridLegacy item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "0px" }} />
                                    <TableCell>
                                        Date
                                    </TableCell>
                                    <TableCell>
                                        Ressource
                                    </TableCell>
                                    <TableCell align="right">
                                        Quantity
                                    </TableCell>
                                    <TableCell align="right">
                                        Reward
                                    </TableCell>
                                    <TableCell align="right">
                                        Rentability
                                    </TableCell>
                                    <TableCell align="right">
                                        Average price
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {almanaxQuests.data?.filter((quest) => quest.name.fr.startsWith("Offrande à")).map((quest) => <QuestRow quest={quest} />)}
                            </TableBody>
                        </Table>
                            {!almanaxQuests.data && <Box sx={{ display: "flex", justifyContent: "center", margin: 1}}><CircularProgress /></Box>}
                    </TableContainer>
                </GridLegacy>
            </GridLegacy>
        </Box>

    </Box>
}

export default Sales;