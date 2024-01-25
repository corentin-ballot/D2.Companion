import React from 'react';
import { CartesianGrid, Legend, Tooltip, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Fight, GameActionFightLifePointsLostMessage } from '../../providers/sockets/FightContext';

const COLORS = ["#0073ba", "#ff7800", "#00a816", "#e60201", "#9e59c2", "#f365c4", "#7f7f7f", "#b9c301", "#00c1d3", "#935346", "#714501", "#0e2367", "#be012d", "#00b000", "#ff0001", "#f000ff", "#202a2a", "#bd8102", "#81028a", "#fb5b15"];

interface RecievedDommagesPerRoundProps {
    fight: Fight;
    fightersFilter: number[];
}

const RecievedDommagesPerRound = ({ fight, fightersFilter }: RecievedDommagesPerRoundProps) => {

    const data = Array(fight.round > 0 ? fight.round : 0).fill(0).map((e, i) => {
        const round = i + 1;
        return {
            round,
            ...fight.turnList.map(id => ({
                    [id]: fight.dommages.filter(d => d.targetId === id && d.round === round).reduce(
                        (previousValue, currentValue: GameActionFightLifePointsLostMessage) => previousValue + currentValue.loss, 0)
                })).reduce((p, c) => ({ ...p, ...c }), {})
        }
    });

    return <ResponsiveContainer height={300}>
        <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="round" />
            <YAxis mirror />
            <Tooltip />
            <Legend />
            {
                fight.turnList.filter(id => fightersFilter.includes(id)).map((id, i) => <Line type="monotone" key={id} strokeWidth={2} name={fight.fighters.find(f => f.contextualId === id)?.name} dataKey={id} stroke={COLORS[i]} />)
            }
        </LineChart>
    </ResponsiveContainer>
}

export default RecievedDommagesPerRound;