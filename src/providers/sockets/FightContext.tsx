import React, { useContext, createContext, useReducer } from 'react'
import useDofusComagnons, { Comagnon } from '../../hooks/dofus-data/useDofusCompagnons';
import useDofusMonsters, { Monster } from '../../hooks/dofus-data/useDofusMonsters';
import useDofusSpells, { Spell } from '../../hooks/dofus-data/useDofusSpells';

export interface Characteristic {
    characteristicId: number;
    total: number; // for monsters
    additional?: number; // for players
    alignGiftBonus?: number; // for players
    base?: number; // for players
    contextModif?: number; // for players
    objectsAndMountBonus?: number; // for players
}

export interface Disposition {
    cellId: number;
    direction: number;
    carryingCharacterId: number;
}

export interface Informations {
    contextualId: number;
    disposition: Disposition;
}

export interface SpawnInfo {
    teamId: number;
    alive: boolean;
    informations: Informations;
}

export interface FighterStats {
    invisibilityState: number;
    summoned: boolean;
    summoner: number;
    characteristics: Characteristic[];
};

export interface Fighter {
    contextualId: number;
    creatureGenericId: number | undefined; // undefined for players
    name: string; // GameContextActorPositionInformations for monsters, player name else
    stats: FighterStats;
    breed?: number;
    sex?: boolean;
    masterId?: number; // compagnon
    entityModelId?: number; // compagnon
    disposition?: Disposition;
    spawnInfo: SpawnInfo;
    wave: number;
    previousPositions: any[];
    level: number;
    creatureGrade?: number;
    creatureLevel?: number;
    leagueId?: number;
    ladderPosition?: number;
    hiddenInPrefight?: boolean;
    img?: string;
}

export interface GameActionFightSpellCastMessage {
    name: string;
    actionId: number;
    sourceId: number;
    silentCast: boolean;
    verboseCast: boolean;
    targetId: number;
    destinationCellId: number;
    critical: number;
    spellId: number;
    spellLevel: number;
    portalsIds: number[];
}

export interface GameActionFightLifePointsLostMessage {
    actionId: number;
    sourceId: number;
    targetId: number;
    loss: number;
    shieldLoss?: number;
    permanentDamages: number;
    elementId: number;
    round?: number;
}
  
  export interface Fight {
    startTime: number;
    endTime: number;
    duration: number;
    fighters: Fighter[];
    turnList: number[];
    dommages: GameActionFightLifePointsLostMessage[],
    spells: GameActionFightSpellCastMessage[];
    round: number;
  }

export const initialFight: Fight = {
    startTime: -1,
    endTime: -1,
    duration: -1,
    fighters: [],
    turnList: [],
    dommages: [],
    spells: [],
    round: -1,
  }

interface FightState {
    currentFight: Fight
    history: Fight[]
}

const initialState: FightState = {
    currentFight: { ...initialFight },
    history: [],
}

const FightContext = createContext<FightState>(initialState)
export const useFight = (): FightState => useContext(FightContext)

const FightDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useFightDispatch = (): React.Dispatch<any> => useContext(FightDispatchContext)

const reducer = (monsters: Monster[] | undefined, compagnons: Comagnon[] | undefined, spells: Spell[] | undefined) => (state: FightState, action: { type: string, payload: any }): FightState => {
    switch (action.type) {
        case 'fight_start': {
            return {
                ...state,
                currentFight: { ...initialFight, round: 0, startTime: Date.now() }
            }
        }
        case 'fight_turn_list': {
            return {
                ...state, 
                currentFight: {
                    ...state.currentFight,
                    turnList: action.payload.ids
                }
            }
        }
        case 'fight_fighters': {
            return {
                ...state, 
                currentFight: {
                    ...state.currentFight, 
                    fighters: action.payload.fighters.map((fighter: Fighter) => {
                        if (fighter.creatureGenericId) {
                          // Monsters
                          const monster = monsters?.find(m => m.id === fighter.creatureGenericId);
                          const name = monster ? monster?.name : "Unknown";
                          return { ...fighter, name }
                        } if(fighter.masterId) {
                          // Compagnons
                          const master = action.payload.fighters.find((f: Fighter) => f.contextualId === fighter.masterId)?.name;
                          const compagnon = compagnons?.find(c => c.id === fighter.entityModelId);
                          return { ...fighter, name: compagnon?.name ?? `Compagnon (${fighter.entityModelId}) de ${master}`, img: compagnon?.img }
                        } 
                          // Players
                          return { ...fighter }
                      })
                }
            }
        }
        case 'fight_round': {
            return {
                ...state, 
                currentFight: {
                    ...state.currentFight,
                    round: action.payload.roundNumber
                }
            }
        }
        case 'fight_end': {
            return {
                ...state,
                currentFight: { ...initialFight },
                history: [
                    {
                        ...state.currentFight,
                        duration: action.payload.duration,
                        endTime: Date.now(),
                    }, 
                    ...state.history
                ]
            }
        }
        case 'fight_dommage': {
            const fighter = state.currentFight.fighters.find(f => f.contextualId === action.payload.sourceId);

            return {
                ...state, 
                currentFight: {
                    ...state.currentFight,
                    dommages: [
                        ...state.currentFight.dommages, 
                        { ...action.payload, round: state.currentFight.round },
                        // add dommage line for summoner
                        ...(fighter?.stats.summoner ? [{ ...action.payload, round: state.currentFight.round, sourceId: fighter.stats.summoner, elementId: 9 }] : [])
                    ]
                }
            }
        }
        case 'fight_spell': {
            const spell = spells?.find(s => s.id === action.payload.spellId);
            return {
                ...state,
                currentFight: {
                    ...state.currentFight, 
                    spells: [
                        ...state.currentFight.spells, 
                        {...action.payload, name: spell ? spell.name : "Unknow"}
                    ]
                }
            }
        }
        case 'fight_summon': {
            const monster = monsters?.find(m => m.id === action.payload.summons[0].spawnInformation.creatureGenericId);
            const summoner = state.currentFight.fighters.find(f => f.contextualId === action.payload.summons[0].stats.summoner);
            const name = monster ? monster.name : "Unknown";

            const summonedFighter: Fighter = {
                contextualId: action.payload.summons[0].summons[0].informations.contextualId,
                creatureGenericId: action.payload.summons[0].spawnInformation.creatureGenericId,
                name: `${name} de ${summoner ? summoner.name : action.payload.summons[0].stats.summoner}`,
                stats: action.payload.summons[0].stats,
                wave: action.payload.summons[0].wave,
                spawnInfo: {
                ...action.payload.summons[0].spawnInformation,
                ...action.payload.summons[0].summons[0]
                }, 
                previousPositions: [], 
                level: summoner?.level ? summoner.level : 0,
            }

            return {
                ...state, 
                currentFight: {
                    ...state.currentFight,
                    fighters: [...state.currentFight.fighters, summonedFighter]
                }
            }
        }
        default: {
            throw Error(`FightContext unknown action: ${action.type}`)
        }
    }
}

interface FightProviderProps {
    children: React.ReactElement
}

export const FightProvider = ({ children }: FightProviderProps): React.ReactElement => {
    const monsters = useDofusMonsters().data;
    const compagnons = useDofusComagnons().data;
    const spells = useDofusSpells().data;
    const [state, dispatch] = useReducer(reducer(monsters, compagnons, spells), initialState)

    return (
        <FightContext.Provider value={state}>
            <FightDispatchContext.Provider value={dispatch}>
                {children}
            </FightDispatchContext.Provider>
        </FightContext.Provider>
    )
}
