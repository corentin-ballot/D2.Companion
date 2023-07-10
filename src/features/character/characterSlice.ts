import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AchievementDetailedListMessage, CharacterSelectedSuccessMessage, QuestListMessage } from '../../app/dofusInterfaces';

export interface characterState {
    id: number;
    name: string;
    breed: number;
    level: number;
    sex: boolean;
    achievements: {
        finished: number[];
    };
    quests: {
        finished: number[];
        active: number[];
        reinit: number[];
    };
}

const initialState: characterState = {
    id: 28103409959, // Co-mmotion
    name: "MissingNo.",
    breed: 1,
    level: 0,
    sex: false,
    achievements: { 
        finished: [],
    },
    quests: {
        finished: [],
        active: [],
        reinit: [],
    },
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    processCharacterSelectedSuccessMessage: (state, action: PayloadAction<CharacterSelectedSuccessMessage>) => {
        state.id = action.payload.infos.id;
        state.name = action.payload.infos.name;
        state.breed = action.payload.infos.breed;
        state.level = action.payload.infos.level;
        state.sex = action.payload.infos.sex;

        state.achievements = { 
            finished: JSON.parse(localStorage.getItem(`achievements.${action.payload.infos.id}.finished`) || "[]"),
        }

        state.quests = {
            finished: JSON.parse(localStorage.getItem(`quests.${action.payload.infos.id}.finished`) || "[]"),
            active: JSON.parse(localStorage.getItem(`quests.${action.payload.infos.id}.active`) || "[]"),
            reinit: JSON.parse(localStorage.getItem(`quests.${action.payload.infos.id}.reinit`) || "[]"),
        }
    },
    processQuestListMessage: (state, action: PayloadAction<QuestListMessage>) => {
        state = {
            ...state,
            quests: {
                finished: action.payload.finishedQuestsIds,
                active: action.payload.activeQuests.map(q => q.questId),
                reinit: action.payload.reinitDoneQuestsIds,
            }
        };
  
        localStorage.setItem(`quests.${state.id}.finished`, JSON.stringify(action.payload.finishedQuestsIds));
        localStorage.setItem(`quests.${state.id}.active`, JSON.stringify(action.payload.activeQuests.map(q => q.questId)));
        localStorage.setItem(`quests.${state.id}.reinit`, JSON.stringify(action.payload.reinitDoneQuestsIds));
    },
    processAchievementDetailedListMessage: (state, action: PayloadAction<AchievementDetailedListMessage>) => {
        state.achievements.finished = Array.from(new Set([...state.achievements.finished, ...action.payload.finishedAchievements.map((a) => a.id)]));
  
        localStorage.setItem(`achievements.${state.id}.finished`, JSON.stringify(state.achievements.finished));
      },
  },
});

export const { processCharacterSelectedSuccessMessage, processQuestListMessage, processAchievementDetailedListMessage } = characterSlice.actions;

export const selectFinishedAchievements = (state: RootState) => state.character.achievements.finished;
export const selectFinishedQuests = (state: RootState) => state.character.quests.finished;
export const selectReinitDoneQuests = (state: RootState) => state.character.quests.reinit;
export const selectActiveQuests = (state: RootState) => state.character.quests.active;
export const selectCharacter = (state: RootState) => state.character;

export default characterSlice.reducer;
