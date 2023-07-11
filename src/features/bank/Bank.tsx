import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Table, TableBody, TableCell, TableSortLabel, TableContainer, TableHead, TableRow, Avatar, Typography, Button } from '@mui/material';
// @ts-ignore
import { exportCsv } from "json2csv-export";

import { useAppSelector } from '../../app/hooks';
import {
    selectBank
} from './bankSlice';

function Bank() {
    const bank = useAppSelector(selectBank);

    const [bankItems, setBankItems] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/items.json').then(res => res.json()).then(res => setItems(res));
    }, []);

    useEffect(() => {
        setBankItems(bank.objects.map(object => {
            const item = items.find(i => i._id === object.objectGID);
            return {
                id: object.objectGID,
                uid: object.objectUID,
                iconId: item?.iconId,
                name: item?.name,
                level: item?.level,
                quantity: object.quantity,
            }
        }))
    }, [bank, items]);

    const exportSheet = () => {
        exportCsv({
            header: {
                id: "ID",
                name: "Name",
                level: "Level",
                quantity: "Quantity",
            },
            data: bankItems,
            filename: "Dofus - StorageInventoryContent",
        });
    }


    type Order = 'asc' | 'desc';
    const [order, setOrder] = React.useState<Order>('asc');
    type Column = 'name' | 'quantity' | 'level';
    const [orderBy, setOrderBy] = React.useState<Column>('name');

    const createSortHandler = (property: Column) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    const onRequestSort = (
        event: React.MouseEvent<unknown>,
        property: Column,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortingFunction = (a: any, b: any) => {
        if (typeof a[orderBy] === "string" && typeof b[orderBy] === "string") {
            return b[orderBy].localeCompare(a[orderBy]) * (order === 'desc' ? 1 : -1);
        }
        if (typeof a[orderBy] === "number" && typeof b[orderBy] === "number"){
            return (b[orderBy] - a[orderBy]) * (order === 'desc' ? 1 : -1);
        }
        if(typeof a[orderBy] === "undefined" && typeof b[orderBy] !== "undefined"){
            return 1;
        }
        if(typeof b[orderBy] === "undefined" && typeof a[orderBy] !== "undefined" ){
            return -1;
        }
        return 0;
    }

    useEffect(() => {
        console.log(orderBy, order);
    }, [order, orderBy]);

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                    <Typography>Kamas: {new Intl.NumberFormat().format(bank.kamas)}</Typography>
                    <Button onClick={exportSheet}>
                        Export
                    </Button>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "0px" }} />
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "name"}
                                        direction={orderBy === "name" ? order : 'asc'}
                                        onClick={createSortHandler("name")}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">

                                    <TableSortLabel
                                        active={orderBy === "level"}
                                        direction={orderBy === "level" ? order : 'asc'}
                                        onClick={createSortHandler("level")}
                                    >
                                        Level
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">

                                    <TableSortLabel
                                        active={orderBy === "quantity"}
                                        direction={orderBy === "quantity" ? order : 'asc'}
                                        onClick={createSortHandler("quantity")}
                                    >
                                        Quantity
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...bankItems].sort(sortingFunction).map((bankItem) => (
                                <TableRow
                                    key={bankItem.uid}
                                    data-id={bankItem.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={`${process.env.PUBLIC_URL}/img/items/${bankItem.iconId}.png`} alt={bankItem.name} />
                                    </TableCell>
                                    <TableCell>{bankItem.name}</TableCell>
                                    <TableCell align="right">{bankItem.level}</TableCell>
                                    <TableCell align="right">{new Intl.NumberFormat().format(bankItem.quantity)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </Box>
}

export default Bank;