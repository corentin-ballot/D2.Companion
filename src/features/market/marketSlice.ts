import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BidExchangerObjectInfo, ExchangeTypesItemsExchangerDescriptionForUserMessage } from '../../app/dofusInterfaces';
import { equipmentStats } from '../../app/equipmentStats';
import { RootState } from '../../app/store';

let equipments: any[];
fetch(process.env.PUBLIC_URL + '/data/equipments.json').then(res => res.json()).then(json => equipments = json);

interface Item extends BidExchangerObjectInfo {
    name: string;
    level: number;
    imgUrl: string;
    statistics: any[]
}

interface marketState {
    items: Item[];
}

const initialState: marketState = {
    items: [],
};

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ExchangeTypesItemsExchangerDescriptionForUserMessage>) => {
        state.items = action.payload.itemTypeDescriptions.map(item => {
            const equipment = equipments.find(eq => eq._id === item.objectGID);
            const statistics = typeof equipment !== "undefined" && typeof equipment.statistics !== "undefined" ? [...equipment.statistics] : [];
            item.effects.forEach(effect => {
                const stat = equipmentStats.get(effect.actionId);
                if(stat) {
                    const statistic = statistics.findIndex(s => typeof s[stat.name] !== "undefined")
                    if(statistic > 0) {
                        console.log("if(statistic)", stat, stat.name, statistic);
                        statistics[statistic].value = stat.negative ? -1 * effect.value : effect.value;
                    } else if(stat && ![988, 985, 2825].includes(effect.actionId)) {
                        // EXO
                        console.log("else if(stat)", stat, stat.name, statistic);
                        statistics.push({[statistic]: {min:0, max:0, value: stat.negative ? -1 * effect.value : effect.value, exo: true}})
                    }
                } else if(![1151, 1152, 1176].includes(effect.actionId)) {
                    console.error("Effect with id " + effect.actionId + " is nos defined.", item.effects);
                }
            })
            return {...item, name: equipment?.name, level: equipment?.level, statistics: statistics, imgUrl: equipment?.imgUrl.replace("https://s.ankama.com/www/static.ankama.com/dofus/www/game/items/200/", "/img/equipments/")}
        });
    },
  }
});

export const { setItems } = marketSlice.actions;

export const selectItems = (state: RootState) => state.market.items;

export default marketSlice.reducer;
