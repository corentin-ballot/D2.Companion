import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { processMessage } from '../features/chat/chatSlice';
import { endFight, fightDommageAction, fightSpellCastAction, fightSummonAction, setFighters, setFightTurnList, setRound, startFight } from '../features/fights/fightsSlice';
import { setItems } from '../features/market/marketSlice';
import { processPaddockObjectAddMessage, processExchangeStartOkMountMessage, processUpdateMountCharacteristicsMessage, processExchangeMountsPaddockAddMessage, processExchangeMountsPaddockRemoveMessage } from '../features/breeding/breedingSlice';
import { setConnected, setConnecting } from '../features/socket/socketSlice';
import { ChatServerMessage, GameFightJoinMessage, GameFightTurnListMessage, GameFightSynchronizeMessage, GameFightNewRoundMessage, GameFightEndMessage, GameActionFightLifePointsLostMessage, GameActionFightMultipleSummonMessage, ExchangeTypesItemsExchangerDescriptionForUserMessage, GameActionFightSpellCastMessage, GameDataPaddockObjectAddMessage, ExchangeStartOkMountMessage, UpdateMountCharacteristicsMessage, ExchangeMountsPaddockAddMessage, ExchangeMountsPaddockRemoveMessage, QuestListMessage, ExchangeObjectAddedMessage, ExchangeCraftResultMagicWithObjectDescMessage, AchievementDetailedListMessage, HousePropertiesMessage, CharacterSelectedSuccessMessage, StorageInventoryContentMessage, TextInformationMessage, ExchangeOfflineSoldItemsMessage, ExchangeBidHouseUnsoldItemsMessage } from './dofusInterfaces';

