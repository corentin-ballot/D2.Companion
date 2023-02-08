import React, { useState, MutableRefObject, useRef, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectItems } from './marketSlice';

import styles from './Market.module.css';
import { equipmentStats, statImage } from '../../app/equipmentStats';
import NumberFormat from '../../components/numberFormat/NumberFormat';

interface StatFilterObject {
    id: number;
    min: number;
}

function Market() {
    const items = useAppSelector(selectItems);
    const [displayedItems, setDisplayedItems] = useState([...items].sort((a, b) => a.prices[0] - b.prices[0]));
    const [statFilters, setStatFilters] = useState([] as StatFilterObject[]);

    useEffect(() => {
        setDisplayedItems([...items].sort((a, b) => a.prices[0] - b.prices[0]));
    }, [items]);

    const addStatFilter = (stat: StatFilterObject) => {
        setStatFilters([...statFilters, stat]);
    }

    const removeStatFilter = (stat: StatFilterObject) => {
        setStatFilters(statFilters.filter(s => s.id !== stat.id));
    }

    const currentStatIdRef: MutableRefObject<HTMLSelectElement | null> = useRef(null);
    const currentStatMinRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

    const handleAddCurrentStatClicked = () => {
        if (currentStatIdRef.current?.value && currentStatMinRef.current?.value) {
            addStatFilter({ id: Number(currentStatIdRef.current?.value), min: Number(currentStatMinRef.current?.value) });
        }
    }

    return <div>
        {/* Not item to display */}
        {displayedItems.length === 0 &&
            <div className={styles.no_items}>
                Go to the equipments shop to get advanced filters.
            </div>
        }

        {/* Items display */}
        {displayedItems && displayedItems.length > 0 &&
            <div className={styles.market}>
                {/* Default item */}
                <div className={styles.market__header}>
                    <h3>{displayedItems[0]?.name}</h3>

                    <div className={styles.market__header__item}>
                        <div className={styles.market__header__item__informations}>
                            <img src={process.env.PUBLIC_URL + displayedItems[0]?.imgUrl} alt="" />
                        </div>

                        <div className={styles.market__header__item__effects}>
                            {displayedItems[0] && displayedItems[0].possibleEffects.map(stat => {
                                const key = equipmentStats.get(stat.effectId);
                                return <Statistic id={stat.effectId} value={{ min: stat.diceNum, max: stat.diceSide }} key={key?.name} />
                            })}
                        </div>
                    </div>
                    <div className={styles.market__header__filter}>
                        <h4 className={styles.market__header__filter__title}>Filter items effects</h4>
                        <div className={styles.market__header__filter__add}>
                            <input type="number" placeholder="min" className={styles.market__header__filter__add__mininput} ref={currentStatMinRef} />
                            <select className={styles.market__header__filter__add__select} ref={currentStatIdRef}>
                                {Array.from(equipmentStats.keys()).filter(statId => !equipmentStats.get(statId)?.negative && statId && equipmentStats.get(statId)?.name).map(statId => <option key={statId} value={statId}>{equipmentStats.get(statId)?.name}</option>)}
                            </select>
                            <button className={styles.market__header__filter__add__btn} onClick={handleAddCurrentStatClicked}>Add</button>
                        </div>
                        <div className={styles.market__header__filter__effects}>
                            {statFilters.map(stat => <div key={stat.id} className={styles.market__header__filter__effects__effect}><Statistic id={stat.id} value={stat.min} key={stat.id} /><button className={styles.market__header__filter__effects__remove} onClick={() => removeStatFilter(stat)}>Remove</button></div>)}
                        </div>
                    </div>
                </div>

                {/* Item list */}
                <div className={styles.market__items}>
                    {displayedItems.filter(
                        item => item.effects.filter(
                            effect => statFilters.filter(
                                filter => effect.actionId === filter.id && effect.value >= filter.min
                            ).length
                        ).length === statFilters.length
                    )
                        .map(item => <div key={item.objectUID} className={styles.market__items__item}>
                            <div className={styles.market__items__item__effects}>
                                {item.effects.map(effect => <Statistic id={effect.actionId} value={effect.value} key={effect.actionId} />)}
                            </div>
                            <span className={styles.market__items__item__price}><NumberFormat value={item.prices[0]} /></span>
                        </div>)}
                </div>

                {/* {displayedItems && <div><pre>{JSON.stringify(displayedItems, null, 2) }</pre></div>} */}
            </div>
        }
    </div>
}

export default Market;

interface StatisticProps {
    id: number | string;
    value: number | string | { min: number, max: number };
}

function Statistic(props: StatisticProps) {
    const statistic = typeof props.id == "number" ? equipmentStats.get(props.id) : { name: props.id, negative: false, reverse: false };

    return <div className={styles.statistic} data-statid={props.id} key={props.id}>
        <img className={styles.statistic__image} src={process.env.PUBLIC_URL + statImage.get(statistic?.name)} alt="" />
        {statistic?.reverse && <span className={styles.statistic__details__name}>{statistic?.name}</span>}
        <div className={styles.statistic__details} data-negative={statistic?.negative}>
            {typeof props.value == "object" ?
                <span className={styles.statistic__details__value}>{`${props.value.min} ${props.value.max ? (' à ' + props.value.max) : ""}`}</span>
                : <span className={styles.statistic__details__value}>{statistic?.negative ? -props.value : props.value}</span>
            }
            {!statistic?.reverse && <span className={styles.statistic__details__name}>{statistic?.name}</span>}
        </div>
    </div>
}