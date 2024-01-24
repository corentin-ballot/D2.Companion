import React, { useContext, createContext, useReducer } from 'react'
import useDofusAchievements, { Achievement } from '../../hooks/dofus-data/useDofusAchievements'
import useDofusMonsters, { Monster } from '../../hooks/dofus-data/useDofusMonsters'
import useDofusItems, { Item } from '../../hooks/dofus-data/useDofusItems'
import Notifications from '../../utils/notification'
import useDofusEffects, { Effect } from '../../hooks/dofus-data/useDofusEffects'

export interface ObjectEffect {
  actionId: number;
  value: number;
}

export interface Object {
  name: string;
  position: number,
  objectGID: number,
  effects: ObjectEffect[],
  objectUID: number,
  quantity: number
}

export interface ChatServerMessage {
  name: "ChatServerMessage";
  channel: number;
  content: string;
  timestamp: number;
  fingerprint: string;
  senderId: number;
  senderName: string;
  prefix: string;
  senderAccountId: number;
  objects?: Object[];
}

export interface Notification {
  id: string
  label: string
  matches: string[]
}

export interface Redirection {
  id: string
  channel: number
  webhook: string
}

interface ChatServerState {
  notifications: Notification[]
  redirections: Redirection[]
}

const initialState: ChatServerState = {
  notifications: JSON.parse(localStorage.getItem('ChatServer.notifications') ?? '[]') as Notification[],
  redirections: JSON.parse(localStorage.getItem('ChatServer.redirections') ?? '[]') as Redirection[]
}

const ChatServerContext = createContext<ChatServerState>(initialState)
export const useChatServer = (): ChatServerState => useContext(ChatServerContext)

const ChatServerDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useChatServerDispatch = (): React.Dispatch<any> => useContext(ChatServerDispatchContext)

const reducer = (achievements: Achievement[] | undefined, monsters: Monster[] | undefined, items: Item[] | undefined, effects: Effect[] | undefined) => (state: ChatServerState, action: {type: string, notification?: Notification, redirection?: Redirection, message?: ChatServerMessage}): ChatServerState => {
  switch (action.type) {
    case 'new_message': {
      if (typeof action.message === "undefined") return state
      
      const message = { ...action.message };
      const payload = [] as any[];

      // Linked equipments
      if (message.objects && message.objects.length && message.objects.length > 0) {
        message.content = message.objects ? message.objects.reduce((_content, object) => {
          const item = items?.find(i => i.id === object.objectGID);
          if (item) payload.push({
            title: item.name,
            description: object.effects.map((e: ObjectEffect) => {
              const effect = effects?.find(ef => ef.id === e.actionId);
              if (!e || !e.value || !effect || !effect.description) return undefined;

              const possibleEffect = item.possibleEffects.find((pe: any) => pe.effectId === e.actionId);

              // EXO
              if (!possibleEffect) return effect.operator === '/' ? `**${effect.description.replace('#4', e.value.toString())}**` : `**${effect.description.replace(/[-]{0,1}#1{~1~2 à [-]{0,1}}#2/, `${e.value * (effect.operator === '-' ? -1 : 1)}`).replace('{~ps}{~zs}', e.value > 1 ? 's' : '')}**`;

              return `${effect.description.replace(/[-]{0,1}#1{~1~2 à [-]{0,1}}#2/, `${e.value * (effect.operator === '-' ? -1 : 1)}`).replace('{~ps}{~zs}', e.value > 1 ? 's' : '')} [${possibleEffect.diceNum * (effect.operator === '-' ? -1 : 1)} à ${possibleEffect.diceSide * (effect.operator === '-' ? -1 : 1)}]`
            }).join("\n"),
          });
          return _content.replace("\ufffc", `[${item?.name}]`)
        }, message.content) : message.content;
      }

      // Map positions
      if (message.content.includes("{map,")) {
        message.content = unescape(message.content.replaceAll(/{(map,)([-\d]+,[-\d]+)(,[\d,]+)([a-zA-Z%\d]*)}/g, "[$2]$4"));
      }

      // Linked monsters {chatmonster,460}
      while (message.content.includes("{chatmonster,")) {
        const match = message.content.match(/{chatmonster,([\d]+)}/);
        if (match && match[1]) {
          const monster = monsters?.find(e => `${e.id}` === match[1]);
          message.content = message.content.replace(/{chatmonster,([\d]+)}/, `[${typeof monster !== "undefined" ? monster.name : (`chatmonster,${  match[1]}`)}]`);
        }
      }

      // Linked monsters group {monsterGroup,25,28,17,Shokkoth,-20001;0;5x4450x212|2x4450x203}
      if (message.content.includes("{monsterGroup,")) {
        message.content = unescape(message.content.replaceAll(/{monsterGroup,([-\d]+,[-\d]+),[-\d]+,([a-zA-Z%\d]*),[-\d]+;[-\d]+;[x\d|]+}/g, "$2[$1]"));
      }

      // Linked achievment {chatachievement,2288}
      while (message.content.includes("{chatachievement,")) {
        const match = message.content.match(/{chatachievement,([\d]+)}/);
        if (match && match[1]) {
          const achievement = achievements?.find(e => `${e.id}` === match[1]);
          message.content = message.content.replace(/{chatachievement,([\d]+)}/, `[${typeof achievement !== "undefined" ? achievement.name : (`chatachievement,${  match[1]}`)}]`);
        }
      }

      // Channel redirection
      if (state.redirections.map(r => r.channel).includes(message.channel)) {
        const redirection = state.redirections.find(r => r.channel === message.channel);
        if (redirection) new Notifications(message.content, message.senderName, redirection.webhook, payload).sendDiscord();
      }

      // Chat notification
      const matches = state.notifications.reduce((p, c) => [...p, ...c.matches], [] as string[]);

      if (matches.some(el => action.message?.content.toLocaleLowerCase().replace(/[_\W]+/g, "").includes(el.replace(/[_\W]+/g, "")))
        || action.message.objects?.filter((object: { objectGID: number }) => matches.includes(object.objectGID.toString())).length
      ) {
        new Notifications(message.content, message.senderName, null, payload).send();
      }

      return state
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
  const monsters = useDofusMonsters().data
  const achievements = useDofusAchievements().data
  const items = useDofusItems().data
  const effects = useDofusEffects().data
  const [state, dispatch] = useReducer(reducer(achievements, monsters, items, effects), initialState)

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
