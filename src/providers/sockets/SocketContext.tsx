/* eslint-disable no-underscore-dangle */
/* eslint-disable default-case */
import React, { useState, createContext } from 'react'
import { io } from 'socket.io-client'
import { useChatServerDispatch } from './ChatServerContext'
import { useCharacterDispatch } from './CharacterContext'
import { usePaddockDispatch } from './PaddockContext'
import { useForgemagieDispatch } from './ForgemagieContext'

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
  const dispatchForgemargie = useForgemagieDispatch()

  const isInit = React.useRef(false)

  React.useEffect(() => {
    if (isInit.current) return
    isInit.current = true

    const socket = io('http://localhost:3960')

    socket.on('connect', () => {
      setState({
        connecting: false,
        connected: true
      })
    })

    socket.on('close', () => {
      setState({
        connecting: false,
        connected: false
      })
    })

    socket.on('data', (data: any) => {
      switch (data.content.__name) {
        case undefined:
        case 'BasicPingMessage':
        case 'BasicPongMessage':
        case 'BasicNoOperationMessage':
        case 'BasicAckMessage':
        case 'GameMapMovementMessage':
        case 'GameMapMovementConfirmMessage':
        case 'GameContextRefreshEntityLookMessage':
        case 'SetCharacterRestrictionsMessage':
        case 'GameContextRemoveElementMessage':
        case 'UpdateMapPlayersAgressableStatusMessage':
        case 'GameRolePlayShowActorMessageInteractiveUsedMessage':
        case 'InteractiveUsedMessage':
        case 'GameRolePlayShowActorMessage':
        case 'GameRolePlayDelayedObjectUseMessage':
        case 'GameRolePlayDelayedActionFinishedMessage':
        case 'PrismsListUpdateMessage':
        case 'BasicTimeMessage':
        case 'GameMapChangeOrientationMessage':
        case 'MapComplementaryInformationsDataMessage':
        case 'JobMultiCraftAvailableSkillsMessage':
        case 'ExchangeBidHouseInListUpdatedMessage':
        case 'CurrentMapMessage':
        case 'ListMapNpcsQuestStatusUpdateMessage':
        case 'GuildMemberOnlineStatusMessage':
          // ignore
          break

        // ChatServer
        case 'ChatServerMessage':
        case 'ChatServerWithObjectMessage':
          dispatchChatServer({ type: 'new_message', message: data.content })
          break;

        // Character
        case "CharacterSelectedSuccessMessage":
          dispatchCharacter({ type: 'character_changed', payload: data.content });
          break;
        case "QuestListMessage":
          dispatchCharacter({ type: 'quests_changed', payload: data.content });
          break;
        case "AchievementDetailedListMessage":
          dispatchCharacter({ type: 'achievements_changed', payload: data.content });
          break;

        // Breeding
        case "GameDataPaddockObjectAddMessage":
          dispatchPaddock({ type: 'object_changed', payload: data.content })
          break;
        case "ExchangeStartOkMountMessage":
          dispatchPaddock({ type: 'paddock_changed', payload: data.content })
          break;
        case "UpdateMountCharacteristicsMessage":
          dispatchPaddock({ type: 'mount_changed', payload: data.content })
          break;
        case "ExchangeMountsPaddockAddMessage":
          dispatchPaddock({ type: 'mounts_added', payload: data.content })
          break;
        case "ExchangeMountsPaddockRemoveMessage":
          dispatchPaddock({ type: 'mounts_removed', payload: data.content })
          break;
        case "GameDataPlayFarmObjectAnimationMessage": break; // useless message

        // Forgemagie
        case "ExchangeStartOkCraftWithInformationMessage": break; // open craft bench
        case "ExchangeObjectAddedMessage":
          console.log("socket-ExchangeObjectAddedMessage", data.content)
          dispatchForgemargie({ type: 'item_changed', payload: data.content })
          break;
        case "ExchangeCraftResultMagicWithObjectDescMessage":
          dispatchForgemargie({ type: 'rune_passed', payload: data.content })
          break;
      }
    })
  }, [])

  return (
    <SocketContext.Provider value={state}>
      {children}
    </SocketContext.Provider>
  )
}
