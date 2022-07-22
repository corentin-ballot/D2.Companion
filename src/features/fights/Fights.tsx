import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrent, selectHistory } from './fightsSlice';
import Grid from '@mui/material/Grid';


import RecievedDommagesPerRound from '../../components/fightGraphs/dommages/RecievedDommagesPerRound';
import DealedDommagesPerRound from '../../components/fightGraphs/dommages/DealedDommagesPerRound';
import TotalDommages from '../../components/fightGraphs/dommages/TotalDommages';
import DateTime from '../../components/dateTime/DateTime';

import styles from './Fights.module.css';
import SpellsLog from '../../components/fightGraphs/dommages/SpellsLog';
import TypeRepartition from '../../components/fightGraphs/dommages/TypeRepartition';

import sampleFight from '../../data/sample/fight.json';

function Fight() {
    const [displayedFight, setDisplayedFight] = useState(useAppSelector(selectCurrent));
    const [fightersFilter, setFightersFilter] = useState([useAppSelector(selectCurrent).turnList[0]]);

    const currentFight = useAppSelector(selectCurrent);
    const history = useAppSelector(selectHistory);

    useEffect(() => {
        setDisplayedFight(currentFight);
    }, [currentFight]);

    useEffect(() => {
        setFightersFilter([displayedFight.turnList[0]]);
    }, [currentFight]);

    useEffect(() => {
        // @ts-ignore
        setDisplayedFight(sampleFight)
    }, []);

    return <div>
        <Grid container spacing={2}>
            {/* Side bar */}
            {/* <Grid item xs={2}>
                <h1>Dofus fights</h1>
                <div className={styles.fightsHisotry}>
                    {currentFight.round > 0 && <button className={styles.fightsHisotry__item} onClick={() => setDisplayedFight(currentFight)}>Current fight</button>}
                    <hr />
                    <h2>
                        History
                        <button onClick={async () => {
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
                    </h2>
                    {history.map(fight => <button className={styles.fightsHisotry__item} key={fight.startTime} onClick={() => setDisplayedFight(fight)}><DateTime timestamp={fight.startTime} /> {fight.fighters.filter(f => f.contextualId < 0 && !f.stats.summoned).map(f => f.name).join(", ")}</button>)}
                </div>
            </Grid> */}

            {/* Content */}
            {displayedFight.round > 0 &&
                <Grid item xs={12}>
                    <div className={styles.container}>
                        <Grid container spacing={2}>
                            {/* Main Graph (dealed dommages with types) */}
                            <Grid item xs={12}>
                                <div className={styles.card}>
                                    <h2 className={styles.widget__title}>Dommages dealed</h2>
                                    <TotalDommages fight={displayedFight} />
                                </div>
                            </Grid>

                            {/* Dofensive */}
                            <Grid item xs={12}>
                                <a target="_blank" rel="noreferrer" href={`https://dofensive.com/fr/monster/${displayedFight.fighters.map(fighter => fighter.creatureGenericId).join(",")}`}>Voir les monstres sur Dofensive</a>
                            </Grid>

                            {/* Fighters display filter */}
                            <Grid item xs={12}>
                                <form className={styles.fightersFilter}>
                                    {displayedFight.turnList.map(fighterId => {
                                        const fighter = displayedFight.fighters.find(f => f.contextualId === fighterId);
                                        return <label key={fighterId} htmlFor={fighterId.toString()} className={styles.fightersFilter__item} data-checked={fightersFilter.includes(fighterId)}>
                                            <img src={
                                                fighter?.masterId ? "/img/monsters/394" :
                                                fighter?.creatureGenericId ? `/img/monsters/${fighter?.creatureGenericId}` : `/img/classes/${fighter?.breed}-${fighter?.sex ? 'female' : 'male'}.png`
                                                } alt={fighter?.name} />
                                            <input type="checkbox" id={fighterId.toString()} checked={fightersFilter.includes(fighterId)} onChange={(e) => setFightersFilter(fightersFilter.includes(fighterId) ? fightersFilter.filter(f => f !== fighterId) : [fighterId])} />
                                            <span>{fighter?.name}</span>
                                        </label>
                                    })}
                                </form>
                            </Grid>

                            {/* Graph (dealed dommages per round) */}
                            <Grid item xs={12} md={6}>
                                <div className={styles.card}>
                                    <h2 className={styles.widget__title}>Dommages dealed per round</h2>
                                    <DealedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                                </div>
                            </Grid>

                            {/* Graph (recieved dommages per round) */}
                            <Grid item xs={12} md={6}>
                                <div className={styles.card}>
                                    <h2 className={styles.widget__title}>Dommages recieved per round</h2>
                                    <RecievedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                                </div>
                            </Grid>

                            {/* Spells */}
                            <Grid item xs={12} md={6}>
                                <div className={styles.card}>
                                    <h2 className={styles.widget__title}>Spells</h2>
                                    <SpellsLog fight={displayedFight} fightersFilter={fightersFilter} />
                                </div>
                            </Grid>

                            {/* Type repartition */}
                            <Grid item xs={12} md={6}>
                                <div className={styles.card}>
                                    <h2 className={styles.widget__title}>Type repartition</h2>
                                    <TypeRepartition fight={displayedFight} fightersFilter={fightersFilter} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            }
            {/* {displayedFight && <div><pre>{JSON.stringify(displayedFight.spells, null, 2) }</pre></div>} */}
        </Grid>
        {/* {displayedFight && <div><pre>{JSON.stringify(displayedFight.fighters, null, 2) }</pre></div>} */}
    </div>
}

export default Fight;