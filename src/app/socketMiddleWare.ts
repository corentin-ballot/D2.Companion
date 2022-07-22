import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { addMessage } from '../features/chat/chatSlice';
import { endFight, fightDommageAction, fightSpellCastAction, fightSummonAction, setFighters, setFightTurnList, setRound, startFight } from '../features/fights/fightsSlice';
import { setItems } from '../features/market/marketSlice';
import { setConnected, setConnecting } from '../features/socket/socketSlice';
import { ChatServerMessage, GameFightJoinMessage, GameFightTurnListMessage, GameFightSynchronizeMessage, GameFightNewRoundMessage, GameFightEndMessage, GameActionFightLifePointsLostMessage, GameActionFightMultipleSummonMessage, ExchangeTypesItemsExchangerDescriptionForUserMessage, GameActionFightSpellCastMessage } from './dofusInterfaces';

import { io } from 'socket.io-client';

const socketMiddleWare: Middleware = (store) => {
    console.log("socketMiddleware::connectingWebsocket");
    // const ws = new WebSocket("ws://localhost:3000");
    const socket = io('http://localhost:3000');

    socket.on("connect", () => {
        store.dispatch(setConnected(true));
        store.dispatch(setConnecting(false));
    });

    socket.on("close", () => {
        store.dispatch(setConnected(false));
    });

    socket.on("data", data => {
        switch (data.content.__name) {
            case undefined:
            case "BasicPingMessage":
            case "BasicPongMessage":
            case "BasicNoOperationMessage":
            case "BasicAckMessage":
            case "GameMapMovementMessage":
            case "GameMapMovementConfirmMessage":
                //ignore
                break;
            case "ChatServerMessage":
            case "ChatServerWithObjectMessage":
                store.dispatch(addMessage(data.content as ChatServerMessage)); break;

            /* Fights */
            case "GameFightJoinMessage":
                store.dispatch(startFight(data.content as GameFightJoinMessage));
                break;
            case "GameFightTurnListMessage":
                store.dispatch(setFightTurnList(data.content as GameFightTurnListMessage));
                break;
            case "GameFightSynchronizeMessage":
                store.dispatch(setFighters(data.content as GameFightSynchronizeMessage));
                break;
            case "RefreshCharacterStatsMessage":
                //store.dispatch(refreshFighter(data.content as RefreshCharacterStatsMessage)); 
                break;
            case "GameFightNewRoundMessage":
                store.dispatch(setRound(data.content as GameFightNewRoundMessage));
                break;
            case "GameFightEndMessage":
                store.dispatch(endFight(data.content as GameFightEndMessage));
                break;
            case "GameActionFightLifePointsLostMessage":
                store.dispatch(fightDommageAction(data.content as GameActionFightLifePointsLostMessage));
                break;
            case "GameActionFightSpellCastMessage":
                store.dispatch(fightSpellCastAction(data.content as GameActionFightSpellCastMessage));
                break;
            case "GameActionFightLifeAndShieldPointsLostMessage":
                store.dispatch(fightDommageAction({ ...data.content, loss: data.content.loss + data.content.shieldLoss } as GameActionFightLifePointsLostMessage));
                break;
            case "GameActionFightMultipleSummonMessage":
                store.dispatch(fightSummonAction(data.content as GameActionFightMultipleSummonMessage));
                break;

            /* Market */
            case "ExchangeStartedBidBuyerMessage":
                // Open HDV
                break;
            case "ExchangeTypesExchangerDescriptionForUserMessage":
                // Filter HDV
                break;
            case "ExchangeTypesItemsExchangerDescriptionForUserMessage":
                store.dispatch(setItems(data.content as ExchangeTypesItemsExchangerDescriptionForUserMessage))
                break;

            /* Default */
            default:
                console.log(data.content.__name, data.content);
        }
    });


    return (next) => (action: AnyAction) => {
        return next(action);
    };
}

export default socketMiddleWare;