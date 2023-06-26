import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BidExchangerObjectInfo, ExchangeTypesItemsExchangerDescriptionForUserMessage } from '../../app/dofusInterfaces';
import { RootState } from '../../app/store';

let items: any[] = [];
fetch(process.env.PUBLIC_URL + '/data/items.json').then(res => res.json()).then(json => items = json);

interface Item extends BidExchangerObjectInfo {
    name: string;
    level: number;
    imgUrl: string;
    possibleEffects: any[]
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
        state.items = action.payload.itemTypeDescriptions.map(i => {
            const item:any = items.find(eq => eq._id === i.objectGID);
            return {...i, name: item?.name, level: item?.level, possibleEffects: [...item.possibleEffects], imgUrl: "/img/items/" + item?.iconId + ".png"};
        });
    },
  }
});

export const { setItems } = marketSlice.actions;

export const selectItems = (state: RootState) => state.market.items;

export default marketSlice.reducer;
