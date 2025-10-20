import React, { MutableRefObject, useRef, useState } from 'react';
import { Typography, Box, Paper, TextField, Button, MenuItem, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EmptyState from '../../components/EmptyState';
import { Notification, Redirection, useChatServer, useChatServerDispatch } from '../../providers/sockets/ChatServerContext';
import useDofusMonsters from '../../hooks/dofus-data/.useDofusMonsters';
import useDofusAchievements from '../../hooks/dofus-data/.useDofusAchievements';
import useDofusItems from '../../hooks/dofus-data/.useDofusItems';

const MAX_AUTOCOMPLETE = 20;

const ChatServers = () => {
    const dispatchChatServer = useChatServerDispatch();
    const { notifications, redirections } = useChatServer()
    const inputNotificationRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const inputWebhookRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const inputChannelRef: MutableRefObject<HTMLSelectElement | null> = useRef(null);

    const monsters = useDofusMonsters().data
    const achievements = useDofusAchievements().data
    const items = useDofusItems().data

    const scopes = new Map<string, {id: number, name: string}[] | undefined>([
        ["text", []],
        ["monsters", monsters],
        ["items", items],
        ["achievements", achievements],
    ])

    // const scopes = ["monsters", "items", "achievements", "others"] as const;
    const [selectedScope, setSelectedScope] = useState("text");
    const [autoCompleteOptions, setautoCompleteOptions] = useState([] as {id: number, name: string}[]);

    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedScope(event.target.value);
        setautoCompleteOptions((scopes.get(event.target.value) ?? []).filter((d,i) => i < MAX_AUTOCOMPLETE));
    }

    const handlerInputChange = (event: React.SyntheticEvent, value: { id: number, name: string } | null, reason: string) => {
        if (reason === "selectOption") {
            if (inputNotificationRef.current) {
                inputNotificationRef.current.setAttribute("data-id", `${value?.id}`);
            };
        }
    }

    const handlerInputValueChange = (event: React.SyntheticEvent, value: string) => {
        setautoCompleteOptions((scopes.get(selectedScope) ?? []).filter((d) => d.name && d.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())).filter((d,i) => i < MAX_AUTOCOMPLETE));
    }

    const handleRemoveNotificationClicked = (notification: Notification) => {
        dispatchChatServer({type: 'remove_notification', notification });
    }

    const handleAddNotificationClicked = () => {
        if (inputNotificationRef.current) {
            const n = { id: Math.random().toString(8).slice(2), label: inputNotificationRef.current.value, matches: [inputNotificationRef.current.value.toLocaleLowerCase()] };
            if (inputNotificationRef.current.hasAttribute("data-id")) {
                if (selectedScope === "monsters") {
                    n.matches.push(`{chatmonster,${inputNotificationRef.current.getAttribute("data-id")}}`);
                } else if (selectedScope === "achievements") {
                    n.matches.push(`{chatachievement,${inputNotificationRef.current.getAttribute("data-id")}}`);
                } else if (selectedScope === "items") {
                    n.matches.push(`${inputNotificationRef.current.getAttribute("data-id")}`);
                }
            }
            
            dispatchChatServer({type: 'add_notification', notification: n });
        }
    }

    const handleRemoveRedirectionClicked = (redirection: Redirection) => {
        dispatchChatServer({type: 'remove_redirection', redirection });
    }

    const handleAddRedirectionClicked = () => {
        if (inputWebhookRef.current && inputChannelRef.current) {
            dispatchChatServer({type: 'add_redirection', redirection: {
              id: Math.random().toString(8).slice(2),
              channel: inputChannelRef.current.value,
              webhook: inputWebhookRef.current.value }
            });
        }
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ padding: "16px", marginBottom: "32px" }}>
            <Typography variant="h2" sx={{ marginBottom: "16px" }}>Notifications</Typography>
            <Box component="form" sx={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "16px" }}>
                <TextField
                    id="scope-select"
                    label="Scope"
                    select
                    value={selectedScope}
                    onChange={handleSelectChange}
                    sx={{ minWidth: 200 }}
                >
                    {Array.from(scopes.keys()).map(scope => <MenuItem key={scope} value={scope}>{scope.charAt(0).toLocaleUpperCase() + scope.substr(1).replaceAll("_", " ")}</MenuItem>)}
                </TextField>

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
                        label={selectedScope}
                        inputRef={inputNotificationRef}
                    />}
                />


                <Button onClick={handleAddNotificationClicked} variant="contained">Add notification</Button>
            </Box>

            {/* No chat notification to display */}
            {notifications.length === 0 &&
                <EmptyState>
                    Add some things to get notified if it&apos;s mentionned in chat.
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
                        {notifications.map((notification) =>
                            <TableRow
                                key={notification.id}
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

        <Paper sx={{ padding: "16px", marginBottom: "32px" }}>
            <Typography variant="h2" sx={{ marginBottom: "16px" }}>Redirection</Typography>
            <Box component="form" sx={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "16px" }}>
                <TextField
                    id="channel-select"
                    label="Channel"
                    select
                    inputRef={inputChannelRef}
                    sx={{ minWidth: 200 }}
                    defaultValue="GUILD"
                >
                    <MenuItem key={0} value='GLOBAL'>Global</MenuItem>
                    <MenuItem key={1} value='TEAM'>Equipe</MenuItem>
                    <MenuItem key={2} value='GUILD' selected>Guilde</MenuItem>
                    <MenuItem key={3} value='ALLIANCE'>Alliance</MenuItem>
                    <MenuItem key={4} value='PARTY'>Groupe</MenuItem>
                    <MenuItem key={5} value='SALES'>Commerce</MenuItem>
                    <MenuItem key={6} value='SEEK'>Recrutement</MenuItem>
                    <MenuItem key={7} value='NOOB'>Noob</MenuItem>
                    <MenuItem key={8} value='ADMIN'>Admin</MenuItem>
                    <MenuItem key={9} value='PRIVATE'>Privé</MenuItem>
                    <MenuItem key={10} value='INFO'>Info</MenuItem>
                    <MenuItem key={11} value='FIGHT_LOG'>Fight log</MenuItem>
                    <MenuItem key={12} value='ADS'>Pub</MenuItem>
                    <MenuItem key={13} value='ARENA'>Arène</MenuItem>
                    <MenuItem key={14} value='EVENT'>Event</MenuItem>
                    <MenuItem key={14} value='EXCHANGE'>Exchange</MenuItem>
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
                        {redirections.map((redirection) =>
                            <TableRow
                                key={`${redirection.channel  }-${  redirection.webhook}`}
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

export default ChatServers;