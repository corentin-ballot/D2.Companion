import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface authenticationState {
  authenticating: boolean;
  authenticated: boolean;
}

const initialState: authenticationState = {
  authenticating: false,
  authenticated: false,
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.authenticating = action.payload;
    },
  },
});

export const { setAuthenticated, setAuthenticating } = authenticationSlice.actions;

export const selectAuthentication = (state: RootState) => state.authentication as authenticationState;

export default authenticationSlice.reducer;
