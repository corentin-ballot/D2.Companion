import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Paper, GridLegacy, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Typography, Button } from '@mui/material';
// @ts-ignore
import { exportCsv } from "json2csv-export";
import EmptyState from '../../components/EmptyState';
import { useSales } from '../../providers/sockets/SalesContext';
import useDofusItems from '../../hooks/dofus-data/.useDofusItems';

const Sales = () => {
    const sales = useSales();
    const items = useDofusItems().data;

    const [displayedSales, setDisplayedSales] = useState<any[]>([]);
    const [displayedPurchases, setDisplayedPurchases] = useState<any[]>([]);

    const [tab, setTab] = React.useState('sales');

    const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
        setTab(newTab);
    };

    useEffect(() => {
        setDisplayedSales(sales.history.map(sale => {
            const item = items?.find(i => i.id === sale.id);
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
    }, [sales.history, items]);

    useEffect(() => {
        setDisplayedPurchases(sales.purchases.map(sale => {
            const item = items?.find(i => i.id === sale.id);
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
    }, [sales.purchases, items]);

    const exportSheet = (exports: any) => {
        exportCsv({
            header: {
                id: "ID",
                name: "Name",
                level: "Level",
                quantity: "Quantity",
                price: "Price",
                date: "Date",
            },
            data: exports.map((sale: any) => ({ ...sale, date: new Date(sale.date).toLocaleString() })),
            filename: "Dofus - Sales",
        });
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Tabs
            value={tab}
            onChange={handleTabChange}
        >
            <Tab label="Sales" value="sales" />
            <Tab label="Purchases" value="purchases" />
        </Tabs>

        {/* Sales */}
        <Box sx={{ display: tab === "sales" ? "block" : "none" }}>
            <GridLegacy container spacing={2}>
                <GridLegacy item xs={12}>
                    <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                        <Typography>Total: {new Intl.NumberFormat().format(sales.history.reduce((a, b) => a + b.price, 0))}</Typography>
                        <Button onClick={() => exportSheet(displayedSales)}>
                            Export
                        </Button>
                    </Paper>
                </GridLegacy>

                {/* Not mount to display */}
                {displayedSales.length === 0 &&
                    <GridLegacy item xs={12}>
                        <EmptyState>
                            No sales registered for now.
                        </EmptyState>
                    </GridLegacy>
                }

                {displayedSales.length > 0 &&
                    <GridLegacy item xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: "0px" }} />
                                        <TableCell>
                                            Name
                                        </TableCell>
                                        <TableCell align="right">
                                            Level
                                        </TableCell>
                                        <TableCell align="right">
                                            Quantity
                                        </TableCell>
                                        <TableCell align="right">
                                            Price
                                        </TableCell>
                                        <TableCell align="right">
                                            Date
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedSales.map((sale) => (
                                        <TableRow
                                            key={sale.date}
                                            data-id={sale.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={`http://localhost:3960/images/items/${sale.iconId}`} alt={sale.name} />
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
                    </GridLegacy>
                }
            </GridLegacy>
        </Box>

        {/* Purchases */}
        <Box sx={{ display: tab === "purchases" ? "block" : "none" }}>
            <GridLegacy container spacing={2}>
                <GridLegacy item xs={12}>
                    <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                        <Typography>Total: {new Intl.NumberFormat().format(sales.purchases.reduce((a, b) => a + b.price, 0))}</Typography>
                        <Button onClick={() => exportSheet(displayedPurchases)}>
                            Export
                        </Button>
                    </Paper>
                </GridLegacy>

                {/* Not mount to display */}
                {displayedPurchases.length === 0 &&
                    <GridLegacy item xs={12}>
                        <EmptyState>
                            No sales registered for now.
                        </EmptyState>
                    </GridLegacy>
                }

                {displayedPurchases.length > 0 &&
                    <GridLegacy item xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: "0px" }} />
                                        <TableCell>
                                            Name
                                        </TableCell>
                                        <TableCell align="right">
                                            Level
                                        </TableCell>
                                        <TableCell align="right">
                                            Quantity
                                        </TableCell>
                                        <TableCell align="right">
                                            Price
                                        </TableCell>
                                        <TableCell align="right">
                                            Date
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedPurchases.map((sale) => (
                                        <TableRow
                                            key={sale.date}
                                            data-id={sale.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={`http://localhost:3960/images/items/${sale.iconId}`} alt={sale.name} />
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
                    </GridLegacy>
                }
            </GridLegacy>
        </Box>
    </Box>
}

export default Sales;