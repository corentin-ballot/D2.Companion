import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import socketMiddleWare from './socketMiddleWare'
import chatReducer from '../features/chat/chatSlice';
import socketReducer from '../features/socket/socketSlice';
import fightsReducer from '../features/fights/fightsSlice';
import marketReducer from '../features/market/marketSlice';
import breedingReducer from '../features/breeding/breedingSlice';
import forgemagieReducer from '../features/forgemagie/forgemagieSlice';
import characterReducer from '../features/character/characterSlice';
import bankReducer from '../features/bank/bankSlice';
import salesReducer from '../features/sales/salesSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    socket: socketReducer,
    fights: fightsReducer,
    market: marketReducer,
    breeding: breedingReducer,
    forgemagie: forgemagieReducer,
    character: characterReducer,
    bank: bankReducer,
    sales: salesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleWare)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
