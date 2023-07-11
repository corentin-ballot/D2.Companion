import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { StorageInventoryContentMessage, Object } from '../../app/dofusInterfaces';

export interface bankState {
  kamas: number;
  objects: Object[];
}

const initialState: bankState = {
  kamas: 0,
  objects: [],
};

export const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    processStorageInventoryContentMessage: (state, action: PayloadAction<StorageInventoryContentMessage>) => {
      state.kamas = action.payload.kamas;
      state.objects = [...action.payload.objects];
    }
  },
});

export const {
  processStorageInventoryContentMessage,
} = bankSlice.actions;

export const selectBank = (state: RootState) => state.bank;

export default bankSlice.reducer;
