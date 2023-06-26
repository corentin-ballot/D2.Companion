import React, { MutableRefObject, useEffect, useRef, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    Notification,
    Redirection,
    selectNotifications,
    selectRedirections,
    updateNotifications,
    updateRedirections
} from './chatSlice';

import { Typography, Box, Paper, TextField, Button, MenuItem, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EmptyState from '../../components/empty-state/EmptyState';

interface DataObject {
    id: number;
    name: string;
}

const data = { monsters: [] as DataObject[], weapons: [] as DataObject[], equipments: [] as DataObject[], achievements: [] as DataObject[], others: [] as DataObject[] }
const MAX_AUTO_COMPLETE_RESULT = 10;

function Chat() {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectNotifications);
    const redirections = useAppSelector(selectRedirections);
    const inputNotificationRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const inputWebhookRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const inputChannelRef: MutableRefObject<HTMLSelectElement | null> = useRef(null);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/monsters.json').then(res => res.json()).then((res: { Id: number, Name: string }[]) => data.monsters = res.map(r => ({ id: r.Id, name: r.Name })));
        fetch(process.env.PUBLIC_URL + '/data/weapons.json').then(res => res.json()).then((res: { _id: number, name: string }[]) => data.weapons = res.map(r => ({ id: r._id, name: r.name })));
        fetch(process.env.PUBLIC_URL + '/data/equipments.json').then(res => res.json()).then((res: { _id: number, name: string }[]) => data.equipments = res.map(r => ({ id: r._id, name: r.name })));
        fetch(process.env.PUBLIC_URL + '/data/achievements.json').then(res => res.json()).then((res: { id: number, name: any }[]) => data.achievements = res.map(r => ({ id: r.id, name: r.name.fr })));
    }, []);

    const scopes = ["monsters", "equipments", "weapons", "achievements", "others"] as const;
    const [selectedScope, setSelectedScope] = useState(scopes[0] as typeof scopes[number]);
    const [autoCompleteResult, setAutoCompleteResult] = useState([] as any[]);
    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedScope(event.target.value as typeof scopes[number]);
        setAutoCompleteResult(data[event.target.value as typeof scopes[number]]);
    }

    const handlerInputChange = (event: React.SyntheticEvent, value: { id: string, name: string }, reason: string) => {
        if (reason === "selectOption") {
            if (inputNotificationRef.current) {
                inputNotificationRef.current.setAttribute("data-id", value.id);
            };
        }
    }

    const handleRemoveNotificationClicked = (notification: Notification) => {
        const ns = notifications.filter(n => n.label !== notification.label);
        dispatch(updateNotifications(ns));
    }

    const handleAddNotificationClicked = () => {
        if (inputNotificationRef.current) {
            const n = { label: inputNotificationRef.current.value, matches: [inputNotificationRef.current.value.toLocaleLowerCase()] };
            if (inputNotificationRef.current.hasAttribute("data-id")) {
                if (selectedScope === "monsters") {
                    n.matches.push(`{chatmonster,${inputNotificationRef.current.getAttribute("data-id")}}`);
                } else if (selectedScope === "achievements") {
                    n.matches.push(`{chatachievement,${inputNotificationRef.current.getAttribute("data-id")}}`);
                } else {
                    n.matches.push(`${inputNotificationRef.current.getAttribute("data-id")}`);
                }
            }
            const ns = [...notifications, n];
            dispatch(updateNotifications(ns));
        }
    }

    const handleRemoveRedirectionClicked = (redirection: Redirection) => {
        const rs = redirections.filter(r => r.channel !== redirection.channel && r.webhook !== redirection.webhook);
        dispatch(updateRedirections(rs));
    }

    const handleAddRedirectionClicked = () => {
        if (inputWebhookRef.current && inputChannelRef.current) {
            const r: Redirection = { channel: Number.parseInt(inputChannelRef.current.value), webhook: inputWebhookRef.current.value };
            const rs = [...redirections, r];
            dispatch(updateRedirections(rs));
        }
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ padding: (theme) => theme.spacing(1), marginBottom: (theme) => theme.spacing(2) }}>
            <Typography variant="h6" sx={{ marginBottom: (theme) => theme.spacing(1) }}>Notifications</Typography>
            <Box component="form" sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2), marginBottom: (theme) => theme.spacing(1) }}>
                <TextField
                    id="scope-select"
                    label="Scope"
                    select
                    value={selectedScope}
                    onChange={handleSelectChange}
                    sx={{ minWidth: 200 }}
                >
                    {scopes.map(scope => <MenuItem key={scope} value={scope}>{scope.charAt(0).toLocaleUpperCase() + scope.substr(1).replaceAll("_", " ")}</MenuItem>)}
                </TextField>

                <Autocomplete
                    disablePortal
                    id="scope-autocomplete"
                    options={autoCompleteResult}
                    getOptionLabel={(option) => option.name}
                    sx={{ minWidth: 200 }}
                    onChange={handlerInputChange}
                    renderInput={(params) => <TextField
                        {...params}
                        id="scope-value"
                        label={selectedScope}
                        inputRef={inputNotificationRef}
                    />}
                />


                <Button onClick={handleAddNotificationClicked} variant="contained">Add notification</Button>
            </Box>

            {/* No chat notification to display */}
            {notifications.length === 0 &&
                <EmptyState>
                    Add some things to get notified if it's mentionned in chat.
                </EmptyState>
            }

            {notifications.length > 0 && <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Label</TableCell>
                            <TableCell>Matches</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications.map((notification, index) =>
                            <TableRow
                                key={notification.label + "-" + index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{notification.label}</TableCell>
                                <TableCell>{notification.matches.join(", ")}</TableCell>
                                <TableCell><Button onClick={() => handleRemoveNotificationClicked(notification)}>Remove</Button></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>}
            {/* {<div><pre>Notifications : {JSON.stringify(notifications, null, 2) }</pre></div>} */}
        </Paper>

        <Paper sx={{ padding: (theme) => theme.spacing(1), marginBottom: (theme) => theme.spacing(2) }}>
            <Typography variant="h6" sx={{ marginBottom: (theme) => theme.spacing(1) }}>Redirection</Typography>
            <Box component="form" sx={{ display: "flex", alignItems: "center", gap: (theme) => theme.spacing(2), marginBottom: (theme) => theme.spacing(1) }}>
                <TextField
                    id="channel-select"
                    label="Channel"
                    select
                    inputRef={inputChannelRef}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem key={2} value={2}>Guilde</MenuItem>
                    <MenuItem key={6} value={6}>Recrutement</MenuItem>
                </TextField>

                <TextField
                    id="webhook-value"
                    label="Discord webhook"
                    inputRef={inputWebhookRef}
                />

                <Button onClick={handleAddRedirectionClicked} variant="contained">Add redirection</Button>
            </Box>

            {/* No chat notification to display */}
            {redirections.length === 0 &&
                <EmptyState>
                    Add some things to get your chat redirected in Discord.
                </EmptyState>
            }

            {redirections.length > 0 && <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Channel</TableCell>
                            <TableCell>Discord webhook</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {redirections.map((redirection, index) =>
                            <TableRow
                                key={redirection.channel + "-" + redirection.webhook}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{redirection.channel}</TableCell>
                                <TableCell>{redirection.webhook}</TableCell>
                                <TableCell><Button onClick={() => handleRemoveRedirectionClicked(redirection)}>Remove</Button></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>}
        </Paper>
        {/* {<div><pre>Notifications : {JSON.stringify(notifications, null, 2) }</pre></div>} */}
    </Box>
}

export default Chat;