import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ChatServerMessage } from '../../app/dofusInterfaces';
import Notifications from '../../app/notifications';

const data = {
  monsters: [] as any[],
  weapons: [] as any[],
  equipments: [] as any[],
  achievements: [] as any[],
};

fetch(process.env.PUBLIC_URL + '/data/monsters.json').then(res => res.json()).then((res: {Id: number, Name: string}[]) => data.monsters = res.map(r => ({id: r.Id, name: r.Name})));
fetch(process.env.PUBLIC_URL + '/data/weapons.json').then(res => res.json()).then((res: {_id: number, name: string}[]) => data.weapons = res.map(r => ({id: r._id, name: r.name})));
fetch(process.env.PUBLIC_URL + '/data/equipments.json').then(res => res.json()).then((res: {_id: number, name: string}[]) => data.equipments = res.map(r => ({id: r._id, name: r.name})));
fetch(process.env.PUBLIC_URL + '/data/achievements.json').then(res => res.json()).then((res: {id: number, name: any}[]) => data.achievements = res.map(r => ({id: r.id, name: r.name.fr})));
    

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
      const chatMessage = {...action.payload};
      if (chatMessage.objects && chatMessage.objects.length && chatMessage.objects.length > 0) {
        chatMessage.content = chatMessage.objects ? chatMessage.objects.reduce((_content, object) => _content.replace("\ufffc", `[${data.equipments.find(e => e.id === object.objectGID)?.name}]`), chatMessage.content) : chatMessage.content;
      }
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
