import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrent, selectHistory } from './fightsSlice';
import Grid from '@mui/material/Grid';


import RecievedDommagesPerRound from '../../components/fightGraphs/dommages/RecievedDommagesPerRound';
import DealedDommagesPerRound from '../../components/fightGraphs/dommages/DealedDommagesPerRound';
import TotalDommages from '../../components/fightGraphs/dommages/TotalDommages';
import DateTime from '../../components/dateTime/DateTime';

import styles from './Fights.module.css';

function Fight() {
    const [displayedFight, setDisplayedFight] = useState(useAppSelector(selectCurrent));
    const [fightersFilter, setFightersFilter] = useState(useAppSelector(selectCurrent).turnList);

    const currentFight = useAppSelector(selectCurrent);
    const history = useAppSelector(selectHistory);

    useEffect(() => {
        setDisplayedFight(currentFight);
    }, [currentFight]);

    useEffect(() => {
        setFightersFilter(displayedFight.turnList);
    }, [displayedFight]);

    useEffect(() => {
        setDisplayedFight({
            dommages: [
                { round: 1, sourceId: 1, targetId: 5, loss: 90, elementId: 0, actionId: 0, permanentDamages: 0 },
                { round: 2, sourceId: 1, targetId: 5, loss: 110, elementId: 0, actionId: 0, permanentDamages: 0 },
                { round: 3, sourceId: 1, targetId: 5, loss: 12, elementId: 2, actionId: 0, permanentDamages: 0 },
                { round: 4, sourceId: 1, targetId: 5, loss: 40, elementId: 4294967295, actionId: 0, permanentDamages: 0 },
                { round: 5, sourceId: 1, targetId: 5, loss: 150, elementId: 0, actionId: 0, permanentDamages: 0 },
                { round: 6, sourceId: 1, targetId: 5, loss: 27, elementId: 0, actionId: 0, permanentDamages: 0 },

                { round: 1, sourceId: 2, targetId: 5, loss: 18, elementId: 3, actionId: 0, permanentDamages: 0 },
                { round: 2, sourceId: 2, targetId: 5, loss: 300, elementId: 9, actionId: 0, permanentDamages: 0 },
                { round: 3, sourceId: 2, targetId: 5, loss: 250, elementId: 3, actionId: 0, permanentDamages: 0 },
                { round: 4, sourceId: 2, targetId: 5, loss: 12, elementId: 4, actionId: 0, permanentDamages: 0 },
                { round: 5, sourceId: 2, targetId: 5, loss: 300, elementId: 9, actionId: 0, permanentDamages: 0 },
                { round: 6, sourceId: 2, targetId: 5, loss: 330, elementId: 9, actionId: 0, permanentDamages: 0 },

                { round: 1, sourceId: 3, targetId: 5, loss: 300, elementId: 2, actionId: 0, permanentDamages: 0 },
                { round: 2, sourceId: 3, targetId: 5, loss: 50, elementId: 1, actionId: 0, permanentDamages: 0 },
                { round: 3, sourceId: 3, targetId: 5, loss: 200, elementId: 2, actionId: 0, permanentDamages: 0 },
                { round: 4, sourceId: 3, targetId: 5, loss: 20, elementId: 4294967295, actionId: 0, permanentDamages: 0 },
                { round: 5, sourceId: 3, targetId: 5, loss: 100, elementId: 2, actionId: 0, permanentDamages: 0 },
                { round: 6, sourceId: 3, targetId: 5, loss: 112, elementId: 2, actionId: 0, permanentDamages: 0 },

                { round: 1, sourceId: 5, targetId: 5, loss: 100, elementId: 0, actionId: 0, permanentDamages: 0 },
                { round: 2, sourceId: 5, targetId: 5, loss: 100, elementId: 1, actionId: 0, permanentDamages: 0 },
                { round: 3, sourceId: 5, targetId: 5, loss: 100, elementId: 2, actionId: 0, permanentDamages: 0 },
                { round: 4, sourceId: 5, targetId: 5, loss: 100, elementId: 3, actionId: 0, permanentDamages: 0 },
                { round: 5, sourceId: 5, targetId: 5, loss: 100, elementId: 4, actionId: 0, permanentDamages: 0 },
                { round: 6, sourceId: 5, targetId: 5, loss: 100, elementId: 4294967295, actionId: 0, permanentDamages: 0 },
            ],
            duration: 6,
            endTime: 0,
            fighters: [
                { contextualId: 1, creatureGenericId: 0, name: "Test01", breed: 6, sex: true, stats: { invisibilityState: 0, summoned: false, summoner: 0, characteristics: { characteristics: [{ characteristicId: 0, total: 0, additional: 0, alignGiftBonus: 0, base: 0, contextModif: 0, objectsAndMountBonus: 0 }] } } },
                { contextualId: 2, creatureGenericId: 0, name: "Test02", breed: 2, sex: false, stats: { invisibilityState: 0, summoned: false, summoner: 0, characteristics: { characteristics: [{ characteristicId: 0, total: 0, additional: 0, alignGiftBonus: 0, base: 0, contextModif: 0, objectsAndMountBonus: 0 }] } } },
                { contextualId: 3, creatureGenericId: 0, name: "Test03", breed: 14, sex: false, stats: { invisibilityState: 0, summoned: false, summoner: 0, characteristics: { characteristics: [{ characteristicId: 0, total: 0, additional: 0, alignGiftBonus: 0, base: 0, contextModif: 0, objectsAndMountBonus: 0 }] } } },
                { contextualId: 4, creatureGenericId: 0, name: "Test04", breed: 7, sex: true, stats: { invisibilityState: 0, summoned: false, summoner: 0, characteristics: { characteristics: [{ characteristicId: 0, total: 0, additional: 0, alignGiftBonus: 0, base: 0, contextModif: 0, objectsAndMountBonus: 0 }] } } },
                { contextualId: 5, creatureGenericId: 0, name: "Test05", breed: 1, sex: false, stats: { invisibilityState: 0, summoned: false, summoner: 0, characteristics: { characteristics: [{ characteristicId: 0, total: 0, additional: 0, alignGiftBonus: 0, base: 0, contextModif: 0, objectsAndMountBonus: 0 }] } } },
                { contextualId: 6, creatureGenericId: 494, name: "Poutch Master", stats: { invisibilityState: 0, summoned: false, summoner: 0, characteristics: { characteristics: [{ characteristicId: 0, total: 0, additional: 0, alignGiftBonus: 0, base: 0, contextModif: 0, objectsAndMountBonus: 0 }] } } },
            ],
            round: 6,
            startTime: 0,
            turnList: [1, 2, 3, 4, 5, 6]
        })
    }, []);

    return <div>
        <Grid container spacing={2}>
            {/* Side bar */}
            <Grid item xs={2}>
                <h1>Dofus fights</h1>
                <div className={styles.fightsHisotry}>
                    {currentFight.round > 0 && <button className={styles.fightsHisotry__item} onClick={() => setDisplayedFight(currentFight)}>Current fight</button>}
                    <hr />
                    <h2>History</h2>
                    {history.map(fight => <button className={styles.fightsHisotry__item} key={fight.startTime} onClick={() => setDisplayedFight(fight)}><DateTime timestamp={fight.startTime} /> {fight.fighters.filter(f => f.contextualId < 0 && !f.stats.summoned).map(f => f.name).join(", ")}</button>)}
                </div>
                <button className={styles.fightsHisotry__item} style={{ backgroundColor: "rgb(0, 127, 255)" }} onClick={async () => {
                    const fileName = "file";
                    const json = JSON.stringify(history);
                    const blob = new Blob([json], { type: 'application/json' });
                    const href = await URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = href;
                    link.target = "_blank"
                    link.download = fileName + ".json";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}>Save</button>
            </Grid>

            {/* Content */}
            {displayedFight.round > 0 &&
                <Grid item xs={10}>
                    <div className={styles.container}>
                        <Grid container spacing={2}>
                            {/* Fighters display filter */}
                            <Grid item xs={12}>
                                <form className={styles.fightersFilter}>
                                    {displayedFight.turnList.map(fighterId => {
                                        const fighter = displayedFight.fighters.find(f => f.contextualId === fighterId);
                                        return <label htmlFor={fighterId.toString()} className={styles.fightersFilter__item} data-checked={fightersFilter.includes(fighterId)}>
                                            <img src={fighter?.creatureGenericId ? `/img/monsters/${fighter?.creatureGenericId}` : `/img/classes/${fighter?.breed}-${fighter?.sex ? 'female' : 'male'}.png`} alt={fighter?.name} />
                                            <input type="checkbox" id={fighterId.toString()} checked={fightersFilter.includes(fighterId)} onChange={(e) => setFightersFilter(fightersFilter.includes(fighterId) ? fightersFilter.filter(f => f !== fighterId) : [...fightersFilter, fighterId])} />
                                            <span>{fighter?.name}</span>
                                        </label>
                                    })}
                                </form>
                            </Grid>

                            <Grid item xs={12}>
                                <a target="_blank" rel="noreferrer" href={`https://dofensive.com/fr/monster/${displayedFight.fighters.map(fighter => fighter.creatureGenericId).join(",")}`}>Voir les monstres sur Dofensive</a>
                            </Grid>



                            {/* Main Graph (dealed dommages with types) */}
                            <Grid item xs={12}>
                                <div className={styles.card}>
                                    <h2>Dommages dealed</h2>
                                    <TotalDommages fight={displayedFight} />
                                </div>
                            </Grid>

                            {/* Graph (dealed dommages per round) */}
                            <Grid item xs={12} md={6}>
                                <div className={styles.card}>
                                    <h2>Dommages dealed per round</h2>
                                    <DealedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                                </div>
                            </Grid>

                            {/* Graph (recieved dommages per round) */}
                            <Grid item xs={12} md={6}>
                                <div className={styles.card}>
                                    <h2>Dommages recieved per round</h2>
                                    <RecievedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            }
        </Grid>
    </div>
}

export default Fight;