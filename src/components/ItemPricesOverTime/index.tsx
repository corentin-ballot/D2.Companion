/* eslint-disable func-names */
import React from 'react';
import { CartesianGrid, XAxis, YAxis, LineChart, ResponsiveContainer, Line, Legend, Tooltip } from 'recharts';
import { useDofusItem, useDofusItemPrices } from '../../hooks/dofus-data/useDofusItem';

const COLORS = ["#0073ba", "#ff7800", "#00a816", "#e60201", "#9e59c2", "#f365c4", "#7f7f7f", "#b9c301", "#00c1d3", "#935346", "#714501", "#0e2367", "#be012d", "#00b000", "#ff0001", "#f000ff", "#202a2a", "#bd8102", "#81028a", "#fb5b15"];

function fillMissingDates(data: any[]) {
  if (data.length === 0) return data;

  // Ensure chronological order
  data.sort((a, b) => a.date.localeCompare(b.date));

  const result = [];

  const current = new Date(data[0].date);
  const end = new Date(data[data.length - 1].date);

  let i = 0;

  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10); // YYYY-MM-DD

    if (i < data.length && data[i].date === dateStr) {
      result.push(data[i]);
      i += 1;
    } else {
      // Fill empty entry with same structure but undefined/null values
      const empty = { date: dateStr };
      result.push(empty);
    }

    current.setDate(current.getDate() + 1);
  }

  return result;
}

function mergeByDate(data: { [s: string]: any[]; }) {
    const map = new Map();

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, values] of Object.entries(data)) {
        values.forEach(e => {
            if (!map.has(e.date)) map.set(e.date, { date: e.date });
            map.get(e.date)[key] = e.price;
        });
    }

    // Convert back to sorted array (descending date optional)
    return fillMissingDates(Array.from(map.values()));
}

interface ItemPricesProps {
    ids: number[];
    colors?: string[];
}

export const ItemPricesOverTime = ({ids, colors}: ItemPricesProps) => {
    const items = ids.map(id => useDofusItem(id).data || null);
    const prices = ids.map(id => useDofusItemPrices(id).data || []);

    const data = mergeByDate(ids.reduce((prev, current, index) => Object.assign(prev, {[current]: prices[index]}), {}));

    const effectiveColors = typeof colors === "undefined" ? COLORS : colors;

    return <ResponsiveContainer height={500}>
        <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 5, left: 0, bottom: 90 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-70} height={90} textAnchor="end"/>
            <YAxis domain={['dataMin', 'dataMax']} style={{fontSize: "12px"}}/>
            <Legend />
            <Tooltip />

            {items.map((item, index) => <>
                <Line type="monotone" key={ids[index]} dataKey={ids[index]} dot={false} name={item?.name.fr || `${ids[index]}`} stroke={effectiveColors[index]} />
                <Line connectNulls type="monotone" key={ids[index]} dataKey={ids[index]} dot={false} tooltipType="none" strokeDasharray="2 2" legendType='none' stroke={effectiveColors[index]} />
            </>)}
        </LineChart>
    </ResponsiveContainer>
}

export default ItemPricesOverTime;