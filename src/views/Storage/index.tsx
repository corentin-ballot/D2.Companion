/* eslint-disable no-nested-ternary */
import React from 'react';
import { Box, Paper, GridLegacy, Table, TableBody, TableCell, TableSortLabel, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';
// @ts-ignore
import { exportCsv } from "json2csv-export";

import EmptyState from '../../components/EmptyState';
import { useStorage } from '../../providers/sockets/StorageContext';
import ItemStorage from '../../components/ItemStorage';

const Storage = () => {
    const { objects, kamas } = useStorage();

    const exportSheet = () => {
        exportCsv({
            header: {
                gid: "ID",
                name: "Name",
                quantity: "Quantity",
            },
            data: objects.map(o => o.item),
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
        {objects.length === 0 &&
            <GridLegacy item xs={12}>
                <EmptyState>
                    Go to the storage or havenbag storage to view items.
                </EmptyState>
            </GridLegacy>
        }

        {objects.length > 0 &&
            <GridLegacy container spacing={2}>
                <GridLegacy item xs={12}>
                    <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                        <Typography>Kamas: {new Intl.NumberFormat().format(kamas)}</Typography>
                        <Button onClick={exportSheet}>
                            Export
                        </Button>
                    </Paper>
                </GridLegacy>

                <GridLegacy item xs={12}>
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
                                {[...objects].sort(sortingFunction).map((object) => (
                                    <ItemStorage object={object} key={object.item.uid} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </GridLegacy>
            </GridLegacy>
        }
    </Box>
}

export default Storage;