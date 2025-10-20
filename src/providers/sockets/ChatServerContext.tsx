/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
import React, { useContext, createContext, useReducer } from 'react'
import { QueryClient } from '@tanstack/react-query'
import Notifications from '../../utils/notification'
import { fetchDofusMonster, Monster } from '../../hooks/dofus-data/useDofusMonster'
import { fetchDofusItem, Item } from '../../hooks/dofus-data/useDofusItem'
import { fetchDofusAchievement, Achievement } from '../../hooks/dofus-data/useDofusAchievement'

export interface Metadata {
  // monsterGroups: MonsterGroup[];
  // objectItems: ObjectItem[];
}

export interface ChatServerMessage {
  content: string;
  channel: string;
  date: string;
  senderCharacterId: string;
  senderAccountId: string;
  senderPrefix: string;
  senderName: string;
  fromAdmin: boolean;
  metadata: Metadata;
}

export interface Notification {
  id: string
  label: string
  matches: string[]
}

export interface Redirection {
  id: string
  channel: string
  webhook: string
}

interface ChatServerState {
  notifications: Notification[]
  redirections: Redirection[]
}

const initialState: ChatServerState = {
  notifications: JSON.parse(localStorage.getItem('ChatServer.notifications') ?? '[]') as Notification[],
  redirections: JSON.parse(localStorage.getItem('ChatServer.redirections') ?? '[]') as Redirection[],
}

const ChatServerContext = createContext<ChatServerState>(initialState)
export const useChatServer = (): ChatServerState => useContext(ChatServerContext)

const ChatServerDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useChatServerDispatch = (): React.Dispatch<any> => useContext(ChatServerDispatchContext)

const queryClient = new QueryClient();
interface QueryTyped {
  type: string,
  match: any[],
  result: any
}

