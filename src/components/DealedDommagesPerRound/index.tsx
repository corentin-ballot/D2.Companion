/* eslint-disable func-names */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Stack, Box } from '@mui/material';
import { CartesianGrid, Legend, Tooltip, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Fight, Fighter } from '../../providers/sockets/FightContext';
import FighterName from '../FighterName';

const COLORS = ["#0073ba", "#ff7800", "#00a816", "#e60201", "#9e59c2", "#f365c4", "#7f7f7f", "#b9c301", "#00c1d3", "#935346", "#714501", "#0e2367", "#be012d", "#00b000", "#ff0001", "#f000ff", "#202a2a", "#bd8102", "#81028a", "#fb5b15"];

interface DealedDommagesPerRoundProps {
    fight: Fight;
    fightersFilter: string[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ border: "solid lightgrey 1px", backgroundColor: "white", padding: "16px" }}>{payload[0].value}</div>
        );
    }
    return null;
};

const renderLegend = (fighters: Fighter[]) => function ({ payload }: any) {
    return <Stack direction="row" justifyContent="center">
        {payload.map((entry: any) => {
            const fighter = fighters.find(f => f.actorId === entry.value);
            return <Box sx={{ color: entry.color }}>
                <svg className="recharts-surface" width="14" height="14" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} viewBox="0 0 32 32"><path strokeWidth="4" fill="none" stroke="#0073ba" d="M0,16h10.666666666666666A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16H32M21.333333333333332,16A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16" className="recharts-legend-icon" /></svg>
                <FighterName fighter={fighter} />
            </Box>
        })}
    </Stack>
}


const DealedDommagesPerRound = ({ fight, fightersFilter }: DealedDommagesPerRoundProps) => {

    const data = Array(fight.round > 0 ? fight.round : 0).fill(0).map((e, i) => {
        const round = i + 1;
        return {
            round,
            ...fight.turnList.map(o => ({
                [o.id]: fight.actions.filter(d => d.sourceId === o.id && d.round === round).reduce(
                    (value, action) => value + ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0)), 0)
            })).reduce((p, c) => ({ ...p, ...c }), {})
        }
    });

    return <ResponsiveContainer height={300}>
        <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="round" />
            <YAxis mirror />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend(fight.fighters)} />
            {
                fight.turnList.filter(o => fightersFilter.includes(o.id)).map((o, i) => <Line type="monotone" key={o.id} strokeWidth={2} dataKey={o.id} stroke={COLORS[i]} />)
            }
        </LineChart>
    </ResponsiveContainer>
}

export default DealedDommagesPerRound;