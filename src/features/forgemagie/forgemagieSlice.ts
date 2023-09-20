import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ObjectInfo, ExchangeObjectAddedMessage, ExchangeCraftResultMagicWithObjectDescMessage } from '../../app/dofusInterfaces';
import { RootState } from '../../app/store';
import { equipmentStats } from '../../app/equipmentStats';
import runesForgemagie from '../../data/runes-forgemagie.json';

const runeIds = [27496, 27495, 27494, 27493, 17275, 17274, 17273, 17272, 19342,19341,19340,19339,19338,19337,18724,18723,18722,18721,18720,18719,11666,11665,11664,11663,11662,11661,11660,11659,11658,11657,11656,11655,11654,11653,11652,11651,11650,11649,11648,11647,11646,11645,11644,11643,11642,11641,11640,11639,11638,11637,10662,10619,10618,10616,10615,10613,10057,7560,7508,7460,7459,7458,7457,7456,7455,7454,7453,7452,7451,7450,7449,7448,7447,7446,7445,7444,7443,7442,7438,7437,7436,7435,7434,7433,1558,1557,1556,1555,1554,1553,1552,1551,1550,1549,1548,1547,1546,1545,1525,1524,1523,1522,1521,1519];

export interface Effect {
    _id: string;
    from: number;
    to: number;
    characteristic: number;
    category: number;
    elementId: number;
}

export interface PossibleEffect {
    _id: string;
    targetMask: string;
    diceNum: number;
    visibleInBuffUi: boolean;
    baseEffectId: number;
    visibleInFightLog: boolean;
    targetId: number;
    effectElement: number;
    effectUid: number;
    dispellable: number;
    triggers: string;
    spellId: number;
    duration: number;
    random: number;
    effectId: number;
    delay: number;
    diceSide: number;
    visibleOnTerrain: boolean;
    visibleInTooltip: boolean;
    rawZone: string;
    forClientOnly: boolean;
    value: number;
    order: number;
    group: number;
}

export interface Rune {
    _id: number;
    name: string;
    level: number;
    iconId: number;
    effects: Effect[];
    possibleEffects: PossibleEffect[];
    img: string;
    density?: number;
}

interface Item extends ObjectInfo {
    history: ExchangeCraftResultMagicWithObjectDescMessage[];
    magicPool: number;
}

interface forgemagieState {
    item: Item | null;
    lastRune: Rune | undefined; 
}
// -34 vitalité, -3 initiative, -2 puissance, +reliquat
const initialState: forgemagieState = {
    item: null,
    lastRune: undefined
};

export const forgemagieSlice = createSlice({
    name: 'forgemagie',
    initialState,
    reducers: {
        setItem: (state, action: PayloadAction<ExchangeObjectAddedMessage>) => {
            if (state.item && state.item.objectUID === action.payload.object.objectUID) {
                // take back item
                state.item = { ...state.item, ...action.payload.object };
            } else if(runeIds.includes(action.payload.object.objectGID)) {
                const rune = runesForgemagie.find(r => r._id === action.payload.object.objectGID) as Rune;
                const statDensity = typeof rune !== "undefined" ? (equipmentStats.get(rune?.possibleEffects[0].effectId)?.density || 0) : 0;
                const density = typeof rune !== "undefined" ? (statDensity * rune?.possibleEffects[0].diceNum) : 0;
                // add rune
                state.lastRune = {...rune, density: density};
            } else {
                // new item
                state.item = { ...action.payload.object, history: [], magicPool: 0 };
            }
        },
        passRune: (state, action: PayloadAction<ExchangeCraftResultMagicWithObjectDescMessage>) => {
            if (state.item) {
                const effectIds = Array.from(new Set([...action.payload.objectInfo.effects.map(effect => effect.actionId), ...state.item?.effects.map(effect => effect.actionId)]));

                const result = effectIds.map(effectId => {
                    const effectFrom = state.item?.effects.find(e => e.actionId === effectId);
                    const effectTo = action.payload.objectInfo.effects.find(e => e.actionId === effectId);
                    if(typeof effectFrom === "undefined" && typeof effectTo === "undefined") console.error("Unknow effectId", effectId);
                    const effect = {...effectFrom, ...effectTo} as {effect: number, actionId: number};
                    
                    return { ...effect, value: (effectTo ? effectTo.value : 0) - (effectFrom ? effectFrom.value : 0) };
                }).filter(effect => effect.value !== 0);
                
                if(action.payload.magicPoolStatus === 2 || action.payload.magicPoolStatus === 3) { 
                    if(action.payload.craftResult === 1 && state.lastRune) {
                        const density = equipmentStats.get(state.lastRune.possibleEffects[0].effectId)?.density;
                        if(density) {
                            state.item.magicPool -= state.lastRune.density || 0;
                        }
                    }

                    const resultDensity = result.reduce((prev, curr) => {
                        const density = equipmentStats.get(curr.actionId)?.density;
                        return prev + curr.value * (typeof density !== "undefined" ? density : 0);
                    }, 0);

                    state.item.magicPool += -1 * resultDensity;
                }

                // Floor 2 decimals
                state.item.magicPool = Math.floor(state.item.magicPool * 100) / 100

                state.item.history = [...state.item.history, {...action.payload, objectInfo: {...action.payload.objectInfo, effects: result}}];
                state.item.effects = [...action.payload.objectInfo.effects];
            } else {
                console.error("No item provided.");
            }
        },
    }
});

export const { setItem, passRune } = forgemagieSlice.actions;

export const selectItem = (state: RootState) => state.forgemagie.item;

export default forgemagieSlice.reducer;
