import { useState, useEffect, createContext, ReactElement, useContext } from "react";
import { io } from 'socket.io-client';
import { ChatMessageDispatchContext, ChatMessageProvider } from "./ChatMessageContext";

export const SocketContext = createContext({
    connecting: true,
    connected: false,
});

interface SocketPrividerProps {
    children: ReactElement;
}

export const SocketProvider = ({ children }: SocketPrividerProps) => {
    const [state, setState] = useState({
        connecting: true,
        connected: false,
    });
    const dispatchChatMessage = useContext(ChatMessageDispatchContext);

    const socket = io('http://localhost:3960');

    socket.on("connect", () => {
        setState({
            connecting: false,
            connected: true,
        });
    });

    socket.on("close", () => {
        setState({
            connecting: false,
            connected: false,
        });
    });

    socket.on("data", (data: any) => {
        switch (data.content.__name) {
            case undefined:
            case "BasicPingMessage":
            case "BasicPongMessage":
            case "BasicNoOperationMessage":
            case "BasicAckMessage":
            case "GameMapMovementMessage":
            case "GameMapMovementConfirmMessage":
            case "GameContextRefreshEntityLookMessage":
            case "SetCharacterRestrictionsMessage":
            case "GameContextRemoveElementMessage":
            case "UpdateMapPlayersAgressableStatusMessage":
            case "GameRolePlayShowActorMessageInteractiveUsedMessage":
            case "InteractiveUsedMessage":
            case "GameRolePlayShowActorMessage":
            case "GameRolePlayDelayedObjectUseMessage":
            case "GameRolePlayDelayedActionFinishedMessage":
            case "PrismsListUpdateMessage":
            case "BasicTimeMessage":
            case "GameMapChangeOrientationMessage":
            case "MapComplementaryInformationsDataMessage":
            case "JobMultiCraftAvailableSkillsMessage":
            case "ExchangeBidHouseInListUpdatedMessage":
            case "CurrentMapMessage":
            case "ListMapNpcsQuestStatusUpdateMessage":
            case "GuildMemberOnlineStatusMessage":
                //ignore
                break;
            case "ChatServerMessage":
            case "ChatServerWithObjectMessage":
                dispatchChatMessage({ type: "message_added", message: data.content }); break;
        }
    });

    return (
        <SocketContext.Provider value={state}>
            <ChatMessageProvider>
                {children}
            </ChatMessageProvider>
        </SocketContext.Provider>
    )
};