import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { addMessage } from '../features/chat/chatSlice';
import { endFight, fightDommageAction, fightSummonAction, setFighters, setFightTurnList, setRound, startFight } from '../features/fights/fightsSlice';
import { setConnected, setConnecting } from '../features/socket/socketSlice';
import { ChatServerMessage, GameFightJoinMessage, GameFightTurnListMessage, GameFightSynchronizeMessage, GameFightNewRoundMessage, GameFightEndMessage, GameActionFightLifePointsLostMessage, GameActionFightMultipleSummonMessage } from './dofusInterfaces';

const socketMiddleWare: Middleware = (store) => {
    console.log("socketMiddleware::connectingWebsocket");
    const ws = new WebSocket("ws://localhost:9999");

    ws.onopen = () => {
        store.dispatch(setConnected(true));
        store.dispatch(setConnecting(false));
    };

    ws.onmessage = (event: { data: string }) => {
        const data = JSON.parse(event.data);
        switch (data._) {
            case "GameContextRemoveElementMessage":
            case "GameRolePlayShowActorMessage":
            case "UpdateMapPlayersAgressableStatusMessage":
            case "SetCharacterRestrictionsMessage":
            case "GameContextRefreshEntityLookMessage":
            case "SequenceNumberRequestMessage":
            case "BasicLatencyStatsRequestMessage":
            case "BasicNoOperationMessage":
            case "GameMapMovementMessage":
            case "GuildMemberOnlineStatusMessage":
            case "StatedElementUpdatedMessage": // ex : repop ressources sur la map
            case "MapComplementaryInformationsDataMessage": // ex : liste des ressources sur la map
            case "BasicPongMessage":
            case "HousePropertiesMessage":
            case "PrismsListMessage":
            case "PrismsListUpdateMessage":
            case "ListMapNpcsQuestStatusUpdateMessage":
            case "LifePointsRegenBeginMessage":
            case "LifePointsRegenEndMessage":
            case "GameContextCreateMessage":
            case "GameActionFightPointsVariationMessage":
            case "GameActionFightMarkCellsMessage":
            case "GameActionFightActivateGlyphTrapMessage":
            case "GameActionFightDeathMessage":
            case "GameActionFightDispellSpellMessage":
            case "GameActionFightDispellSpellMessage":
            case "GameContextDestroyMessage":
            case "CharacterExperienceGainMessage": // XP Gagné
            case "InventoryWeightMessage": // Maj pods
            case "ObjectQuantityMessage": // New ressource (drop)
            case "ObjectAddedMessage": // New equipment (drop)
            case "ChallengeResultMessage":
            case "GameFightTurnReadyRequestMessage":
            case "SequenceEndMessage":
            case "GameMapChangeOrientationMessage":
            case "MountSetMessage":
            case "CharacterStatsListMessage":
            case "SequenceStartMessage":
            case "GameFightTurnStartPlayingMessage":
            case "GameActionUpdateEffectTriggerCountMessage":
            case "GameFightTurnStartMessage":
            case "GameFightTurnEndMessage":
            case "ChallengeInfoMessage": // Challenge xp/drop bonus
            case "GameEntitiesDispositionMessage": // Players (id only) list
            case "GameFightHumanReadyStateMessage":
            case "GameFightShowFighterMessage":
            case "GameFightUpdateTeamMessage":
            case "GameFightStartMessage":
            case "ChallengeTargetUpdateMessage":
            case "ChallengeTargetsListMessage":
            case "GameActionFightSpellCastMessage":
            case "GameActionFightDispellableEffectMessage":
            case "IdolFightPreparationUpdateMessage":
            case "UpdateLifePointsMessage":
            case "GameFightOptionStateUpdateMessage":
            case "GameFightPlacementPossiblePositionsMessage": // possible fight positions
            case "GameFightStartingMessage":
            case "InteractiveElementUpdatedMessage":
            case "BasicTimeMessage":
            case "CurrentMapMessage":
            case "TextInformationMessage":
            case "GuildInformationsGeneralMessage":
            case "AnomalyStateMessage":
            case "GuildRanksMessage":
            case "GameActionFightDispellEffectMessage":
                break; //ignore
            
            case "ExchangeStartedBidBuyerMessage":
                console.log("Open HDV");
                break;
            case "ExchangeTypesExchangerDescriptionForUserMessage":
                console.log("Filter HDV");
                break;
            case "ExchangeTypesItemsExchangerDescriptionForUserMessage":
                console.log("Select item in HDV", data.content);
                break;
            /**
             * Fights
             */
            case "GameFightJoinMessage":
                store.dispatch(startFight(data as GameFightJoinMessage));
                break;
            case "GameFightTurnListMessage":
                store.dispatch(setFightTurnList(data as GameFightTurnListMessage));
                break;
            case "GameFightSynchronizeMessage":
                store.dispatch(setFighters(data as GameFightSynchronizeMessage));
                break;
            case "RefreshCharacterStatsMessage":
                // store.dispatch(refreshFighter(data as RefreshCharacterStatsMessage)); 
                break;
            case "GameFightNewRoundMessage":
                store.dispatch(setRound(data as GameFightNewRoundMessage));
                break;
            case "GameFightEndMessage":
                // console.log("GameFightEndMessage", data);
                store.dispatch(endFight(data as GameFightEndMessage));
                break;
            case "GameActionFightLifePointsLostMessage":
                store.dispatch(fightDommageAction(data as GameActionFightLifePointsLostMessage));
                break;
            case "GameActionFightLifeAndShieldPointsLostMessage":
                store.dispatch(fightDommageAction({ ...data, loss: data.loss + data.shieldLoss } as GameActionFightLifePointsLostMessage));
                break;
            case "GameActionFightMultipleSummonMessage":
                store.dispatch(fightSummonAction(data as GameActionFightMultipleSummonMessage));
                break;
            /**
             * Chat
             */
            case "ChatServerMessage":
            case "ChatServerWithObjectMessage":
                // @ts-ignore
                store.dispatch(addMessage(data as ChatServerMessage)); break;
            default:
                console.log("Not handled : ", data)
        }
    };

    ws.onclose = () => {
        store.dispatch(setConnected(false));
    };


    return (next) => (action: AnyAction) => {
        // console.log("socketMiddleware::action.type::" + action.type);

        // Check the action type, and if it's something we configured to send to the
        // server, send the action's payload.
        if (["socket/send"].includes(action.type)) {
            ws.send(action.payload);
        }

        // Don't forget to call next()!
        return next(action);
    };
}

export default socketMiddleWare;