/* eslint-disable no-param-reassign */
import React from 'react';
import { BarChart, Bar, XAxis,  YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Fight, GameActionFightLifePointsLostMessage } from '../../providers/sockets/FightContext';

const tickFormater = (sum:number) => (value: number) => {
    let tickedValue;
    if (value > 1000000000) {
        tickedValue = `${(Math.round(value / 10000000)/100).toString()  }B`;
    } else if (value > 1000000) {
        tickedValue = `${(Math.round(value / 10000)/100).toString()  }M`;
    } else if (value > 1000) {
        tickedValue = `${(Math.round(value / 10)/100).toString()  }K`;
    } else {
        tickedValue = value.toString();
    }
    return `${tickedValue} (${Math.round(value/sum*100)}%)`
}

interface DommagesProps {
    fight: Fight;
}

const teamColor = ["#e60201", "#0073ba"]

const TotalDommages = ({ fight }: DommagesProps) => {

    const data = fight?.turnList.map(id => {
        const fighter = fight.fighters.find(f => f.contextualId === id);
        return {
            name: fighter ? fighter.name : id,
            teamId: fighter?.spawnInfo.teamId,
            ...fight.dommages.filter(d => d.sourceId === id).reduce(
                (previousValue, currentValue: GameActionFightLifePointsLostMessage) => {
                    if (currentValue.loss) {
                        previousValue.total += currentValue.loss;
                    }
                    return previousValue;
                }, { neutre: 0, feu: 0, eau: 0, air: 0, terre: 0, pou: 0, invoc: 0, total: 0 })
        }
    }).sort((a,b) => b.total - a.total);

    const sum = data.reduce((p, c ) => p + c.total, 0);

    return <div>
        <ResponsiveContainer height={60 * fight.turnList.length}>
            <BarChart width={800} height={500} layout="vertical" data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis hide type="number" />
                {/* dmg deal */}
                <Bar barSize={50} dataKey="total" stackId="a" fill="#9029ab">
                    {data.map((entry) => (
                        <Cell key={entry.name} fill={teamColor[entry.teamId ? entry.teamId : 0]} />
                    ))}
                </Bar>
                <YAxis width={90} yAxisId={0} dataKey="total" axisLine={false} orientation="right" tickFormatter={tickFormater(sum)} tick={{fill: '#000'}} type="category"/>
                <YAxis width={90} yAxisId={1} dataKey="name" axisLine={false} mirror orientation="left" tick={{fill: '#000'}} type="category"/>
            </BarChart>
        </ResponsiveContainer>
    </div>
}

export default TotalDommages;