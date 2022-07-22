import React from 'react';
import { fight } from '../../../features/fights/fightsSlice';

import styles from './SpellsLog.module.css';

interface DealedDommagesPerRoundProps {
    fight: fight;
    fightersFilter: number[];
}

function SpellsLog(props: DealedDommagesPerRoundProps) {

    return <div className={styles.log}>
        {props.fight.spells.map(spell => {
            const source = props.fight.fighters.find(f => f.contextualId === spell.sourceId)?.name;
            const target = props.fight.fighters.find(f => f.contextualId === spell.targetId)?.name;
        
        return <div className={styles.log__message}>
            <span className={styles.log__message__source}>{source}</span> lance <span className={styles.log__message__spell}>{spell.name}</span><span className={styles.log__message__critique}>{spell.critical > 1 ? " (Critique)" : ""}</span>{ spell.targetId !== 0 && source !== target && " sur "}{ spell.targetId !== 0 && source !== target && <span className={styles.log__message__target}>{target}</span>}.
        </div>})}
    </div>
}

export default SpellsLog;