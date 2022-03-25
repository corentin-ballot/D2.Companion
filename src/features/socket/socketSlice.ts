import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface socketState {
  connecting: boolean;
  connected: boolean;
}

const initialState: socketState = {
  connecting: false,
  connected: false,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    send: (state, action: PayloadAction<string>) => {/* trigger socketMiddleware */},
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.connecting = action.payload;
    },
  },
});

export const { send, setConnected, setConnecting } = socketSlice.actions;

export const selectSocket = (state: RootState) => state.socket as socketState;

export default socketSlice.reducer;
