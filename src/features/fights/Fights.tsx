import React, {useState, useEffect} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

import styles from './Fights.module.css';

import { useAppSelector } from '../../app/hooks';
import {
    selectCurrent,
    selectHistory,
    Dommage
} from './fightsSlice';
import DateTime from '../../components/dateTime/DateTime';

function Fight() {
    const [displayedFight, setDisplayedFight] = useState(useAppSelector(selectCurrent));

    const currentFight = useAppSelector(selectCurrent);
    const history = useAppSelector(selectHistory);

    useEffect(() => {
        setDisplayedFight(currentFight);
    }, [currentFight]);

    const data = displayedFight?.turnList.map(id => {
        const fighter = displayedFight.fighters.find(f => f.contextualId === id);
        return {
            name: fighter? fighter.name : id,
            ...displayedFight.dommages.filter(d => d.sourceId === id).reduce(
                (previousValue, currentValue: Dommage) => {
                    if(currentValue.loss) {
                        if(currentValue.elementId === 0) previousValue.neutre += currentValue.loss;
                        if(currentValue.elementId === 1) previousValue.terre += currentValue.loss;
                        if(currentValue.elementId === 2) previousValue.feu += currentValue.loss;
                        if(currentValue.elementId === 3) previousValue.eau += currentValue.loss;
                        if(currentValue.elementId === 4) previousValue.air += currentValue.loss;
                        if(currentValue.elementId === 9) previousValue.invoc += currentValue.loss;
                        if(currentValue.elementId === 4294967295) previousValue.pou += currentValue.loss;
                        
                        previousValue.total += currentValue.loss;
                    }
                    return previousValue;
                }, {neutre: 0, feu: 0, eau: 0, air: 0, terre: 0, pou: 0, invoc: 0, total: 0})
        }
    })

    return <div>
        <h1>Dofus fights.</h1>
        <div>
            <div className={styles.fightsHisotry}>
                <h2>Figths</h2>
                {currentFight && <button onClick={() => setDisplayedFight(currentFight)}>current</button>}
                {
                    history.length > 0 ?
                        <p>TODO: display history</p> : <p>Empty</p>
                    }
                    {history.map(f => <button key={f.startTime} onClick={() => setDisplayedFight(f)}><DateTime timestamp={f.startTime}/></button>)}
            </div>
            <div className={styles.selectedFightPanel}>
                    <BarChart
                        width={800}
                        height={300}
                        layout="vertical"
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis width={90} yAxisId={0} dataKey="name" type="category" axisLine={false} />
                        <YAxis width={90} yAxisId={1} dataKey="total" type="category" axisLine={false} orientation="right" mirror />
                        <XAxis hide type="number" />
                        <Tooltip itemStyle={{display: "inline-block", margin: "0 1rem"}} labelFormatter={() => ''} cursor={false} isAnimationActive={false} offset={0} separator="" formatter={(value: any, name: any, props: any) => [value, null]}/>
                        <Legend formatter={(value, entry, index) => value[0].toUpperCase() + value.slice(1)} />
                        {/* dmg deal */}
                        <Bar dataKey="neutre" stackId="a" fill="#bdc3c7 ">
                            <LabelList dataKey="neutre" position="center" formatter={(value: number) => value > 0 ? value : ''} />
                        </Bar>
                        <Bar dataKey="terre" stackId="a" fill="#e67e22">
                            <LabelList dataKey="terre" position="center" formatter={(value: number) => value > 0 ? value : ''} />
                        </Bar>
                        <Bar dataKey="feu" stackId="a" fill="#e74c3c">
                            <LabelList dataKey="feu" position="center" formatter={(value: number) => value > 0 ? value : ''} />
                        </Bar>
                        <Bar dataKey="eau" stackId="a" fill="#3498db">
                            <LabelList dataKey="eau" position="center" formatter={(value: number) => value > 0 ? value : ''} />
                        </Bar>
                        <Bar dataKey="air" stackId="a" fill="#2ecc71">
                            <LabelList dataKey="air" position="center" formatter={(value: number) => value > 0 ? value : ''} />
                        </Bar>
                        <Bar dataKey="invoc" stackId="a" fill="#f1c40f">
                            <LabelList dataKey="invoc" position="center" formatter={(value: number) => value > 0 ? value : ''} />
                        </Bar>
                        <Bar dataKey="pou" stackId="a" fill="#9b59b6">
                            <LabelList dataKey="pou" position="center" formatter={(value: number) => value > 0 ? value : ''} />
                        </Bar>
                    </BarChart>
            </div>
                {displayedFight && <div><pre>{JSON.stringify(displayedFight, null, 2) }</pre></div>}
        </div>
    </div>
}

export default Fight;