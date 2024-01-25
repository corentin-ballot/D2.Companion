/* eslint-disable no-param-reassign */
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Fight, GameActionFightLifePointsLostMessage } from '../../providers/sockets/FightContext';

const colors = { neutre: "#bdc3c7", feu: "#e74c3c", eau: "#3498db", air: "#2ecc71", terre: "#e67e22", pou: "#9b59b6", invoc: "#f1c40f" }

interface TooltipProps {
    position?: any
    viewBox?: any
    active?: any
    payload?: any
}

const customTooltip = ({ position, viewBox, active, payload }: TooltipProps) => {
    position.x = viewBox.width / 2 - 40;
    position.y = viewBox.height / 2 - 30;

    if (active && payload && payload.length) {
        const {name} = payload[0] as { name: "neutre"|"feu"|"eau"|"air"|"terre"|"pou"|"invoc" };
        return <div style={{textAlign: "center", border: "0", width: "80px", height: "60px", padding: 0, margin: 0}}>
            <p style={{marginBottom: 0}}>{name[0].toUpperCase() + name.substring(1)}</p>
            <p style={{color: colors[name], fontWeight: "bold", margin: 0}}>{payload[0].value}</p>
        </div>;
    } 
        return null;
    
}

interface TypeRepartitionProps {
    fight: Fight;
    fightersFilter: number[];
}

const DealedTypeRepartition = ({fight, fightersFilter}: TypeRepartitionProps) => {

    const data = fight.dommages.filter((d: { sourceId: any; }) => fightersFilter.includes(d.sourceId)).reduce(
        (previousValue: { neutre: number; terre: number; feu: number; eau: number; air: number; invoc: number; pou: number; }, currentValue: GameActionFightLifePointsLostMessage) => {
            if (currentValue.loss) {
                if (currentValue.elementId === 0) previousValue.neutre += currentValue.loss;
                if (currentValue.elementId === 1) previousValue.terre += currentValue.loss;
                if (currentValue.elementId === 2) previousValue.feu += currentValue.loss;
                if (currentValue.elementId === 3) previousValue.eau += currentValue.loss;
                if (currentValue.elementId === 4) previousValue.air += currentValue.loss;
                if (currentValue.elementId === 9) previousValue.invoc += currentValue.loss;
                if (currentValue.elementId === 4294967295) previousValue.pou += currentValue.loss;
            }
            return previousValue;
        }, { neutre: 0, feu: 0, eau: 0, air: 0, terre: 0, pou: 0, invoc: 0 }
    );

    const formatedData = (Object.keys(data) as ["neutre"|"feu"|"eau"|"air"|"terre"|"pou"|"invoc"]).map((key) => ({ name: key, value: data[key] }));

    return <div>
        <ResponsiveContainer height={300}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                {/* dmg deal */}
                <Pie data={formatedData} dataKey="value" cx="50%" cy="50%" innerRadius={80} outerRadius={120} labelLine={false}>
                    <Cell fill={colors.neutre} />
                    <Cell fill={colors.feu} />
                    <Cell fill={colors.eau} />
                    <Cell fill={colors.air} />
                    <Cell fill={colors.terre} />
                    <Cell fill={colors.pou} />
                    <Cell fill={colors.invoc} />
                </Pie>
                <Tooltip isAnimationActive={false} position={{x: 0,y: 0}} offset={0} content={customTooltip} />
            </PieChart>
        </ResponsiveContainer>
    </div>
}

export default DealedTypeRepartition;