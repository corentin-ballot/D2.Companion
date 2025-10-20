import React, { useContext, createContext, useReducer } from 'react'

export interface MinMax {
    min: number
    max: number
}

export interface Dice {
    num: string
    side: number
    const: number
}

export interface Effect {
    action: number
    dice?: Dice
    valueInt?: number
    minMax?: MinMax
}

export interface Item {
    uid: number
    quantity: number
    gid: string
    effects: Effect[]
}

export interface Object {
    position: number
    item: Item
    favorite: boolean
    tagStorageUuids: any[]
}

interface StorageState {
    kamas: number;
    objects: Object[];
}

const initialState: StorageState = {
    kamas: 0,
    objects: [],
}

const StorageContext = createContext<StorageState>(initialState)
export const useStorage = (): StorageState => useContext(StorageContext)

const StorageDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useStorageDispatch = (): React.Dispatch<any> => useContext(StorageDispatchContext)

const reducer = (state: StorageState, action: { type: string, payload: any }): StorageState => {
    switch (action.type) {
        case 'storage_updated': {
            return {
                kamas: action.payload.kamas,
                objects: [...action.payload.objects],
            }
        }
        default: {
            throw Error(`StorageContext unknown action: ${action.type}`)
        }
    }
}

interface StorageProviderProps {
    children: React.ReactElement
}

export const StorageProvider = ({ children }: StorageProviderProps): React.ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <StorageContext.Provider value={state}>
            <StorageDispatchContext.Provider value={dispatch}>
                {children}
            </StorageDispatchContext.Provider>
        </StorageContext.Provider>
    )
}
