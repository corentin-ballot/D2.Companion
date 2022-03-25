import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Fighter as DFighter, GameFightEndMessage, GameFightJoinMessage, GameFightNewRoundMessage, GameFightSynchronizeMessage, GameFightTurnListMessage, GameActionFightMultipleSummonMessage, GameActionFightLifePointsLostMessage } from '../../app/dofusInterfaces';
import monsters from '../../data/monsters.json';

export interface Dommage extends GameActionFightLifePointsLostMessage {
  round: number;
}

interface Fighter extends DFighter {
}

export interface fight {
  startTime: number;
  endTime: number;
  duration: number;
  fighters: Fighter[];
  turnList: number[];
  dommages: Dommage[],
  round: number;
}

export interface fightsState {
  currentFight: fight;
  history: fight[];
}

const fightModel = {
  startTime: -1,
  endTime: -1,
  duration: -1,
  fighters: [],
  turnList: [],
  dommages: [],
  round: -1,
}

const initialState: fightsState = {
  currentFight: { ...fightModel },
  history: [],
};

export const fightsSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {
    startFight: (state, action: PayloadAction<GameFightJoinMessage>) => {
      // initialise state.currentFight
      state.currentFight = { ...fightModel, round: 0, startTime: Date.now() }
    },
    endFight: (state, action: PayloadAction<GameFightEndMessage>) => {
      state.currentFight.duration = action.payload.duration;
      state.currentFight.endTime = Date.now();

      state.history = [...state.history, state.currentFight];
      state.currentFight = { ...fightModel };
    },
    setFightTurnList: (state, action: PayloadAction<GameFightTurnListMessage>) => {
      state.currentFight.turnList = action.payload.ids;
    },
    setFighters: (state, action: PayloadAction<GameFightSynchronizeMessage>) => {
      state.currentFight.fighters = action.payload.fighters.map(f => {
        if (f.creatureGenericId) {
          const monster = monsters.find(m => m.Id === f.creatureGenericId);
          const name = monster ? monster.Name : "Unknown";
          return { ...f, name: name, dommages: { recv: [], deal: [] } }
        } else {
          return { ...f, dommages: { recv: [], deal: [] } }
        }
      });
    },
    setRound: (state, action: PayloadAction<GameFightNewRoundMessage>) => {
      state.currentFight.round = action.payload.roundNumber;
    },
    fightDommageAction: (state, action: PayloadAction<GameActionFightLifePointsLostMessage>) => {
      state.currentFight.dommages = [...state.currentFight.dommages, { ...action.payload, round: state.currentFight.round }]
      // Add dommage line for summoners
      const fighter = state.currentFight.fighters.find(f => f.contextualId === action.payload.sourceId);
      if (fighter?.stats.summoned) {
        // @ts-ignore fighter.stats.summoner is difined in this statement
        state.currentFight.dommages = [...state.currentFight.dommages, { ...action.payload, round: state.currentFight.round, sourceId: fighter.stats.summoner, elementId: 9 }]
      }
    },
    fightSummonAction: (state, action: PayloadAction<GameActionFightMultipleSummonMessage>) => {
      const monster = monsters.find(m => m.Id === action.payload.summons[0].spawnInformation.creatureGenericId);
      const summoner = state.currentFight.fighters.find(f => f.contextualId === action.payload.summons[0].stats.summoner);
      const name = monster ? monster.Name : "Unknown";

      const summonedFighter: Fighter = {
        contextualId: action.payload.summons[0].summons[0].informations.contextualId,
        creatureGenericId: action.payload.summons[0].spawnInformation.creatureGenericId,
        name: name + " de " + (summoner ? summoner.name : action.payload.summons[0].stats.summoner),
        stats: action.payload.summons[0].stats,
      }
      state.currentFight.fighters = [...state.currentFight.fighters, summonedFighter]
    },
  }
});

export const { startFight, endFight, setFightTurnList, setFighters, setRound, fightDommageAction, fightSummonAction } = fightsSlice.actions;

export const selectHistory = (state: RootState) => state.fights.history as fight[];
export const selectCurrent = (state: RootState) => state.fights.currentFight as fight;

export default fightsSlice.reducer;
