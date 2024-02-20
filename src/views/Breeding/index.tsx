import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, TextField, Grid, Typography, Avatar, Badge } from '@mui/material';

import EmptyState from '../../components/EmptyState';
import Progress from '../../components/Progress';
import useDofusMounts from '../../hooks/dofus-data/useDofusMounts';
import { usePaddock, usePaddockDispatch } from '../../providers/sockets/PaddockContext';





const NOTIFICATION_KEYS = [
    { name: "Sérénité", key: "serenity" },
    { name: "Fatigue", key: "boostLimiter" },
    { name: "Amour", key: "love" },
    { name: "Endurance", key: "stamina" },
    { name: "Maturité", key: "maturity" },
    { name: "Energie", key: "energy" },
]

type Order = "serenity" | "boostLimiter" | "love" | "stamina" | "maturity" | "energy";

const Breeding = () => {
    const mounts = useDofusMounts().data;
    const paddock = usePaddock()
    const dispatchPaddock = usePaddockDispatch();

    const [mountsOrder, setMountsOrder] = useState((localStorage.getItem("Breeding.order") || "serenity") as Order);
    const [displayedMounts, setDisplayedMounts] = useState([...paddock.mounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));

    useEffect(() => {
        setDisplayedMounts([...paddock.mounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));
    }, [paddock.mounts, mountsOrder]);

    const handleOrderChanged = (order: Order) => {
        localStorage.setItem("Breeding.order", order);
        setMountsOrder(order);
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
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
            </Grid>

            {displayedMounts && displayedMounts.length > 0 && displayedMounts.map(mount =>
                <Grid item xs={2} key={mount.id}>
                    <Paper sx={{ padding: 1 }}>
                        <Typography variant="subtitle1" noWrap sx={{ textAlign: "center" }}>{mounts?.find(m => mount.model === m.id)?.name}</Typography>

                        <Box>
                            <Box sx={{ display: "flex" }}>
                                <Avatar sx={{ margin: "auto", width: 100, height: 100 }} src={`http://localhost:3980/img/mounts/${mount.model}`} alt="" />

                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Box><Badge badgeContent={mount.level}><Avatar sx={{ width: 24, height: 24 }} alt="" src={`${process.env.PUBLIC_URL  }/img/pictos/lvl.png`} /></Badge></Box>
                                    <Box><Avatar sx={{ width: 24, height: 24 }} src={`${process.env.PUBLIC_URL  }/img/pictos/${  mount.sex ? "femelle" : "male"  }.png`} alt={mount.sex ? "femelle" : "male"} /></Box>
                                    <Box><Avatar sx={{ width: 24, height: 24 }} src={`${process.env.PUBLIC_URL  }/img/pictos/saddle.png`} data-rideable={mount.isRideable} alt={mount.isRideable ? "Rideable" : "not Rideable"} /></Box>
                                    <Box><Badge badgeContent={<Avatar sx={{ width: 12, height: 12 }} alt="" src={`${process.env.PUBLIC_URL  }/img/pictos/egg.svg`} />}>{mount.reproductionCount}/{mount.reproductionCountMax}</Badge></Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Energie: <Progress value={mount.energy} max={mount.energyMax} low={mount.energyMax / 2} high={mount.energyMax - 1} optimum={mount.energyMax} /> </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Amour: <Progress value={mount.love} max={mount.loveMax} low={2500} high={mount.loveMax - 2500} optimum={mount.loveMax} /> </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Maturité: <Progress value={mount.maturity} max={mount.maturityForAdult} low={mount.maturityForAdult / 2} high={mount.maturityForAdult - 1} optimum={mount.maturityForAdult} /> </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Endurance: <Progress value={mount.stamina} max={mount.staminaMax} low={2500} high={mount.staminaMax - 2500} optimum={mount.staminaMax} /> </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Fatigue: <Progress value={mount.boostLimiter} max={mount.boostMax} low={mount.boostMax - 0.1 * mount.boostMax} high={mount.boostMax / 2} optimum={0} /> </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>serenity: <Box>{mount.serenity}</Box></Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            )}

            {/* Not mount to display */}
            {displayedMounts.length === 0 &&
                <Grid item xs={12}>
                    <EmptyState>
                        Go to the paddock to get mounts overview and notifications.
                    </EmptyState>
                </Grid>
            }
        </Grid>
    </Box>
}

export default Breeding;