import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { BoostToUpdateType, ExchangeMountsPaddockAddMessage, ExchangeMountsPaddockRemoveMessage, ExchangeStartOkMountMessage, GameDataPaddockObjectAddMessage, MountsDescription, UpdateMountCharacteristicsMessage } from '../../app/dofusInterfaces';

interface Notification {
  enable: boolean,
  limit: number,
}

interface Notifications {
  serenity: Notification,
  love: Notification,
  stamina: Notification,
  maturity: Notification,
  energy: Notification,
  boostLimiter: Notification,
}

export interface breedingState {
  paddockedMounts: MountsDescription[],
  notifications: Notifications,
}

const initialState: breedingState = {
  paddockedMounts: [],
  notifications: {
    serenity: { enable:false, limit:1500 },
    love:{ enable:false, limit:7500 },
    stamina:{ enable:false, limit:7500 },
    maturity:{ enable:false, limit:10000 },
    energy:{ enable:false, limit:5000 },
    boostLimiter:{ enable:false, limit:240 },
    ...JSON.parse(localStorage.getItem("breeding.notifications") || "{}")
  }
};

export const breedingSlice = createSlice({
  name: 'breeding',
  initialState,
  reducers: {
    processPaddockObjectAddMessage: (state, action: PayloadAction<GameDataPaddockObjectAddMessage>) => {
      const durability = action.payload.paddockItemDescription.durability.durability;
      if(durability === 0) {
        const message = `Paddock item reach ${action.payload.paddockItemDescription.durability.durability} durability`;
        if (Notification.permission === 'granted') {
          // Si tout va bien, créons une notification
          new Notification(message);
        }
      }
    },
    processExchangeStartOkMountMessage: (state, action: PayloadAction<ExchangeStartOkMountMessage>) => {
      state.paddockedMounts = action.payload.paddockedMountsDescription;
    },
    processUpdateMountCharacteristicsMessage: (state, action: PayloadAction<UpdateMountCharacteristicsMessage>) => {
      const mount = state.paddockedMounts.find(mount => mount.id === action.payload.rideId);
      
      let boosts:any = {};
      action.payload.boostToUpdateList.forEach((boost) => {
        // @ts-ignore
        boost.oldValue = mount[BoostToUpdateType[boost.type]];
        boosts[BoostToUpdateType[boost.type]] = boost.value;
      });
      state.paddockedMounts = state.paddockedMounts.map(m => m.id === action.payload.rideId ? {...m, ...boosts} : m);

      const serenityBoost = action.payload.boostToUpdateList.find(boost => boost.type === BoostToUpdateType.serenity);
      if(state.notifications.serenity.enable && typeof serenityBoost !== "undefined") {
        // @ts-ignore Female
        if(mount?.sex && ((serenityBoost.value > serenityBoost.oldValue && serenityBoost.value > 0) || (serenityBoost.value < serenityBoost.oldValue && serenityBoost.value < -state.notifications.serenity.limit))) {
          if (Notification.permission === 'granted') new Notification(`A mount reached serenity limit.`);
        }
        // @ts-ignore Male
        else if (!mount?.sex && ((serenityBoost.value < serenityBoost.oldValue && serenityBoost.value < 0) || (serenityBoost.value > serenityBoost.oldValue && serenityBoost.value > state.notifications.serenity.limit))){
          if (Notification.permission === 'granted') new Notification(`A mount reached serenity limit.`);
        }
      }

      if(state.notifications.energy.enable && action.payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.energy && boost.value >= state.notifications.energy.limit).length > 0) {
        if (Notification.permission === 'granted') new Notification(`A mount reached energy limit.`);
      }

      if(state.notifications.love.enable && action.payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.love && boost.value >= state.notifications.love.limit).length > 0) {
        if (Notification.permission === 'granted') new Notification(`A mount reached love limit.`);
      }

      if(state.notifications.stamina.enable && action.payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.stamina && boost.value >= state.notifications.stamina.limit).length > 0) {
        if (Notification.permission === 'granted') new Notification(`A mount reached stamina limit.`);
      }

      if(state.notifications.maturity.enable && action.payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.maturity && boost.value >= state.notifications.maturity.limit).length > 0) {
        if (Notification.permission === 'granted') new Notification(`A mount reached maturity limit.`);
      }

      if(state.notifications.boostLimiter.enable && action.payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.boostLimiter && boost.value >= state.notifications.boostLimiter.limit).length > 0) {
        if (Notification.permission === 'granted') new Notification(`A mount reached tiredness limit.`);
      }
    },
    processExchangeMountsPaddockAddMessage: (state, action: PayloadAction<ExchangeMountsPaddockAddMessage>) => {
      state.paddockedMounts = [...state.paddockedMounts, ...action.payload.mountDescription];
    },
    processExchangeMountsPaddockRemoveMessage: (state, action: PayloadAction<ExchangeMountsPaddockRemoveMessage>) => {
      state.paddockedMounts = state.paddockedMounts.filter(mount => !action.payload.mountsId.includes(mount.id));
    },
    updateNotifications: (state, action: PayloadAction<Notifications>) => {
      localStorage.setItem('breeding.notifications', JSON.stringify(action.payload));
      state.notifications = action.payload;
    }
  },
});

export const { 
  processPaddockObjectAddMessage, 
  processExchangeStartOkMountMessage, 
  processUpdateMountCharacteristicsMessage, 
  processExchangeMountsPaddockAddMessage,
  processExchangeMountsPaddockRemoveMessage,
  updateNotifications,
} = breedingSlice.actions;

export const selectPaddockedMounts = (state: RootState) => state.breeding.paddockedMounts;
export const selectNotifications = (state: RootState) => state.breeding.notifications;

export default breedingSlice.reducer;
