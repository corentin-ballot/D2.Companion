import React from 'react';
import { Box } from '@mui/material';
import { useDofusItemPrices } from '../../../hooks/dofus-data/useDofusItem';
import PricesOverDays from '../../../components/PricesOverDays';

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

const Prices = () => {
    const scrollFor = useDofusItemPrices(797).data || [];
    const scrollAgi = useDofusItemPrices(801).data || [];
    const scrollSag = useDofusItemPrices(805).data || [];
    const scrollVit = useDofusItemPrices(810).data || [];
    const scrollCha = useDofusItemPrices(814).data || [];
    const scrollInt = useDofusItemPrices(817).data || [];

    const prices = mergeByDate({
        "Puissant parchemin de Force": scrollFor,
        "Puissant parchemin d'Agilité": scrollAgi,
        "Puissant parchemin de Sagesse": scrollSag,
        "Puissant parchemin de Vitalité": scrollVit,
        "Puissant parchemin de Chance": scrollCha,
        "Puissant parchemin d'Intelligence": scrollInt,
    })

    return <Box sx={{ flexGrow: 1 }}>
        <PricesOverDays data={prices} colors={["#714501", "#00a816", "#81028a", "#b9c301", "#0073ba", "#e60201"]} keys={[
            "Puissant parchemin de Force",
            "Puissant parchemin d'Agilité",
            "Puissant parchemin de Sagesse",
            "Puissant parchemin de Vitalité",
            "Puissant parchemin de Chance",
            "Puissant parchemin d'Intelligence"]} />
    </Box>;
}

export default Prices;