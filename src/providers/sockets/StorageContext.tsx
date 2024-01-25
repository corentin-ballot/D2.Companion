import React, { useContext, createContext, useReducer } from 'react'
import { PossibleEffect } from '../../hooks/dofus-data/useDofusItems'

export interface Object {
    position: number
    objectGID: number
    effects: PossibleEffect[]
    objectUID: number
    quantity: number
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
