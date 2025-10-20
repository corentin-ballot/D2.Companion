/* eslint-disable no-underscore-dangle */
/* eslint-disable default-case */
import React, { useState, createContext } from 'react'
import { useChatServerDispatch } from './ChatServerContext'
import { useCharacterDispatch } from './CharacterContext'
import { usePaddockDispatch } from './PaddockContext'
// import { useForgemagieDispatch } from './ForgemagieContext'
import { useMarketDispatch } from './MarketContext'
import { useStorageDispatch } from './StorageContext'
// import { useSalesDispatch } from './SalesContext'
import { useFightDispatch } from './FightContext'
import ReconnectingWebsocket from '../../utils/websocket'

export const SocketContext = createContext({
  connecting: true,
  connected: false
})

interface SocketPrividerProps {
  children: React.ReactElement
}

export const SocketProvider = ({ children }: SocketPrividerProps): React.ReactElement => {
  const [state, setState] = useState({
    connecting: false,
    connected: false
  })
  const dispatchChatServer = useChatServerDispatch()
  const dispatchCharacter = useCharacterDispatch()
  const dispatchPaddock = usePaddockDispatch()
  // const dispatchForgemagie = useForgemagieDispatch()
  const dispatchMarket = useMarketDispatch()
  const dispatchStorage = useStorageDispatch()
  // const dispatchSales = useSalesDispatch()
  const dispatchFight = useFightDispatch()

  const isInit = React.useRef(false)

  React.useEffect(() => {
    if (isInit.current) return
    isInit.current = true

    const socket = new ReconnectingWebsocket("ws://localhost:3960")

    socket.onopen = () => {
      setState({
        connecting: false,
        connected: true
      })
    }

    socket.onclose = () => {
      setState({
        connecting: false,
        connected: false
      })
    }

    socket.onmessage = (event: any) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        /* Dofus 3 */
        // Chat
        case 'ChatChannelMessageEvent':
          dispatchChatServer({ type: 'new_message', message: data.value })
          break;
        // HDV
        case 'ExchangeTypesItemsExchangerDescriptionForUserEvent':
          dispatchMarket({ type: 'item_viewed', payload: data.value })
          break;
        // Storage
        case "StorageInventoryContentEvent":
          dispatchStorage({ type: 'storage_updated', payload: data.value });
          break;
        // Paddock
        case "MountUpdateCharacteristicsEvent":
          dispatchPaddock({ type: 'mount_changed', payload: data.value })
          break;
        case "ExchangeMountWithoutPaddockStartedEvent":
          dispatchPaddock({ type: 'paddock_changed', payload: data.value })
          break;
        case "ExchangeMountsPaddockAddedEvent":
          dispatchPaddock({ type: 'mounts_added', payload: data.value })
          break;
        case "ExchangeMountsPaddockRemoveEvent":
          dispatchPaddock({ type: 'mounts_removed', payload: data.value })
          break;
        // durability update
        // case "GameDataPaddockObjectAddMessage":
        //   dispatchPaddock({ type: 'object_changed', payload: data.value })
        //   break;
        // Character
        case "CharacterSelectionEvent":
          dispatchCharacter({ type: 'character_changed', payload: data.value });
          break;
        case "AchievementsEvent":
          dispatchCharacter({ type: 'achievements_changed', payload: data.value });
          break;
        case "QuestsEvent":
          dispatchCharacter({ type: 'quests_changed', payload: data.value });
          break;

        // Fights
        case "FightJoinEvent":
          dispatchFight({ type: "fight_start", payload: data.value });
          break;
        case "FightMapInformationEvent":
          dispatchFight({ type: "fight_map", payload: data.value });
          break;
        case "FightSynchronizeEvent":
          dispatchFight({ type: "fight_fighters", payload: data.value });
          break;
        case "FightNewRoundEvent":
          dispatchFight({ type: "fight_round", payload: data.value });
          break;
        case "GameActionFightEvent":
          dispatchFight({ type: "fight_action", payload: data.value });
          break;
        case "MapMovementEvent":
          dispatchFight({ type: "fight_movement", payload: data.value });
          break;
        case "FightEndEvent":
          dispatchFight({ type: "fight_end", payload: data.value });
          break;
        case "FightTurnListEvent":
          dispatchFight({ type: "fight_turn_list", payload: data.value });
          break;

        default:
          break;

        /* Dofus 2
        // Sales
        case "TextInformationMessage":
          if (data.content.msgId === 65) // 65 = sale information message
            dispatchSales({ type: 'item_sold', payload: data.content });
          if (data.content.msgId === 252) // 252 = buy information message
            dispatchSales({ type: 'item_bought', payload: data.content });
          break;
        case "ExchangeOfflineSoldItemsMessage":
          dispatchSales({ type: 'items_offline_sold', payload: data.content });
          break;
        case "ExchangeBidHouseUnsoldItemsMessage":
          dispatchSales({ type: 'items_not_sold', payload: data.content });
          break;

        // Fights
        case "GameActionFightLifePointsLostMessage":
          dispatchFight({ type: "fight_dommage", payload: data.content });
          break;
        case "GameActionFightLifeAndShieldPointsLostMessage":
          dispatchFight({ type: "fight_dommage", payload: data.content });
          break;
        case "GameActionFightSpellCastMessage":
          dispatchFight({ type: "fight_spell", payload: data.content });
          break;
        case "GameActionFightMultipleSummonMessage":
          dispatchFight({ type: "fight_summon", payload: data.content });
          break;
          */
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={state}>
      {children}
    </SocketContext.Provider>
  )
}
