import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import socketMiddleWare from './socketMiddleWare'
import chatReducer from '../features/chat/chatSlice';
import socketReducer from '../features/socket/socketSlice';
import fightsReducer from '../features/fights/fightsSlice';
import marketReducer from '../features/market/marketSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    socket: socketReducer,
    fights: fightsReducer,
    market: marketReducer,
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
