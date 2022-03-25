import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ChatServerMessage } from '../../app/dofusInterfaces';

export interface chatState {
  messageCount: number,
  messages: ChatServerMessage[];
}

const initialState: chatState = {
  messageCount: 0,
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatServerMessage>) => {
      // state = {...state, channels: {...state.channels, [channel]: [...state.channels[channel], action.payload]}};
      // state.messages = [...state.messages.slice(-500), {...action.payload, id: ++state.messageCount}];
    },
  },
});

export const { addMessage } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages as ChatServerMessage[];

export default chatSlice.reducer;
