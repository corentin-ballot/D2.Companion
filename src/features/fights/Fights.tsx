import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrent, selectHistory } from './fightsSlice';

import DateTime from '../../components/dateTime/DateTime';
import RecievedDommagesPerRound from '../../components/fightGraphs/dommages/RecievedDommagesPerRound';
import DealedDommagesPerRound from '../../components/fightGraphs/dommages/DealedDommagesPerRound';
import TotalDommages from '../../components/fightGraphs/dommages/TotalDommages';
import SpellsLog from '../../components/fightGraphs/dommages/SpellsLog';
import TypeRepartition from '../../components/fightGraphs/dommages/TypeRepartition';

import sampleFight from '../../data/sample/fight.json';
import styles from './Fights.module.css';

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
        {/* Content */}
        {displayedFight.round > 0 &&
            <div className={styles.fight}>
                {/* Main Graph (dealed dommages with types) */}
                <div className={[styles.fight__card, styles.fight__card_highlight].join(" ")}>
                    <div className={styles.fight__card__header}>
                        <h3 className={styles.fight__card__header__title}>Dommages dealed</h3>
                        {/* Dofensive */}
                        <a className={styles.fight__card__header__link} target="_blank" rel="noreferrer" href={`https://dofensive.com/fr/monster/${displayedFight.fighters.map(fighter => fighter.creatureGenericId).join(",")}`}>Voir les monstres sur Dofensive</a>
                    </div>
                    <TotalDommages fight={displayedFight} />
                </div>

                {/* Fighters display filter */}
                <form className={styles.fight__fighters}>
                    {displayedFight.turnList.map(fighterId => {
                        const fighter = displayedFight.fighters.find(f => f.contextualId === fighterId);
                        return <label key={fighterId} htmlFor={fighterId.toString()} className={styles.fight__fighters__item} data-checked={fightersFilter.includes(fighterId)}>
                            <img src={
                                process.env.PUBLIC_URL + (fighter?.masterId ? "/img/monsters/394" :
                                    fighter?.creatureGenericId ? `/img/monsters/${fighter?.creatureGenericId}` : `/img/classes/${fighter?.breed}-${fighter?.sex ? 'female' : 'male'}.png`)
                            } alt={fighter?.name} />
                            <input type="checkbox" id={fighterId.toString()} checked={fightersFilter.includes(fighterId)} onChange={(e) => setFightersFilter(fightersFilter.includes(fighterId) ? fightersFilter.filter(f => f !== fighterId) : [fighterId])} />
                            <span>{fighter?.name}</span>
                        </label>
                    })}
                </form>

                {/* Graph (dealed dommages per round) */}
                <div className={styles.fight__card}>
                    <div className={styles.fight__card__header}>
                        <h3 className={styles.fight__card__header__title}>Dommages dealed per round</h3>
                    </div>
                    <DealedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                </div>

                {/* Graph (recieved dommages per round) */}
                <div className={styles.fight__card}>
                    <div className={styles.fight__card__header}>
                        <h3 className={styles.fight__card__header__title}>Dommages recieved per round</h3>
                    </div>
                    <RecievedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                </div>

                {/* Spells */}
                <div className={styles.fight__card}>
                    <div className={styles.fight__card__header}>
                        <h3 className={styles.fight__card__header__title}>Spells</h3>
                    </div>
                    <SpellsLog fight={displayedFight} fightersFilter={fightersFilter} />
                </div>

                {/* Type repartition */}
                <div className={styles.fight__card}>
                    <div className={styles.fight__card__header}>
                        <h3 className={styles.fight__card__header__title}>Type repartition</h3>
                    </div>
                    <TypeRepartition fight={displayedFight} fightersFilter={fightersFilter} />
                </div>
            </div>
        }

        {/* History */}
        <div className={[styles.fight__card, styles.fight__card_highlight].join(" ")}>
            <div className={styles.fight__card__header}>
                <h3 className={styles.fight__card__header__title}>History</h3>
                <div>
                    {currentFight.round > 0 && <button className={styles.fightsHisotry__item} onClick={() => setDisplayedFight(currentFight)}>Current fight</button>}
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
                </div>
            </div>

            <div className={styles.fight__hisotry__items}>
                {history.map(fight => 
                    <button 
                        className={styles.fight__hisotry__item} 
                        key={fight.startTime} 
                        onClick={() => setDisplayedFight(fight)}>
                            <img className={styles.fight__hisotry__item__image} src={process.env.PUBLIC_URL + "/img/monsters/" + fight.fighters.find(f => f.contextualId < 0 && !f.stats.summoned)?.creatureGenericId}/>
                            <div className={styles.fight__hisotry__item__content}>
                                <div className={styles.fight__hisotry__item__content__time}><DateTime timestamp={fight.startTime} /></div>
                                <div className={styles.fight__hisotry__item__content__fighters}>
                                    {fight.fighters.filter(f => f.contextualId < 0 && !f.stats.summoned).map(f =>    
                                        <div className={styles.fight__hisotry__item__content__fighter} key={f.contextualId}>{f.name}</div>)}
                                </div>
                            </div>
                    </button>
                )}
            </div>
        </div>
        {/* {displayedFight && <div><pre>{JSON.stringify(displayedFight.fighters, null, 2) }</pre></div>} */}
    </div>
}

export default Fight;