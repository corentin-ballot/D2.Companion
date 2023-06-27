import React, { useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, TextField, Grid, Typography, Button } from '@mui/material';

import Notifications from '../../app/notifications';

function Settings() {
    const [nativeNotifications, setNativeNotifications] = useState(JSON.parse(localStorage.getItem("notifications.native") || "true"));
    const [discordNotifications, setDiscordNotifications] = useState(JSON.parse(localStorage.getItem("notifications.discord.enable") || "true"));
    const [housesSellableNotifications, setHousesSellableNotifications] = useState(JSON.parse(localStorage.getItem("notifications.houses.sellable") || "true"));
    const [discordWebhook, setDiscordWebhook] = useState(JSON.parse(localStorage.getItem("notifications.discord.webhook") || "null"));
    // const [discordUsername, setDiscordUsername] = useState(JSON.parse(localStorage.getItem("notifications.discord.username") || "null"));

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem(event.target.id, JSON.stringify(event.target.type === "checkbox" ? event.target.checked : event.target.value));
        if (event.target.id === "notifications.native") setNativeNotifications(event.target.checked);
        if (event.target.id === "notifications.discord.enable") setDiscordNotifications(event.target.checked);
        if (event.target.id === "notifications.discord.webhook") setDiscordWebhook(event.target.value);
        if (event.target.id === "notifications.houses.sellable") setHousesSellableNotifications(event.target.value);
        // if (event.target.id === "notifications.discord.username") setDiscordUsername(event.target.value);
    }


    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h1">Notifications</Typography>

                <Paper sx={{ padding: (theme) => theme.spacing(1) }}>
                    <Typography variant="h2">Browser</Typography>

                    <FormControlLabel control={<Checkbox id="notifications.native" checked={nativeNotifications} onChange={handleInputChange} />} label="Enable browser notifications" />

                    <Button onClick={() => new Notifications("Test").sendNative()}>Test</Button>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ padding: (theme) => theme.spacing(1) }}>
                    <Typography variant="h2">Discord</Typography>

                    <FormControlLabel control={<Checkbox id="notifications.discord.enable" checked={discordNotifications} onChange={handleInputChange} />} label="Enable discord notifications" />

                    <TextField id="notifications.discord.webhook" variant="outlined" defaultValue={discordWebhook} onChange={handleInputChange} label="Discord webhook" />
                    <Button onClick={() => new Notifications("Test").sendNative()}>Test</Button>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ padding: (theme) => theme.spacing(1) }}>
                    <Typography variant="h2">Houses</Typography>

                    <FormControlLabel control={<Checkbox id="notifications.houses.sellable" checked={housesSellableNotifications} onChange={handleInputChange} />} label="Enable abandonned house sellable notification" />
                </Paper>
            </Grid>
        </Grid>
    </Box>
}

export default Settings;