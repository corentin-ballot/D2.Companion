/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Table, TableBody, TableCell, TableSortLabel, TableContainer, TableHead, TableRow, Avatar, Typography, Button } from '@mui/material';
// @ts-ignore
import { exportCsv } from "json2csv-export";

import EmptyState from '../../components/EmptyState';
import { useStorage } from '../../providers/sockets/StorageContext';
import useDofusItems from '../../hooks/dofus-data/useDofusItems';
import useDofusMonsters from '../../hooks/dofus-data/useDofusMonsters';

const Storage = () => {
    const { objects, kamas } = useStorage();
    const items = useDofusItems().data;
    const monsters = useDofusMonsters().data;

    const [storageItems, setStorageItems] = useState<any[]>([]);

    useEffect(() => {
        setStorageItems(objects.map(object => {
            const item = items?.find(i => i.id === object.objectGID);
            const name = 
                object.objectGID === 10418 ? `Archi-monstre : ${monsters?.find(m => m.id === object.effects[0]?.diceConst)?.name}` 
                : object.objectGID === 7010 ? `Âme : ${monsters?.find(m => m.id === object.effects[0]?.diceConst)?.name}` 
                : item?.name;
            return {
                id: object.objectGID,
                uid: object.objectUID,
                iconId: item?.iconId,
                name,
                level: item?.level,
                quantity: object.quantity,
            }
        }))
    }, [objects, items]);

    const exportSheet = () => {
        exportCsv({
            header: {
                id: "ID",
                name: "Name",
                level: "Level",
                quantity: "Quantity",
            },
            data: storageItems,
            filename: "Dofus - StorageInventoryContent",
        });
    }


    type Order = 'asc' | 'desc';
    const [order, setOrder] = React.useState<Order>('asc');
    type Column = 'name' | 'quantity' | 'level';
    const [orderBy, setOrderBy] = React.useState<Column>('name');

    const onRequestSort = (
        event: React.MouseEvent<unknown>,
        property: Column,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property: Column) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
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

    return <Box sx={{ flexGrow: 1 }}>

        {/* No storage to display */}
        {storageItems.length === 0 &&
            <Grid item xs={12}>
                <EmptyState>
                    Go to the storage or havenbag storage to view items.
                </EmptyState>
            </Grid>
        }

        {storageItems.length > 0 &&
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                        <Typography>Kamas: {new Intl.NumberFormat().format(kamas)}</Typography>
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
                                {[...storageItems].sort(sortingFunction).map((storageItem) => (
                                    <TableRow
                                        key={storageItem.uid}
                                        data-id={storageItem.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={`http://localhost:3980/img/items/${storageItem.iconId}`} alt={storageItem.name} />
                                        </TableCell>
                                        <TableCell>{storageItem.name}</TableCell>
                                        <TableCell align="right">{storageItem.level}</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat().format(storageItem.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        }
    </Box>
}

export default Storage;