const reducer = (state: ChatServerState, action: { type: string, notification?: Notification, redirection?: Redirection, message?: ChatServerMessage }): ChatServerState => {
  switch (action.type) {
    case 'new_message': {
      if (typeof action.message === "undefined") return state
      const queries: Promise<QueryTyped>[] = [];

      // Clean up
      // const initialMessageContent = action.message.content.replaceAll(/linkColor:#[A-F0-9]{8},/g, "").replaceAll(/\\u200b/g, "")

      const message = { ...action.message };
      const payload = [] as any[];

      // Linked equipments -> use metadata object instead
      // if (message.object && message.object.length && message.object.length > 0) {
      //   message.content = message.object ? message.object.reduce((_content, object) => {
      //     const item = items?.find(i => i.id === parseInt(object.item?.gid, 10));
      //     if (item) payload.push({
      //       title: item.name,
      //       description: object.item.effects.map((e: _Effect) => {
      //         const effect = effects?.find(ef => ef.id === e.action);
      //         if (!e || !e.valueInt || !effect || !effect.description) return undefined;

      //         const possibleEffect = item.possibleEffects.find((pe: any) => pe.effectId === e.action);

      //         // EXO
      //         if (!possibleEffect) return effect.operator === '/' ? `**${effect.description.replace('#4', e.valueInt.toString())}**` : `**${effect.description.replace(/[-]{0,1}#1{~1~2 à [-]{0,1}}#2/, `${e.valueInt * (effect.operator === '-' ? -1 : 1)}`).replace('{~ps}{~zs}', e.valueInt > 1 ? 's' : '')}**`;

      //         return `${effect.description.replace(/[-]{0,1}#1{~1~2 à [-]{0,1}}#2/, `${e.valueInt * (effect.operator === '-' ? -1 : 1)}`).replace('{~ps}{~zs}', e.valueInt > 1 ? 's' : '')} [${possibleEffect.diceNum * (effect.operator === '-' ? -1 : 1)} à ${possibleEffect.diceSide * (effect.operator === '-' ? -1 : 1)}]`
      //       }).join("\n"),
      //     });
      //     return _content.replace("\ufffc", `[${item?.name}]`)
      //   }, message.content) : message.content;
      // }

      // Linked monsters {chatmonster,460}
      Array.from(message.content.matchAll(/{chatmonster,([\d]+)}/g)).forEach(match => {
        const id = parseInt(match[1], 10);
        const promise: Promise<QueryTyped> = new Promise((resolve, reject) => {
          const data = queryClient.fetchQuery({ queryKey: ["DofusMonsters", id], queryFn: () => fetchDofusMonster(id) });
          data.then(result => resolve({ type: "chatmonster", match, result }));
        });
        queries.push(promise);
      });

      // Linked items {chatitem,473710390,20366}
      Array.from(message.content.matchAll(/{chatitem,[\d]+,([^}]+)}/g)).forEach(match => {
        const id = parseInt(match[1], 10);
        const promise: Promise<QueryTyped> = new Promise((resolve, reject) => {
          const data = queryClient.fetchQuery({ queryKey: ["DofusItem", id], queryFn: () => fetchDofusItem(id) });
          data.then(result => resolve({ type: "chatitem", match, result }));
        });
        queries.push(promise);
      });

      // Linked achievment {chatachievement,8853}
      Array.from(message.content.matchAll(/{chatachievement,([\d]+)}/g)).forEach(match => {
        const id = parseInt(match[1], 10);
        const promise: Promise<QueryTyped> = new Promise((resolve, reject) => {
          const data = queryClient.fetchQuery({ queryKey: ["DofusAchievements", id], queryFn: () => fetchDofusAchievement(id) });
          data.then(result => resolve({ type: "chatachievement", match, result }));
        });
        queries.push(promise);
      });

      // Linked monsters group {monsterGroup,-20001}
      // TODO

      // Guild {guild,32007,La Garde De Sombre Lune,False,True}
      // TODO

      // Map positions
      if (message.content.includes("{map,")) {
        message.content = unescape(message.content.replaceAll(/{(map,)([-\d]+,[-\d]+)(,[\d,]+)([a-zA-Z%\d]*)}/g, "[$2]$4"));
      }

      Promise.all(queries).then(results => {
        results.forEach(query => {
          if (query.type === "chatmonster") {
            const monster = query.result as Monster;
            message.content = message.content.replace(query.match[0], `[${typeof monster !== "undefined" ? monster.name.fr : (`chatmonster,${query.match[1]}`)}]`);
          } else if (query.type === "chatitem") {
            const item = query.result as Item;
            message.content = message.content.replace(query.match[0], item && item.name ? item.name.fr : `[chatitem,${query.match[1]}]`);
          } else if (query.type === "chatachievement") {
            const achievement = query.result as Achievement;
            message.content = message.content.replace(query.match[0], achievement ? achievement.name.fr : `[chatachievement,${query.match[1]}]`)
          }
        })

        // Channel redirection
        if (state.redirections.map(r => r.channel).includes(message.channel)) {
          const redirection = state.redirections.find(r => r.channel === message.channel);
          if (redirection) new Notifications(message.content, message.senderName, redirection.webhook, payload).sendDiscord();
        }

        // Chat notification
        const matches = state.notifications.reduce((p, c) => [...p, ...c.matches], [] as string[]);
        if (matches.some(el => action.message?.content.toLocaleLowerCase().includes(el))
          || matches.some(el => message?.content.toLocaleLowerCase().includes(el))
        ) {
          new Notifications(message.content, message.senderName, null, payload).send();
        }
      })

      return state;
    }
    case 'add_notification': {
      if (typeof action.notification === "undefined") return state

      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.notification
          }
        ]
      }
    }
    case 'remove_notification': {

      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.notification?.id)
      }
    }
    case 'add_redirection': {
      if (typeof action.redirection === "undefined") return state

      return {
        ...state,
        redirections: [
          ...state.redirections,
          {
            ...action.redirection
          }
        ]
      }
    }
    case 'remove_redirection': {
      return {
        ...state,
        redirections: state.redirections.filter(redirection => redirection.id !== action.redirection?.id)
      }
    }
    default: {
      throw Error(`ChatServerContext unknown action: ${action.type}`)
    }
  }
}

interface ChatServerProviderProps {
  children: React.ReactElement
}

export const ChatServerProvider = ({ children }: ChatServerProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState)

  React.useEffect(() => {
    localStorage.setItem('ChatServer.notifications', JSON.stringify(state.notifications))
  }, [state.notifications])

  React.useEffect(() => {
    localStorage.setItem('ChatServer.redirections', JSON.stringify(state.redirections))
  }, [state.redirections])

  return (
    <ChatServerContext.Provider value={state}>
      <ChatServerDispatchContext.Provider value={dispatch}>
        {children}
      </ChatServerDispatchContext.Provider>
    </ChatServerContext.Provider>
  )
}
