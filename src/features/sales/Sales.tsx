import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Table, TableBody, TableCell, TableSortLabel, TableContainer, TableHead, TableRow, Avatar, Typography, Button } from '@mui/material';
// @ts-ignore
import { exportCsv } from "json2csv-export";

import { useAppSelector } from '../../app/hooks';
import {
    selectSalesHistory
} from './salesSlice';
import EmptyState from '../../components/empty-state/EmptyState';

function Bank() {
    const salesHistory = useAppSelector(selectSalesHistory);

    const [items, setItems] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/items.json').then(res => res.json()).then(res => setItems(res));
    }, []);

    useEffect(() => {
        setSales(salesHistory.map(sale => {
            const item = items.find(i => i._id === sale.id);
            return {
                id: sale.id,
                price: sale.price,
                date: sale.date,
                quantity: sale.quantity,
                iconId: item?.iconId,
                name: item?.name,
                level: item?.level,
            }
        }))
    }, [salesHistory, items]);

    const exportSheet = () => {
        exportCsv({
            header: {
                id: "ID",
                name: "Name",
                level: "Level",
                quantity: "Quantity",
                price: "Price",
                date: "Date",
            },
            data: sales.map(sale => ({...sale, date: new Date(sale.date).toLocaleString()})),
            filename: "Dofus - Sales",
        });
    }

    type Order = 'asc' | 'desc';
    const [order, setOrder] = React.useState<Order>('desc');
    type Column = 'name' | 'quantity' | 'level' | 'price' | 'date';
    const [orderBy, setOrderBy] = React.useState<Column>('date');

    const createSortHandler = (property: Column) => (event: React.MouseEvent<unknown>) => {
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

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                    <Typography>Total: {new Intl.NumberFormat().format(salesHistory.reduce((a,b) => a + b.price, 0))}</Typography>
                    <Button onClick={exportSheet}>
                        Export
                    </Button>
                </Paper>
            </Grid>

            {/* Not mount to display */}
            {sales.length === 0 &&
                <Grid item xs={12}>
                    <EmptyState>
                        No sales registered for now.
                    </EmptyState>
                </Grid>
            }

            {sales.length > 0 && 
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "0px" }} />
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === "name"}
                                            direction={orderBy === "name" ? order : 'desc'}
                                            onClick={createSortHandler("name")}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">

                                        <TableSortLabel
                                            active={orderBy === "level"}
                                            direction={orderBy === "level" ? order : 'desc'}
                                            onClick={createSortHandler("level")}
                                        >
                                            Level
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">

                                        <TableSortLabel
                                            active={orderBy === "quantity"}
                                            direction={orderBy === "quantity" ? order : 'desc'}
                                            onClick={createSortHandler("quantity")}
                                        >
                                            Quantity
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">

                                        <TableSortLabel
                                            active={orderBy === "price"}
                                            direction={orderBy === "price" ? order : 'desc'}
                                            onClick={createSortHandler("price")}
                                        >
                                            Price
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">

                                        <TableSortLabel
                                            active={orderBy === "date"}
                                            direction={orderBy === "date" ? order : 'desc'}
                                            onClick={createSortHandler("date")}
                                        >
                                            Date
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...sales].sort(sortingFunction).map((sale) => (
                                    <TableRow
                                        key={sale.date}
                                        data-id={sale.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={`${process.env.PUBLIC_URL}/img/items/${sale.iconId}.png`} alt={sale.name} />
                                        </TableCell>
                                        <TableCell>{sale.name}</TableCell>
                                        <TableCell align="right">{sale.level}</TableCell>
                                        <TableCell align="right">{sale.quantity}</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat().format(sale.price)}</TableCell>
                                        <TableCell align="right">{new Date(sale.date).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            }
        </Grid>
    </Box>
}

export default Bank;