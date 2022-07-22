import React from 'react';
import {
    BarChart,
    Bar,
    LabelList,
    XAxis, 
    YAxis,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Props } from 'recharts/types/cartesian/Bar';
import { Dommage, fight } from '../../../features/fights/fightsSlice';

interface DommagesProps {
    fight: fight;
}

const teamColor = ["#650505", "#09325E"]

function TotalDommages(props: DommagesProps) {

    const data = props.fight?.turnList.map(id => {
        const fighter = props.fight.fighters.find(f => f.contextualId === id);
        return {
            name: fighter ? fighter.name : id,
            teamId: fighter?.spawnInfo.teamId,
            ...props.fight.dommages.filter(d => d.sourceId === id).reduce(
                (previousValue, currentValue: Dommage) => {
                    if (currentValue.loss) {
                        previousValue.total += currentValue.loss;
                    }
                    return previousValue;
                }, { neutre: 0, feu: 0, eau: 0, air: 0, terre: 0, pou: 0, invoc: 0, total: 0 })
        }
    }).sort((a,b) => b.total - a.total);

    const sum = data.reduce((p, c ) => p + c.total, 0);

    return <div>
        <ResponsiveContainer width="100%" height={60 * props.fight.turnList.length}>
            <BarChart width={800} height={500} layout="vertical" data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis hide type="number" />
                {/* dmg deal */}
                <Bar barSize={50} dataKey="total" stackId="a" fill="#9029ab">
                    <LabelList position="center" content={customBarLabel} />
                    {data.map((entry) => (
                        <Cell key={entry.name} fill={teamColor[entry.teamId ? entry.teamId : 0]} />
                    ))}
                </Bar>
                <YAxis width={90} yAxisId={0} dataKey="total" axisLine={false} orientation="right" mirror fill="#999" tickFormatter={tickFormater(sum)} tick={{fill: '#999'}} type="category"/>
            </BarChart>
        </ResponsiveContainer>
    </div>
}

/**
 * Custom Label inside chart with reduced font-size
 * @param props 
 */
const customBarLabel = (props: any) => {
    const { x, y, height } = props;

    return (
        <text x={x + 10} y={y + height / 2} fill="#999" dominantBaseline="middle" fontSize="1rem">
            {props.name}
        </text>
    );
};

const tickFormater = (sum:number) => (value: number) => {
    let tickedValue;
    if (value > 1000000000) {
        tickedValue = (Math.round(value / 10000000)/100).toString() + 'B';
    } else if (value > 1000000) {
        tickedValue = (Math.round(value / 10000)/100).toString() + 'M';
    } else if (value > 1000) {
        tickedValue = (Math.round(value / 10)/100).toString() + 'K';
    } else {
        tickedValue = value.toString();
    }
    return `${tickedValue} (${Math.round(value/sum*100)}%)`
}



export default TotalDommages;