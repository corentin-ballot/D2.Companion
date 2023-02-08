import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AchievementDetailedListMessage } from '../../app/dofusInterfaces';

interface AchievementsState {
  finishedAchievements: number[];
};

const initialState:AchievementsState = {
  finishedAchievements: JSON.parse(localStorage.getItem("achievements.finishedAchievements") || "[]"),
};

export const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    processAchievementDetailedListMessage: (state, action: PayloadAction<AchievementDetailedListMessage>) => {
      state.finishedAchievements = Array.from(new Set([...state.finishedAchievements, ...action.payload.finishedAchievements.map((a) => a.id)]));

      localStorage.setItem("achievements.finishedAchievements", JSON.stringify(state.finishedAchievements));
    },
  },
});

export const { processAchievementDetailedListMessage } = achievementsSlice.actions;

export const selectFinishedAchievements = (state: RootState) => state.achievements.finishedAchievements;

export default achievementsSlice.reducer;
