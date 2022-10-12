import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ChatServerMessage } from '../../app/dofusInterfaces';
import Notifications from '../../app/notifications';

export interface chatState {
  messageCount: number,
  messages: ChatServerMessage[];
  notifications: Notification[];
  redirections: Redirection[];
}

export interface Notification {
  label: string;
  matches: string[];
}

export interface Redirection {
  channel: number;
  webhook: string;
}

const initialState: chatState = {
  messageCount: 0,
  messages: [],
  notifications: JSON.parse(localStorage.getItem("chat.notifications") || "[]") as Notification[],
  redirections: JSON.parse(localStorage.getItem("chat.redirections") || "[]") as Redirection[],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateNotifications: (state, action: PayloadAction<Notification[]>) => {
      localStorage.setItem('chat.notifications', JSON.stringify(action.payload));
      state.notifications = action.payload;
    },
    updateRedirections: (state, action: PayloadAction<Redirection[]>) => {
      localStorage.setItem('chat.redirections', JSON.stringify(action.payload));
      state.redirections = action.payload;
    },
    processMessage: (state, action: PayloadAction<ChatServerMessage>) => {
      // Channel redirection
      if (state.redirections.map(r => r.channel).includes(action.payload.channel)) {
        const redirection = state.redirections.find(r => r.channel === action.payload.channel);
        if (redirection) new Notifications(action.payload.content, action.payload.senderName, redirection.webhook).sendDiscord();
      }
      // Chat notification
      const matches = state.notifications.reduce((p, c) => [...p, ...c.matches], [] as string[]);

      if(matches.some(el => action.payload.content.toLocaleLowerCase().replace("%20", " ").includes(el))
          || action.payload.objects?.filter(object => matches.includes(object.objectGID.toString())).length
      ) {
        state.messages = [...state.messages, action.payload]
        new Notifications(action.payload.content, action.payload.senderName).send();
      }
    },
  },
});

export const { processMessage, updateNotifications, updateRedirections } = chatSlice.actions;

export const selectNotifications = (state: RootState) => state.chat.notifications;
export const selectRedirections = (state: RootState) => state.chat.redirections;
export const selectMessages = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;
