import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ExchangeBidHouseUnsoldItemsMessage, ExchangeOfflineSoldItemsMessage, TextInformationMessage } from '../../app/dofusInterfaces';

export interface Sale {
  id: number;
  date: number;
  quantity: number;
  price: number;
}

export interface SalesState {
  history: Sale[];
  returns: Sale[];
}

const initialState: SalesState = {
  history: JSON.parse(localStorage.getItem("sales.history") || "[]"),
  returns: JSON.parse(localStorage.getItem("sales.returns") || "[]"),
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    processTextInformationMessage: (state, action: PayloadAction<TextInformationMessage>) => {
      if(action.payload.msgId !== 65) return; // 65 = sale information message

      state.history = [{
        id: parseInt(action.payload.parameters[1]),
        date: Date.now(),
        quantity: parseInt(action.payload.parameters[3]),
        price: parseInt(action.payload.parameters[0]),
      }, ...state.history];

      localStorage.setItem("sales.history", JSON.stringify(state.history));
    },
    processExchangeOfflineSoldItemsMessage: (state, action: PayloadAction<ExchangeOfflineSoldItemsMessage>) => {
      state.history = [...action.payload.bidHouseItems.map((item) => ({
        id: item.objectGID,
        date: item.date * 1000,
        quantity: item.quantity,
        price: item.price,
      })), ...state.history];

      localStorage.setItem("sales.history", JSON.stringify(state.history));
    },
    processExchangeBidHouseUnsoldItemsMessage: (state, action: PayloadAction<ExchangeBidHouseUnsoldItemsMessage>) => {
      state.history = [...action.payload.items.map((item) => ({
        id: item.objectGID,
        date: Date.now(),
        quantity: item.quantity,
        price: -1,
      })), ...state.history];

      localStorage.setItem("sales.returns", JSON.stringify(state.history));
    },
  },
});

export const {
  processTextInformationMessage,
  processExchangeOfflineSoldItemsMessage,
  processExchangeBidHouseUnsoldItemsMessage,
} = salesSlice.actions;

export const selectSalesHistory = (state: RootState) => state.sales.history;

export default salesSlice.reducer;
