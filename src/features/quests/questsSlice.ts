import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { QuestListMessage, ActiveQuest } from '../../app/dofusInterfaces';

interface QuestsState {
  finishedQuestsIds: number[];
  finishedQuestsCounts: number[];
  activeQuests: ActiveQuest[];
  activeQuestsIds: number[];
  reinitDoneQuestsIds: number[];
};

const initialState:QuestsState = {
  finishedQuestsIds: JSON.parse(localStorage.getItem("quests.finishedQuestsIds") || "[]"),
  finishedQuestsCounts: JSON.parse(localStorage.getItem("quests.finishedQuestsCounts") || "[]"),
  activeQuests: JSON.parse(localStorage.getItem("quests.activeQuests") || "[]"),
  activeQuestsIds: JSON.parse(localStorage.getItem("quests.activeQuestsIds") || "[]"),
  reinitDoneQuestsIds: JSON.parse(localStorage.getItem("quests.reinitDoneQuestsIds") || "[]"),
};

export const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    processQuestListMessage: (state, action: PayloadAction<QuestListMessage>) => {
      state = {
        finishedQuestsIds: action.payload.finishedQuestsIds,
        finishedQuestsCounts: action.payload.finishedQuestsCounts,
        activeQuests: action.payload.activeQuests,
        activeQuestsIds: action.payload.activeQuests.map(q => q.questId),
        reinitDoneQuestsIds: action.payload.reinitDoneQuestsIds,
      };

      localStorage.setItem("quests.finishedQuestsIds", JSON.stringify(state.finishedQuestsIds));
      localStorage.setItem("quests.finishedQuestsCounts", JSON.stringify(state.finishedQuestsCounts));
      localStorage.setItem("quests.activeQuests", JSON.stringify(state.activeQuests));
      localStorage.setItem("quests.activeQuestsIds", JSON.stringify(state.activeQuestsIds));
      localStorage.setItem("quests.reinitDoneQuestsIds", JSON.stringify(state.reinitDoneQuestsIds));
    },
  },
});

export const { processQuestListMessage } = questsSlice.actions;

export const selectFinishedQuestsIds = (state: RootState) => state.quests.finishedQuestsIds;
export const selectFinishedQuestsCounts = (state: RootState) => state.quests.finishedQuestsCounts;
export const selectActiveQuests = (state: RootState) => state.quests.activeQuests;
export const selectActiveQuestsIds = (state: RootState) => state.quests.activeQuestsIds;
export const selectReinitDoneQuestsIds = (state: RootState) => state.quests.reinitDoneQuestsIds;

export default questsSlice.reducer;
