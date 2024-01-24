import React, { useContext, createContext, useReducer } from 'react'

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
                    id: action.payload.infos.id,
                    name: action.payload.infos.name,
                    breed: action.payload.infos.breed,
                    level: action.payload.infos.level,
                    sex: action.payload.infos.sex,
                }
            }
        }
        case 'achievements_changed': {
            return {
                ...state,
                achievements: action.payload
            }
        }
        case 'quests_changed': {
            return {
                ...state,
                quests: action.payload
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

        // Load character quests & achievements
        dispatch({type: "achievements_changed", payload: JSON.parse(localStorage.getItem(`Character.achievements.${state.infos.id}`) ?? '{"finished":[]}')})
        dispatch({type: "quests_changed", payload: JSON.parse(localStorage.getItem(`Character.quests.${state.infos.id}`) ?? '{"finished":[],"active":[],"reinit":[]}')})
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
