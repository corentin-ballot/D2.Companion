import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BidExchangerObjectInfo, ExchangeTypesItemsExchangerDescriptionForUserMessage } from '../../app/dofusInterfaces';
import { equipmentStats } from '../../app/equipmentStats';
import { RootState } from '../../app/store';
import equipments from '../../data/equipments.json';    

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
            const statistics = [...equipment.statistics];
            item.effects.forEach(effect => {
                const stat = equipmentStats.get(effect.actionId);
                if(stat) {
                    const statistic = statistics.find(s => typeof s[stat.name] !== "undefined")
                    if(statistic) {
                        statistic[stat.name].value = stat.negative ? -1 * effect.value : effect.value;
                    } else if(stat) {
                        statistics.push({[statistic]: {min:0, max:0, value: stat.negative ? -1 * effect.value : effect.value}})
                    }
                } else {
                    console.error("Effect with id " + effect.actionId + " is nos defined.");
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
