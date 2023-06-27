import React, { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectNotifications, selectPaddockedMounts, updateNotifications } from './breedingSlice';
import { Tooltip, Box, Paper, FormControlLabel, Checkbox, TextField, Grid, Typography, Avatar, Badge } from '@mui/material';
import EmptyState from '../../components/empty-state/EmptyState';

let Mounts: any[];
fetch(process.env.PUBLIC_URL + '/data/mounts.json').then(res => res.json()).then(json => Mounts = json);

const NOTIFICATION_KEYS = [
    { name: "Sérénité", key: "serenity" },
    { name: "Fatigue", key: "boostLimiter" },
    { name: "Amour", key: "love" },
    { name: "Endurance", key: "stamina" },
    { name: "Maturité", key: "maturity" },
    { name: "Energie", key: "energy" },
]

type Order = "serenity" | "boostLimiter" | "love" | "stamina" | "maturity" | "energy";

function Breeding() {
    const dispatch = useAppDispatch();
    const paddockedMounts = useAppSelector(selectPaddockedMounts);
    const notifications = useAppSelector(selectNotifications);

    const [mountsOrder, setMountsOrder] = useState((localStorage.getItem("breeding.order") || "serenity") as Order);
    const [displayedMounts, setDisplayedMounts] = useState([...paddockedMounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));

    useEffect(() => {
        setDisplayedMounts([...paddockedMounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));
    }, [paddockedMounts, mountsOrder]);

    const handleOrderChanged = (order: Order) => {
        localStorage.setItem("breeding.order", order);
        setMountsOrder(order);
        setDisplayedMounts([...paddockedMounts].sort((a, b) => a[mountsOrder] - b[mountsOrder]));
    }

    const handleEnableChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetNotification = event.target.name.split(".")[0];
        // @ts-ignore
        dispatch(updateNotifications({ ...notifications, [targetNotification]: { ...notifications[targetNotification], enable: event.target.checked } }));
    }

    const handleLimitChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetNotification = event.target.name.split(".")[0];
        // @ts-ignore
        dispatch(updateNotifications({ ...notifications, [targetNotification]: { ...notifications[targetNotification], limit: event.target.value } }));
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ display: "flex", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                    {NOTIFICATION_KEYS.map(notification => <Box key={notification.key}>
                        <Typography variant="subtitle1" onClick={() => handleOrderChanged(notification.key as Order)}>{notification.name}</Typography>
                        <Box sx={{ display: "flex", marginRight: (theme) => theme.spacing(1) }}>
                            {/* @ts-ignore */}
                            <FormControlLabel label="Notification" control={<Checkbox id={notification.key + ".enable"} name={notification.key + ".enable"} checked={notifications[notification.key].enable} onChange={handleEnableChanged} />} />
                            {/* @ts-ignore */}
                            <TextField type="number" name={notification.key + ".limit"} label="Limit" variant="outlined" defaultValue={notifications[notification.key].limit} disabled={!notifications[notification.key].enable} onChange={handleLimitChanged} />
                        </Box>
                    </Box>
                    )}
                </Paper>
            </Grid>

            {displayedMounts && displayedMounts.length > 0 && displayedMounts.map(mount =>
                <Grid item xs={2} key={mount.id}>
                    <Paper sx={{ padding: (theme) => theme.spacing(1) }}>
                        <Typography variant="subtitle1" noWrap sx={{ textAlign: "center" }}>{Mounts?.find(m => mount.model === m._id)?.name}</Typography>

                        <Box>
                            <Box sx={{ display: "flex" }}>
                                <Avatar sx={{ margin: "auto", width: 100, height: 100 }} src={process.env.PUBLIC_URL + "/img/mounts/" + mount.model + ".png"} alt="" />

                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Box><Badge badgeContent={mount.level}><Avatar sx={{ width: 24, height: 24 }} alt="" src={process.env.PUBLIC_URL + "/img/pictos/lvl.png"} /></Badge></Box>
                                    <Box><Avatar sx={{ width: 24, height: 24 }} src={process.env.PUBLIC_URL + "/img/pictos/" + (mount.sex ? "femelle" : "male") + ".png"} alt={mount.sex ? "femelle" : "male"} /></Box>
                                    <Box><Avatar sx={{ width: 24, height: 24 }} src={process.env.PUBLIC_URL + "/img/pictos/saddle.png"} data-rideable={mount.isRideable} alt={mount.isRideable ? "Rideable" : "not Rideable"} /></Box>
                                    <Box><Badge badgeContent={<Avatar sx={{ width: 12, height: 12 }} alt="" src={process.env.PUBLIC_URL + "/img/pictos/egg.svg"} />}>{mount.reproductionCount}/{mount.reproductionCountMax}</Badge></Box>
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

function Progress(props: any) {
    return <Box>
        <Tooltip title={props.value} placement="right">
            <meter min={props.min} max={props.max} low={props.low} high={props.high} optimum={props.optimum} value={props.value}></meter>
        </Tooltip>
    </Box>
}