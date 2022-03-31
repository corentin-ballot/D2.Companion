import React from 'react';
import { BarChart, Bar, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, Label } from 'recharts';
import { Dommage, fight } from '../../../features/fights/fightsSlice';

interface DommagesProps {
    fight: fight;
}

function TotalDommages(props: DommagesProps) {

    const data = props.fight?.turnList.map(id => {
        const fighter = props.fight.fighters.find(f => f.contextualId === id);
        return {
            name: fighter ? fighter.name : id,
            ...props.fight.dommages.filter(d => d.sourceId === id).reduce(
                (previousValue, currentValue: Dommage) => {
                    if (currentValue.loss) {
                        if (currentValue.elementId === 0) previousValue.neutre += currentValue.loss;
                        if (currentValue.elementId === 1) previousValue.terre += currentValue.loss;
                        if (currentValue.elementId === 2) previousValue.feu += currentValue.loss;
                        if (currentValue.elementId === 3) previousValue.eau += currentValue.loss;
                        if (currentValue.elementId === 4) previousValue.air += currentValue.loss;
                        if (currentValue.elementId === 9) previousValue.invoc += currentValue.loss;
                        if (currentValue.elementId === 4294967295) previousValue.pou += currentValue.loss;

                        previousValue.total += currentValue.loss;
                    }
                    return previousValue;
                }, { neutre: 0, feu: 0, eau: 0, air: 0, terre: 0, pou: 0, invoc: 0, total: 0 })
        }
    });

    return <div style={{paddingLeft: "60px"}}>
    <ResponsiveContainer  width="100%" height={60*props.fight.turnList.length}>
        <BarChart width={800} height={500} layout="vertical" data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis width={900} yAxisId={0} dataKey="name" type="category" mirror tick={{ dy: -20 }} />
            <YAxis width={90} yAxisId={1} dataKey="total" type="category" axisLine={false} orientation="right" mirror />
            <XAxis hide type="number" />
            <Tooltip itemStyle={{ display: "inline-block", margin: "0 1rem" }} labelFormatter={() => ''} cursor={false} isAnimationActive={false} offset={0} separator="" formatter={(value: any, name: any, props: any) => [value, `${name[0]?.toUpperCase() + name?.slice(1)} : `]} />
            {/* dmg deal */}
            <Bar barSize={20} dataKey="neutre" stackId="a" fill="#bdc3c7">
                <LabelList dataKey="neutre" position="center" content={customLabel}/>
            </Bar>
            <Bar barSize={50} dataKey="terre" stackId="a" fill="#e67e22">
                <LabelList dataKey="terre" position="center" content={customLabel}/>
            </Bar>
            <Bar barSize={50} dataKey="feu" stackId="a" fill="#e74c3c">
                <LabelList dataKey="feu" position="center" content={customLabel}/>
            </Bar>
            <Bar barSize={50} dataKey="eau" stackId="a" fill="#3498db">
                <LabelList dataKey="eau" position="center" content={customLabel}/>
            </Bar>
            <Bar barSize={50} dataKey="air" stackId="a" fill="#2ecc71">
                <LabelList dataKey="air" position="center" content={customLabel}/>
            </Bar>
            <Bar barSize={50} dataKey="invoc" stackId="a" fill="#f1c40f">
                <LabelList dataKey="invoc" position="center" content={customLabel}/>
            </Bar>
            <Bar barSize={50} dataKey="pou" stackId="a" fill="#9b59b6">
                <LabelList dataKey="pou" position="center" content={customLabel}/>
            </Bar>
        </BarChart>
    </ResponsiveContainer>
    </div> 
}

/**
 * Custom Label inside chart with reduced font-size
 * @param props 
 */
const customLabel = (props: any) => {
    const { x, y, width, height, value } = props;
  
    return (
        <text x={x + width / 2} y={y + height / 2} fill="#000" textAnchor="middle" dominantBaseline="middle" font-size=".75rem">
          {value > 0 ? value : ''}
        </text>
    );
  };

export default TotalDommages;