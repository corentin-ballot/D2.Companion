import React, { useContext, createContext, useReducer } from 'react'

export interface BaseInformation {
    gender: string
}

export interface SubEntityLook {
    bonesId: number
    skins: number[]
    indexedColors: number[]
    scales: number[]
    subEntities: any[]
}

export interface SubEntity {
    bindingPointCategory: string
    bindingPointIndex: number
    subEntityLook: SubEntityLook
}

export interface Look {
    bonesId: number
    skins: any[]
    indexedColors: any[]
    scales: any[]
    subEntities: SubEntity[]
}

export interface CharacterLook {
    look: Look
    breedId: number
    baseInformation: BaseInformation
}

export interface CharacterBasicInformation {
    name: string
    level: number
    characterLook: CharacterLook
}

export interface Character {
    id: string
    characterBasicInformation: CharacterBasicInformation
}

export interface Success {
    character: Character
}

export interface CharacterSelectionEvent {
    success: Success
}

export interface AchievedAchievement {
    achievementId: number
    achievedBy: string
    pioneerRank: number
}

export interface AchievementsEvent {
    achievedAchievements: AchievedAchievement[]
}

export interface FinishedQuest {
    questId: number
    finishedCount: number
}

export interface Completion {
    currentCompletion: number
    maxCompletion: number
}

export interface Objective {
    objectiveId: number
    objectiveReached: boolean
    dialogParams: any[]
    completion?: Completion
}

export interface Details {
    stepId: number
    objectives: Objective[]
}

export interface ActiveQuest {
    questId: number
    details: Details
}

export interface QuestsEvent {
    finishedQuests: FinishedQuest[]
    activeQuests: ActiveQuest[]
    reinitializedDoneQuestsId: number[]
}

interface CharacterState {
    infos: {
        id: number;
        name: string;
        breed: number;
        level: number;
        sex: boolean;
    },
    achievements: {
        finished: number[];
    };
    quests: {
        finished: number[];
        active: number[];
        reinit: number[];
    };
}

const loadCharacter = (): CharacterState => {
    const infos = JSON.parse(localStorage.getItem(`Character.infos`) ?? "null");

    if (infos) {
        return {
            infos,
            achievements: JSON.parse(localStorage.getItem(`Character.achievements.${infos.id}`) || '{"finished":[]}'),
            quests: JSON.parse(localStorage.getItem(`Character.quests.${infos.id}`) || '{"finished":[],"active":[],"reinit":[]}'),
        }
    }

    return {
        infos: {
            id: 0,
            name: "MissingNo.",
            breed: 1,
            level: 0,
            sex: false,
        },
        achievements: {
            finished: [],
        },
        quests: {
            finished: [],
            active: [],
            reinit: [],
        }
    };
}

const initialState: CharacterState = loadCharacter();

const CharacterContext = createContext<CharacterState>(initialState)
export const useCharacter = (): CharacterState => useContext(CharacterContext)

const CharacterDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useCharacterDispatch = (): React.Dispatch<any> => useContext(CharacterDispatchContext)

const reducer = (state: CharacterState, action: { type: string, payload: any }): CharacterState => {
    switch (action.type) {
        case 'character_changed': {
            return {
                ...state,
                infos: {
                    id: parseInt(action.payload.success.character.id, 10),
                    name: action.payload.success.character.characterBasicInformation.name,
                    breed: action.payload.success.character.characterBasicInformation.characterLook.breedId,
                    level: action.payload.success.character.characterBasicInformation.level,
                    sex: action.payload.success.character.characterBasicInformation.characterLook.baseInformation.gender === "FEMALE",
                },
                achievements: JSON.parse(localStorage.getItem(`Character.achievements.${state.infos.id}`) ?? '{"finished":[]}'),
                quests: JSON.parse(localStorage.getItem(`Character.quests.${state.infos.id}`) ?? '{"finished":[],"active":[],"reinit":[]}'),
            }
        }
        case 'achievements_changed': {
            return {
                ...state,
                achievements: {
                    finished: action.payload.achievedAchievements.map((a: AchievedAchievement) => a.achievementId)
                }
            }
        }
        case 'quests_changed': {
            return {
                ...state,
                quests: {
                    finished: action.payload.finishedQuests.map((fq: FinishedQuest) => fq.questId),
                    active: action.payload.activeQuests.map((aq: ActiveQuest) => aq.questId),
                    reinit: action.payload.reinitializedDoneQuestsId,
                }
            }
        }
        default: {
            throw Error(`CharacterContext unknown action: ${action.type}`)
        }
    }
}

interface CharacterProviderProps {
    children: React.ReactElement
}

export const CharacterProvider = ({ children }: CharacterProviderProps): React.ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState)

    React.useEffect(() => {
        // Store character infosrmations
        localStorage.setItem(`Character.infos`, JSON.stringify(state.infos));
    }, [state.infos.id])

    React.useEffect(() => {
        localStorage.setItem(`Character.achievements.${state.infos.id}`, JSON.stringify(state.achievements));
    }, [state.achievements])

    React.useEffect(() => {
        localStorage.setItem(`Character.quests.${state.infos.id}`, JSON.stringify(state.quests));
    }, [state.quests])

    return (
        <CharacterContext.Provider value={state}>
            <CharacterDispatchContext.Provider value={dispatch}>
                {children}
            </CharacterDispatchContext.Provider>
        </CharacterContext.Provider>
    )
}
