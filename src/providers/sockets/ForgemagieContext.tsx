import React, { useContext, createContext, useReducer } from 'react'
import useDofusItems, { Item } from '../../hooks/dofus-data/useDofusItems';
import useDofusEffects, { Effect } from '../../hooks/dofus-data/useDofusEffects';

export interface ObjectEffect {
    actionId: number;
    value: number;
}

export interface Object {
    position?: number;
    objectGID: number;
    effects: ObjectEffect[];
    objectUID: number;
    quantity: number;
}

export interface ExchangeCraftResultMagicWithObjectDescMessage {
    craftResult: number;
    objectInfo: Object;
    magicPoolStatus: number;
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

interface ForgemagieItem extends Object {
    history: ExchangeCraftResultMagicWithObjectDescMessage[];
    magicPool: number;
}

export interface Rune extends Item {
    density?: number;
}

interface ForgemagieState {
    itemInfos: ForgemagieItem | null;
    lastRune: Rune | null;
}

const initialState: ForgemagieState = {
    itemInfos: null,
    lastRune: null
}

const ForgemagieContext = createContext<ForgemagieState>(initialState)
export const useForgemagie = (): ForgemagieState => useContext(ForgemagieContext)

const ForgemagieDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useForgemagieDispatch = (): React.Dispatch<any> => useContext(ForgemagieDispatchContext)

const runeIds = [27496, 27495, 27494, 27493, 17275, 17274, 17273, 17272, 19342, 19341, 19340, 19339, 19338, 19337, 18724, 18723, 18722, 18721, 18720, 18719, 11666, 11665, 11664, 11663, 11662, 11661, 11660, 11659, 11658, 11657, 11656, 11655, 11654, 11653, 11652, 11651, 11650, 11649, 11648, 11647, 11646, 11645, 11644, 11643, 11642, 11641, 11640, 11639, 11638, 11637, 10662, 10619, 10618, 10616, 10615, 10613, 10057, 7560, 7508, 7460, 7459, 7458, 7457, 7456, 7455, 7454, 7453, 7452, 7451, 7450, 7449, 7448, 7447, 7446, 7445, 7444, 7443, 7442, 7438, 7437, 7436, 7435, 7434, 7433, 1558, 1557, 1556, 1555, 1554, 1553, 1552, 1551, 1550, 1549, 1548, 1547, 1546, 1545, 1525, 1524, 1523, 1522, 1521, 1519];

const reducer = (items: Item[] | undefined, effects: Effect[] | undefined) => (state: ForgemagieState, action: { type: string, payload: any }): ForgemagieState => {
    switch (action.type) {
        case 'item_changed': {
            // take back item
            if (state.itemInfos && state.itemInfos.objectUID === action.payload.object.objectUID) {
                return {
                    ...state,
                    itemInfos: { ...state.itemInfos, ...action.payload.object }
                }
            }

            // add rune
            if (runeIds.includes(action.payload.object.objectGID)) {
                const rune = items?.find(r => r.id === action.payload.object.objectGID);
                const effect = effects?.find(e => e.id === rune?.possibleEffects[0].effectId);
                const density = (effect?.effectPowerRate ?? 0) * (rune?.possibleEffects[0].diceNum ?? 0);
                return {
                    ...state,
                    lastRune: rune ? { ...rune, density } : null
                }
            }

            // new item
            return {
                itemInfos: { ...action.payload.object, history: [], magicPool: 0 },
                lastRune: null
            }
        }
        case 'rune_passed': {
            if (!state.itemInfos) throw Error("No item provided.");
            
            const effectIds = Array.from(new Set([
                ...action.payload.objectInfo.effects.map((effect: { actionId: number; }) => effect.actionId), 
                ...state.itemInfos.effects.map((effect) => effect.actionId)
            ]));

            const result = effectIds.map(effectId => {
                const effectFrom = state.itemInfos?.effects.find((e: { actionId: number; }) => e.actionId === effectId);
                const effectTo = action.payload.objectInfo.effects.find((e: { actionId: any; }) => e.actionId === effectId);
                if(typeof effectFrom === "undefined" && typeof effectTo === "undefined") throw Error("Unknow effectId", effectId);
                const effect = {...effectFrom, ...effectTo} as {effect: number, actionId: number};
                
                return { ...effect, value: (effectTo ? effectTo.value : 0) - (effectFrom ? effectFrom.value : 0) };
            }).filter(effect => effect.value !== 0);
            
            const lastRuneDensity = effects?.find(e => e.id === state.lastRune?.possibleEffects[0].effectId)?.effectPowerRate;
            const resultDensity = result.reduce((prev, curr) => {
                const density = effects?.find(e => e.id === curr.actionId)?.effectPowerRate;
                return prev + curr.value * (density ?? 0);
            }, 0);

            if(action.payload.magicPoolStatus === 2) {
                // +reliquat
                return {
                    ...state,
                    itemInfos: {
                        ...state.itemInfos,
                        effects: [...action.payload.objectInfo.effects],
                        magicPool: Math.floor(state.itemInfos.magicPool - (lastRuneDensity ?? 0) + resultDensity),
                        history: [...state.itemInfos.history, {...action.payload, objectInfo: {...action.payload.objectInfo, effects: result}}]
                    }
                }
            }

            if(action.payload.magicPoolStatus === 3) {
                // -reliquat
                return {
                    ...state,
                    itemInfos: {
                        ...state.itemInfos,
                        effects: [...action.payload.objectInfo.effects],
                        magicPool: Math.floor(state.itemInfos.magicPool - (lastRuneDensity ?? 0)),
                        history: [...state.itemInfos.history, {...action.payload, objectInfo: {...action.payload.objectInfo, effects: result}}]
                    }
                }
            }

            return {
                ...state,
                itemInfos: {
                    ...state.itemInfos,
                    effects: [...action.payload.objectInfo.effects],
                    history: [...state.itemInfos.history, {...action.payload, objectInfo: {...action.payload.objectInfo, effects: result}}]
                }
            }   
        }
        default: {
            throw Error(`ForgemagieContext unknown action: ${action.type}`)
        }
    }
}

interface ForgemagieProviderProps {
    children: React.ReactElement
}

export const ForgemagieProvider = ({ children }: ForgemagieProviderProps): React.ReactElement => {
    const items = useDofusItems().data
    const effects = useDofusEffects().data
    const [state, dispatch] = useReducer(reducer(items, effects), initialState)

    return (
        <ForgemagieContext.Provider value={state}>
            <ForgemagieDispatchContext.Provider value={dispatch}>
                {children}
            </ForgemagieDispatchContext.Provider>
        </ForgemagieContext.Provider>
    )
}
