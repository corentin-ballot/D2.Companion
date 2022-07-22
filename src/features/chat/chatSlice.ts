import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ChatServerMessage } from '../../app/dofusInterfaces';

export interface chatState {
  messageCount: number,
  messages: ChatServerMessage[];
  notifications: Notification[];
}

interface Notification {
  label: string;
  matches: string[];
}

const initialState: chatState = {
  messageCount: 0,
  messages: [],
  notifications: JSON.parse(localStorage.getItem("chat.notifications") || "[]") as Notification[],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatServerMessage>) => {
      // state = {...state, channels: {...state.channels, [channel]: [...state.channels[channel], action.payload]}};
      // state.messages = [...state.messages.slice(-500), {...action.payload, id: ++state.messageCount}];
      const matches = state.notifications.reduce((p, c) => [...p, ...c.matches], [] as string[]);
      if(action.payload.senderName === "Co-mmotion") {
        console.log("matches", matches)
        console.log("content", action.payload.content)
        console.log("content-format", action.payload.content.toLocaleLowerCase().replace("%20", " "))
        
      }

      if(matches.some(el => action.payload.content.toLocaleLowerCase().replace("%20", " ").includes(el))
          || action.payload.objects?.filter(object => matches.includes(object.objectGID.toString())).length
      ) {
        const message = `${action.payload.senderName} : ${action.payload.content}`;
        if (Notification.permission === 'granted') {
          // Si tout va bien, créons une notification
          const notification = new Notification(message);
          notification.onclick = (event) => {
            navigator.clipboard.writeText(`/w ${action.payload.senderName}`).then(function() {
                console.log('Async: Copying to clipboard was successful!');
              }, function(err) {
              console.error('Async: Could not copy text: ', err);
            });
          };
        }
      }
    },
  },
});

export const { addMessage } = chatSlice.actions;

export const selectNotifications = (state: RootState) => state.chat.notifications;

export default chatSlice.reducer;
