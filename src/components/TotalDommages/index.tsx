/* eslint-disable no-param-reassign */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable max-classes-per-file */
import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Fight, Fighter } from '../../providers/sockets/FightContext';
import FighterName from '../FighterName';

const tickFormater = (sum: number) => (value: number) => {
    let tickedValue;
    if (value > 1000000000) {
        tickedValue = `${(Math.round(value / 10000000) / 100).toString()}B`;
    } else if (value > 1000000) {
        tickedValue = `${(Math.round(value / 10000) / 100).toString()}M`;
    } else if (value > 1000) {
        tickedValue = `${(Math.round(value / 10) / 100).toString()}K`;
    } else {
        tickedValue = value.toString();
    }
    return `${tickedValue} (${Math.round(value / sum * 100)}%)`
}

class NamesAxisTick extends PureComponent {
    render() {
        // @ts-ignore
        const { x, y, stroke, payload, fighters } = this.props;

        const fighter = fighters.find((f: Fighter) => f.actorId === payload.value)

        return (
            <g transform={`translate(${x},${y + 3})`}>
                <g x={0} y={0} dy={16} textAnchor="end" fill="#666" style={{ fontSize: '.7rem' }}>
                    <FighterName fighter={fighter} />
                </g>
            </g>
        );
    }
}

interface DommagesProps {
    fight: Fight;
}

const teamColor = { TEAM_CHALLENGER: "#e60201", TEAM_DEFENDER: "#0073ba" }

const TotalDommages = ({ fight }: DommagesProps) => {
    if (!fight) return <div />

    const data = fight?.fighters.map(fighter => ({
        id: fighter?.actorId,
        teamId: fighter?.actorInformation.fighter.spawnInformation.team,
        dommages: fight.actions.filter(action => action.sourceId === fighter.actorId && action.lifePointsLost).reduce((value, action) => value + ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0)), 0)
    })
    ).sort((a, b) => b.dommages - a.dommages);

    const sum = data.reduce((p, c) => p + c.dommages, 0);

    return <div>
        <ResponsiveContainer height={24 * fight.fighters.length}>
            <BarChart width={800} height={500} layout="vertical" data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis hide type="number" />
                {/* dmg deal */}
                <Bar barSize={15} dataKey="dommages" stackId="a" fill="#9029ab" radius={[0, 10, 10, 0]}>
                    {data.map((entry) => (
                        // @ts-ignore
                        <Cell key={entry.name} fill={teamColor[entry.teamId]} />
                    ))}
                </Bar>
                {/* @ts-ignore */}
                <YAxis width={90} yAxisId={0} dataKey="dommages" axisLine={false} orientation="right" tickFormatter={tickFormater(sum)} style={{ fontSize: '.7rem' }} type="category" minTickGap={0} />
                {/* @ts-ignore */} 
                <YAxis width={90} yAxisId={1} dataKey="id" tick={<NamesAxisTick fighters={fight?.fighters} />} type="category" minTickGap={0} />
            </BarChart>
        </ResponsiveContainer>
    </div>
}

export default TotalDommages;