/* eslint-disable no-param-reassign */
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Fight } from '../../providers/sockets/FightContext';

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
    fightersFilter: string[];
}

const DealedTypeRepartition = ({fight, fightersFilter}: TypeRepartitionProps) => {

    const data = fight.actions.filter(action => fightersFilter.includes(action.sourceId) && action.lifePointsLost).reduce(
            (value, action) => {
                if (action.lifePointsLost?.elementId === 0) value.neutre += ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0));
                if (action.lifePointsLost?.elementId === 1) value.terre += ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0));
                if (action.lifePointsLost?.elementId === 2) value.feu += ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0));
                if (action.lifePointsLost?.elementId === 3) value.eau += ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0));
                if (action.lifePointsLost?.elementId === 4) value.air += ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0));
                if (action.lifePointsLost?.elementId === 9) value.invoc += ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0));
                if (action.lifePointsLost?.elementId === 4294967295) value.pou += ((action.lifePointsLost?.loss || 0) + (action.lifePointsLost?.shieldLoss || 0));
                return {...value};
            }, { neutre: 0, feu: 0, eau: 0, air: 0, terre: 0, pou: 0, invoc: 0 }
        )

    // @ts-ignore
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