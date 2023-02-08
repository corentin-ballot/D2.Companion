import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ChatServerMessage, dofusObjectEffect } from '../../app/dofusInterfaces';
import Notifications from '../../app/notifications';
import { equipmentStats } from '../../app/equipmentStats';

const data = {
  monsters: [] as any[],
  items: [] as any[],
  achievements: [] as any[],
};

fetch(process.env.PUBLIC_URL + '/data/monsters.json').then(res => res.json()).then((res: {Id: number, Name: string}[]) => data.monsters = res.map(r => ({id: r.Id, name: r.Name})));
fetch(process.env.PUBLIC_URL + '/data/items.json').then(res => res.json()).then((res: {_id: number, name: string, possibleEffects: any[]}[]) => data.items = res.map(r => ({id: r._id, name: r.name, possibleEffects: r.possibleEffects})));
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
      const payload = [] as any[];

      // equipments
      if (chatMessage.objects && chatMessage.objects.length && chatMessage.objects.length > 0) {
        chatMessage.content = chatMessage.objects ? chatMessage.objects.reduce((_content, object) => {
          const item = data.items.find(item => item.id === object.objectGID);
          if(item) payload.push({
            title: item.name,
            description: object.effects.map((effect: dofusObjectEffect) => {
              const stat = equipmentStats.get(effect.actionId);
              if(!stat) return undefined;

              const possibleEffect = item.possibleEffects.find((pe: any) => pe.effectId === effect.actionId);

              // EXO
              if(!possibleEffect) return stat.reverse ? `**${stat.name} ${effect.value}**` : `**${effect.value} ${stat.name}**`;

              return `${effect.value * (stat.negative ? -1 : 1)} ${stat.name} [${possibleEffect.diceNum} à ${possibleEffect.diceSide}]`}).join("\n"),
          });
          return _content.replace("\ufffc", `[${item?.name}]`)
        }, chatMessage.content) : chatMessage.content;
      }

      // positions
      if(chatMessage.content.includes("{map,")) {
        chatMessage.content = unescape(chatMessage.content.replaceAll(/{(map,)([-\d]+,[-\d]+)(,[\d,]+)([a-zA-Z%\d]*)}/g, "[$2]$4"));
      }

      // monsters {chatmonster,460}
      while(chatMessage.content.includes("{chatmonster,")) {
        const match = chatMessage.content.match(/{chatmonster,([\d]+)}/);
        if (match && match[1]) {
          const monster = data.monsters.find(e => e.id == match[1]);
          chatMessage.content = chatMessage.content.replace(/{chatmonster,([\d]+)}/, `[${typeof monster != "undefined" ? monster.name : ("chatmonster,"+match[1])}]`);
        }
      }

      // monsters group {monsterGroup,25,28,17,Shokkoth,-20001;0;5x4450x212|2x4450x203}
      if(chatMessage.content.includes("{monsterGroup,")) {
        chatMessage.content = unescape(chatMessage.content.replaceAll(/{monsterGroup,([-\d]+,[-\d]+),[-\d]+,([a-zA-Z%\d]*),[-\d]+;[-\d]+;[x\d|]+}/g, "$2[$1]"));
      }

      // achievment {chatachievement,2288}
      while(chatMessage.content.includes("{chatachievement,")) {
        const match = chatMessage.content.match(/{chatachievement,([\d]+)}/);
        if (match && match[1]) {
          const achievement = data.achievements.find(e => e.id == match[1]);
          chatMessage.content = chatMessage.content.replace(/{chatachievement,([\d]+)}/, `[${typeof achievement != "undefined" ? achievement.name : ("chatachievement,"+match[1]) }]`);
        }
      }

      // Channel redirection
      if (state.redirections.map(r => r.channel).includes(chatMessage.channel)) {
        const redirection = state.redirections.find(r => r.channel === chatMessage.channel);
        if (redirection) new Notifications(chatMessage.content, chatMessage.senderName, redirection.webhook, payload).sendDiscord();
      }
      // Chat notification
      const matches = state.notifications.reduce((p, c) => [...p, ...c.matches], [] as string[]);

      if(matches.some(el => action.payload.content.toLocaleLowerCase().replace("%20", " ").includes(el))
          || action.payload.objects?.filter(object => matches.includes(object.objectGID.toString())).length
      ) {
        state.messages = [...state.messages, chatMessage]
        new Notifications(chatMessage.content, chatMessage.senderName, null, payload).send();
      }
    },
  },
});

export const { processMessage, updateNotifications, updateRedirections } = chatSlice.actions;

export const selectNotifications = (state: RootState) => state.chat.notifications;
export const selectRedirections = (state: RootState) => state.chat.redirections;
export const selectMessages = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;
