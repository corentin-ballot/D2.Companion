import React, {useEffect, useState} from 'react';
import styles from './Breeding.module.css';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectNotifications, selectPaddockedMounts, updateNotifications } from './breedingSlice';

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
    }, [paddockedMounts]);

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

    return <div className={styles.breeding}>
        <div className={styles.notifications}>
            {NOTIFICATION_KEYS.map(notification => <div key={notification.key} className={styles.notifications__item}>
                <h3 onClick={() => handleOrderChanged(notification.key as Order)}>{notification.name}</h3>
                <div className={styles.notifications__item__fields}>
                    <div className={styles.notifications__item__fields__field}>
                        {/* @ts-ignore */}
                        <input type="checkbox" id={notification.key + ".enable"} name={notification.key + ".enable"} checked={notifications[notification.key].enable} onChange={handleEnableChanged} />
                        <label htmlFor={notification.key + ".enable"}>Notification</label>
                    </div>
                    <div className={styles.notifications__item__fields__field}>
                        {/* @ts-ignore */}
                        <input type="number" name={notification.key + ".limit"} placeholder="Limit" defaultValue={notifications[notification.key].limit} disabled={!notifications[notification.key].enable} onChange={handleLimitChanged} />
                    </div>
                </div>
            </div>
            )}
        </div>

        {displayedMounts && displayedMounts.length > 0 &&
            <div className={styles.breeding__mounts}>
                {displayedMounts.map(mount =>
                    <div key={mount.id} className={styles.breeding__mount}>
                        <div className={styles.breeding__mount__name}>{Mounts?.find(m => mount.model === m._id)?.name}</div>

                        <div className={styles.breeding__content}>
                            <div className={styles.breeding__mount__overview}>
                                <div className={styles.breeding__mount__model}><img src={process.env.PUBLIC_URL + "/img/mounts/" + mount.model + ".png"} alt="" /></div>

                                <div className={styles.breeding__mount__details}>
                                    <div className={styles.breeding__mount__level}>{mount.level}</div>
                                    <div><img className={styles.breeding__mount__sex} src={process.env.PUBLIC_URL + "/img/pictos/" + (mount.sex ? "femelle" : "male") + ".png"} alt={mount.sex ? "femelle" : "male"} /></div>
                                    <div><img className={styles.breeding__mount__rideable} src={process.env.PUBLIC_URL + "/img/pictos/saddle.png"} data-rideable={mount.isRideable} alt={mount.isRideable ? "Rideable" : "not Rideable"}/></div>
                                    <div className={styles.breeding__mount__reproduction}>{mount.reproductionCount}/{mount.reproductionCountMax}</div>
                                </div>
                            </div>

                            <div className={styles.breeding__mount__stats}>
                                <div className={styles.breeding__mount__stat}>Energie: <Progress value={mount.energy} max={mount.energyMax} low={mount.energyMax / 2} high={mount.energyMax - 1} optimum={mount.energyMax} /></div>
                                <div className={styles.breeding__mount__stat}>Amour: <Progress value={mount.love} max={mount.loveMax} low={2500} high={mount.loveMax - 2500} optimum={mount.loveMax} /></div>
                                <div className={styles.breeding__mount__stat}>Maturité: <Progress value={mount.maturity} max={mount.maturityForAdult} low={mount.maturityForAdult / 2} high={mount.maturityForAdult - 1} optimum={mount.maturityForAdult} /></div>
                                <div className={styles.breeding__mount__stat}>Endurance: <Progress value={mount.stamina} max={mount.staminaMax} low={2500} high={mount.staminaMax - 2500} optimum={mount.staminaMax} /></div>
                                <div className={styles.breeding__mount__stat}>Fatigue: <Progress value={mount.boostLimiter} max={mount.boostMax} low={mount.boostMax - 0.1 * mount.boostMax} high={mount.boostMax / 2} optimum={0} /></div>
                                <div className={styles.breeding__mount__stat}>serenity: <div className={styles.breeding__mount__serenity__value}>{mount.serenity}</div></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        }

        {/* Not mount to display */}
        {displayedMounts.length === 0 &&
            <div className={styles.no_mount}>
                Go to the paddock to get mounts overview and notifications.
            </div>
        }
    </div>
}

export default Breeding;

function Progress(props: any) {
    return <div className={styles.progress}>
        <meter className={styles.progress__progressbar} min={props.min} max={props.max} low={props.low} high={props.high} optimum={props.optimum} value={props.value}></meter>
        {/* <progress value={props.value} max={props.max}>{props.value}</progress> */}
        <span className={styles.progress__label}>{props.value}</span>
    </div>
}