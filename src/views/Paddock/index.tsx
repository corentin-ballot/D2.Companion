import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, TextField, GridLegacy, Typography } from '@mui/material';

import EmptyState from '../../components/EmptyState';
import { usePaddock, usePaddockDispatch } from '../../providers/sockets/PaddockContext';
import Mount from '../../components/Mount';

const NOTIFICATION_KEYS = [
    { name: "Sérénité", key: "serenity" },
    { name: "Fatigue", key: "boostLimiter" },
    { name: "Amour", key: "love" },
    { name: "Endurance", key: "stamina" },
    { name: "Maturité", key: "maturity" },
    { name: "Energie", key: "energy" },
]

type Order = "serenity" | "boostLimiter" | "love" | "stamina" | "maturity" | "energy";

const Paddock = () => {
    const paddock = usePaddock()
    const dispatchPaddock = usePaddockDispatch();

    const [mountsOrder, setMountsOrder] = useState((localStorage.getItem("Paddock.order") || "serenity") as Order);
    // @ts-ignore
    const [displayedMounts, setDisplayedMounts] = useState([...paddock.mounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));

    useEffect(() => {
        // @ts-ignore
        setDisplayedMounts([...paddock.mounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));
    }, [paddock.mounts, mountsOrder]);

    const handleOrderChanged = (order: Order) => {
        localStorage.setItem("Paddock.order", order);
        setMountsOrder(order);
        // @ts-ignore
        setDisplayedMounts([...paddock.mounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));
    }

    const handleEnableChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetNotification = event.target.name.split(".")[0];
        // @ts-ignore
        dispatchPaddock({type: 'notifications_changed', payload: { ...paddock.notifications, [targetNotification]: { ...paddock.notifications[targetNotification], enable: event.target.checked } }});
    }

    const handleLimitChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetNotification = event.target.name.split(".")[0];
        // @ts-ignore
        dispatchPaddock({type: 'notifications_changed', payload: { ...paddock.notifications, [targetNotification]: { ...paddock.notifications[targetNotification], limit: event.target.value } }});
    }

    return <Box sx={{ flexGrow: 1 }}>
        <GridLegacy container spacing={2}>
            <GridLegacy item xs={12}>
                <Paper sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}>
                    {NOTIFICATION_KEYS.map(notification => <Box key={notification.key}>
                        <Typography variant="subtitle1" onClick={() => handleOrderChanged(notification.key as Order)}>{notification.name}</Typography>
                        <Box sx={{ display: "flex", marginRight: 1 }}>
                            {/* @ts-ignore */}
                            <FormControlLabel label="Notification" control={<Checkbox id={`${notification.key  }.enable`} name={`${notification.key  }.enable`} checked={paddock.notifications[notification.key].enable} onChange={handleEnableChanged} />} />
                            {/* @ts-ignore */}
                            <TextField type="number" name={`${notification.key  }.limit`} label="Limit" variant="outlined" defaultValue={paddock.notifications[notification.key].limit} disabled={!paddock.notifications[notification.key].enable} onChange={handleLimitChanged} />
                        </Box>
                    </Box>
                    )}
                </Paper>
            </GridLegacy>

            {displayedMounts && displayedMounts.length > 0 && displayedMounts.map(mount =>
                <GridLegacy item xs={2} key={mount.id}>
                    <Mount mount={mount} />
                </GridLegacy>
            )}

            {/* Not mount to display */}
            {displayedMounts.length === 0 &&
                <GridLegacy item xs={12}>
                    <EmptyState>
                        Go to the paddock to get mounts overview and notifications.
                    </EmptyState>
                </GridLegacy>
            }     
        </GridLegacy>

        {displayedMounts && displayedMounts.length > 0 && 
            <Typography sx={{textAlign: "right"}}>{displayedMounts.length} mounts</Typography>
        }  
    </Box>
}

export default Paddock;