import { io } from 'socket.io-client';
import { passRune, setItem } from '../features/forgemagie/forgemagieSlice';
import Notifications from './notifications';
import { processCharacterSelectedSuccessMessage, processAchievementDetailedListMessage, processQuestListMessage } from '../features/character/characterSlice';
import { processStorageInventoryContentMessage } from '../features/bank/bankSlice';
import { processTextInformationMessage, processExchangeOfflineSoldItemsMessage, processExchangeBidHouseUnsoldItemsMessage } from '../features/sales/salesSlice';

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
                store.dispatch(processMessage(data.content as ChatServerMessage)); break;

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

            /* Breeding */
            case "GameDataPlayFarmObjectAnimationMessage": break; // useless message
            case "GameDataPaddockObjectAddMessage":
                store.dispatch(processPaddockObjectAddMessage(data.content as GameDataPaddockObjectAddMessage));
                break;
            case "ExchangeStartOkMountMessage":
                store.dispatch(processExchangeStartOkMountMessage(data.content as ExchangeStartOkMountMessage));
                break;
            case "UpdateMountCharacteristicsMessage":
                store.dispatch(processUpdateMountCharacteristicsMessage(data.content as UpdateMountCharacteristicsMessage));
                break;
            case "ExchangeMountsPaddockAddMessage":
                store.dispatch(processExchangeMountsPaddockAddMessage(data.content as ExchangeMountsPaddockAddMessage));
                break;
            case "ExchangeMountsPaddockRemoveMessage":
                store.dispatch(processExchangeMountsPaddockRemoveMessage(data.content as ExchangeMountsPaddockRemoveMessage));
                break;

            /* Quests */
            case "QuestListMessage":
                store.dispatch(processQuestListMessage(data.content as QuestListMessage));
                break;

            /* Houses */
            case "HousePropertiesMessage":
                const d = data.content as HousePropertiesMessage;
                if (!d.properties.hasOwner && !d.properties.isSaleLocked && localStorage["notifications.houses.sellable"] === "true")
                    new Notifications("House on sale !").sendNative();
                break;
            /* Forgemagie */
            case "ExchangeStartOkCraftWithInformationMessage":
                // Start fm
                // { __name: "ExchangeStartOkCraftWithInformationMessage", __protocol_id: 4494, skillId: 166 }
                break;
            case "ExchangeObjectAddedMessage":
                store.dispatch(setItem(data.content as ExchangeObjectAddedMessage));
                break;
            // Item FM
            // {
            //   "__name": "ExchangeObjectAddedMessage",
            //   "__protocol_id": 8555,
            //   "remote": false,
            //   "object": {
            //     "__name": "ObjectItem",
            //     "__protocol_id": 4970,
            //     "position": 63,
            //     "objectGID": 7143,
            //     "effects": [
            //       {
            //         "__name": "ObjectEffectInteger",
            //         "__protocol_id": 5629,
            //         "actionId": 125,
            //         "value": 232
            //       },
            //       {
            //         "__name": "ObjectEffectInteger",
            //         "__protocol_id": 5629,
            //         "actionId": 174,
            //         "value": 41
            //       },
            //       {
            //         "__name": "ObjectEffectInteger",
            //         "__protocol_id": 5629,
            //         "actionId": 119,
            //         "value": 36
            //       },
            //       {
            //         "__name": "ObjectEffectInteger",
            //         "__protocol_id": 5629,
            //         "actionId": 118,
            //         "value": 35
            //       },
            //       {
            //         "__name": "ObjectEffectInteger",
            //         "__protocol_id": 5629,
            //         "actionId": 225,
            //         "value": 30
            //       },
            //       {
            //         "__name": "ObjectEffectInteger",
            //         "__protocol_id": 5629,
            //         "actionId": 138,
            //         "value": 16
            //       },
            //       {
            //         "__name": "ObjectEffectInteger",
            //         "__protocol_id": 5629,
            //         "actionId": 112,
            //         "value": 10
            //       }
            //     ],
            //     "objectUID": 909212473,
            //     "quantity": 1
            //   }
            // }

            case "ExchangeCraftResultMagicWithObjectDescMessage":
                store.dispatch(passRune(data.content as ExchangeCraftResultMagicWithObjectDescMessage));
                break;
            // rune
            // -34 vitalité, -3 initiative, -2 puissance, +reliquat
            // craftResult: 1, magicPoolStatus: 2 // Echec + reliquat
            // craftResult: 2, magicPoolStatus: 1 // Réussite
            // craftResult: 2, magicPoolStatus: 2 // Réussite + reliquat
            // craftResult: 2, magicPoolStatus: 3 // Réussite - reliquat
            // craftResult: 1, magicPoolStatus: 3 // Echec - reliquat

            // {
            //     "__name": "ExchangeCraftResultMagicWithObjectDescMessage",
            //     "__protocol_id": 8579,
            //     "craftResult": 1,
            //     "objectInfo": {
            //       "__name": "ObjectItemNotInContainer",
            //       "__protocol_id": 9381,
            //       "objectGID": 7143,
            //       "effects": [
            //         {
            //           "__name": "ObjectEffectInteger",
            //           "__protocol_id": 5629,
            //           "actionId": 125,
            //           "value": 198
            //         },
            //         {
            //           "__name": "ObjectEffectInteger",
            //           "__protocol_id": 5629,
            //           "actionId": 174,
            //           "value": 38
            //         },
            //         {
            //           "__name": "ObjectEffectInteger",
            //           "__protocol_id": 5629,
            //           "actionId": 119,
            //           "value": 36
            //         },
            //         {
            //           "__name": "ObjectEffectInteger",
            //           "__protocol_id": 5629,
            //           "actionId": 118,
            //           "value": 35
            //         },
            //         {
            //           "__name": "ObjectEffectInteger",
            //           "__protocol_id": 5629,
            //           "actionId": 225,
            //           "value": 30
            //         },
            //         {
            //           "__name": "ObjectEffectInteger",
            //           "__protocol_id": 5629,
            //           "actionId": 138,
            //           "value": 14
            //         },
            //         {
            //           "__name": "ObjectEffectInteger",
            //           "__protocol_id": 5629,
            //           "actionId": 112,
            //           "value": 10
            //         }
            //       ],
            //       "objectUID": 909212473,
            //       "quantity": 1
            //     },
            //     "magicPoolStatus": 2
            //   }


            /* Achievments */
            case "AchievementDetailedListMessage":
                store.dispatch(processAchievementDetailedListMessage(data.content as AchievementDetailedListMessage));
                break;

            /* Character */
            case "CharacterSelectedSuccessMessage":
                store.dispatch(processCharacterSelectedSuccessMessage(data.content as CharacterSelectedSuccessMessage));
                break;

            /* Bank */
            case "StorageInventoryContentMessage":
                store.dispatch(processStorageInventoryContentMessage(data.content as StorageInventoryContentMessage));
                break;

            /* Sales */
            case "TextInformationMessage":
                console.log(data.content.__name, data.content)
                store.dispatch(processTextInformationMessage(data.content as TextInformationMessage));
                break;
            case "ExchangeOfflineSoldItemsMessage":
                store.dispatch(processExchangeOfflineSoldItemsMessage(data.content as ExchangeOfflineSoldItemsMessage));
                break;
            case "ExchangeBidHouseUnsoldItemsMessage":
                store.dispatch(processExchangeBidHouseUnsoldItemsMessage(data.content as ExchangeBidHouseUnsoldItemsMessage));
                break;

            /* Default */
            default:
                console.log(data.content.__name, data.content)
                break;
        }
    });


    return (next) => (action: AnyAction) => {
        return next(action);
    };
}

export default socketMiddleWare;