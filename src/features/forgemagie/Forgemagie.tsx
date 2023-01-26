import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectItem } from './forgemagieSlice';

import styles from './Forgemagie.module.css';
import { equipmentStats, statImage } from '../../app/equipmentStats';
import { ObjectEffectInteger } from '../../app/dofusInterfaces';

function Forgemagie() {
    const item = useAppSelector(selectItem);

    const [equipment, setEquipment] = useState<any>(null);
    const [equipments, setEquipments] = useState<any[]>([]);
    
    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/equipments.json').then(res => res.json()).then(res => setEquipments(res));
        if(item) setEquipment(equipments.find(e => e._id === item.objectGID));
    }, []);

    useEffect(() => {
        if(item && equipments.length)  {
            const eq = equipments.find(e => e._id === item.objectGID);
            if(typeof eq !== "undefined") setEquipment(eq);
        }
    }, [item, equipments]);

    return <div>
    {/* Not item to display */}
    {item === null &&
        <div className={styles.no_items}>
            Go to the fm interface and select an item.
        </div>
    }

    {/* Not item to display */}
    {typeof equipment === "undefined" &&
        <div className={styles.no_items}>
            Equipment is undefined.
        </div>
    }

        {/* Items display */}
        {item !== null && equipment &&
            <div className={styles.market}>
                <div className={styles.market__header}>
                    <h3>{equipment.name}</h3>

                    <div className={styles.market__header__item}>
                        <div className={styles.market__header__item__informations}>
                            <img src={process.env.PUBLIC_URL + equipment.imgUrl} alt="" />
                        </div>

                        <div className={styles.market__header__item__effects}>
                            {equipment.statistics.map((stat: { [x: string]: { max: number; min: number; }; }) => {
                                const key = Object.keys(stat)[0];
                                const effect = item.effects.find(effect => equipmentStats.get(effect.actionId)?.name === key);

                                return <div className={styles.market__header__item__effect} key={key}>
                                    <Statistic id={key} value={{ min: stat[key].min, max: stat[key].max }} />
                                    <Progress min={stat[key].min} max={stat[key].max}  low={stat[key].min} high={stat[key].max} optimum={stat[key].max} value={effect ? effect.value : 0} />
                                </div>
                            })}
                        </div>
                    </div>

                    <div className={styles.market__header__pool}>
                        <span>{Math.floor(item.magicPool)}</span>
                    </div>
                </div>


                <div className={styles.market__history}>
                    {item.history.map((h, index) => <HistoryItem key={index} craftResult={h.craftResult} effects={h.objectInfo.effects} magicPoolStatus={h.magicPoolStatus} />)}
                </div>
            </div>
        }
    </div>
}

export default Forgemagie;

interface StatisticProps {
    id: number | string;
    value: number | string | { min: number, max: number };
}

function Statistic(props: StatisticProps) {
    const statistic = typeof props.id == "number" ? equipmentStats.get(props.id) : { name: props.id, negative: false };

    return <div className={styles.statistic} data-statid={props.id}>
        <img className={styles.statistic__image} src={process.env.PUBLIC_URL + statImage.get(statistic?.name)} alt="" />
        <div className={styles.statistic__details} data-negative={statistic?.negative}>
            {typeof props.value == "object" ?
                <span className={styles.statistic__details__value}>{`${props.value.min} ${props.value.max ? (' à ' + props.value.max) : ""}`}</span>
                : <span className={styles.statistic__details__value}>{statistic?.negative ? -props.value : props.value}</span>
            }
            <span className={styles.statistic__details__name}>{statistic?.name}</span>
        </div>
    </div>
}

function Progress(props: {min: number, max: number, low: number, high: number, optimum: number, value: number}) {
    return <div className={styles.progress}>
        <meter className={styles.progress__progressbar} min={props.min} max={props.max} low={props.low} high={props.high} optimum={props.optimum} value={props.value}></meter>
        {/* <progress value={props.value} max={props.max}>{props.value}</progress> */}
        <span className={styles.progress__label}>{props.value}</span>
    </div>
}

function HistoryItem (props: {effects: ObjectEffectInteger[], craftResult: number, magicPoolStatus: number}) {
    const reliquat = (props.effects.reduce((prev, curr) => {
        const stat = equipmentStats.get(curr.actionId);
        return prev + curr.value * (stat ? stat.density : 0);
    }, 0));

    console.log(props.effects);

    return <div className={styles.market__fmline} data-result={props.craftResult} data-reliquat={props.magicPoolStatus}>
        {props.effects.map(effect => <div key={effect.actionId} className={styles.market__fmline_effect}>{(effect.value > 0 ? `+${effect.value}` : `${effect.value}`) + ` ${equipmentStats.get(effect.actionId)?.name}`}</div>)}
        {props.magicPoolStatus === 2 && <div className={styles.market__fmline_reliquat}>+{reliquat} reliquat</div>}
        {props.magicPoolStatus === 3 && <div className={styles.market__fmline_reliquat}>{reliquat} reliquat</div>}
    </div>
}