import React, { useContext, createContext, useReducer, useEffect } from 'react'

export interface Sale {
    id: number;
    date: number;
    quantity: number;
    price: number;
}

interface SalesState {
    history: Sale[];
    returns: Sale[];
    purchases: Sale[];
}

const initialState: SalesState = {
    history: JSON.parse(localStorage.getItem("Sales.history") || "[]"),
    returns: JSON.parse(localStorage.getItem("Sales.returns") || "[]"),
    purchases: JSON.parse(localStorage.getItem("Sales.purchases") || "[]"),
};

const SalesContext = createContext<SalesState>(initialState)
export const useSales = (): SalesState => useContext(SalesContext)

const SalesDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useSalesDispatch = (): React.Dispatch<any> => useContext(SalesDispatchContext)

const reducer = (state: SalesState, action: { type: string, payload: any }): SalesState => {
    switch (action.type) {
        case 'storage_updated': {
            return state
        }
        case 'item_sold': {
            return {
                ...state,
                history: [
                    ...state.history,
                    {
                        id: parseInt(action.payload.parameters[1], 10),
                        date: Date.now(),
                        quantity: parseInt(action.payload.parameters[3], 10),
                        price: parseInt(action.payload.parameters[0], 10),
                    }
                ]
            }
        }
        case 'items_offline_sold': {
            return {
                ...state,
                history: [
                    ...state.history,
                    ...action.payload.bidHouseItems.map((item: any) => ({
                        id: item.objectGID,
                        date: item.date * 1000,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                ]
            }
        }
        case 'items_not_sold': {
            return {
                ...state,
                history: [
                    ...state.history,
                    ...action.payload.bidHouseItems.map((item: any) => ({
                        id: item.objectGID,
                        date: Date.now(),
                        quantity: item.quantity,
                        price: -1,
                    }))
                ]
            }
        }
        case 'item_bought': {
            return {
                ...state,
                purchases: [
                    ...state.purchases,
                    {
                        id: parseInt(action.payload.parameters[0], 10),
                        date: Date.now(),
                        quantity: parseInt(action.payload.parameters[2], 10),
                        price: parseInt(action.payload.parameters[3], 10),
                    }
                ]
            }
        }
        default: {
            throw Error(`SalesContext unknown action: ${action.type}`)
        }
    }
}

interface SalesProviderProps {
    children: React.ReactElement
}

export const SalesProvider = ({ children }: SalesProviderProps): React.ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        localStorage.setItem("Sales.history", JSON.stringify(state.history))
    }, [state.history])

    useEffect(() => {
        localStorage.setItem("Sales.returns", JSON.stringify(state.returns))
    }, [state.returns])

    useEffect(() => {
        localStorage.setItem("Sales.purchases", JSON.stringify(state.purchases))
    }, [state.purchases])

    return (
        <SalesContext.Provider value={state}>
            <SalesDispatchContext.Provider value={dispatch}>
                {children}
            </SalesDispatchContext.Provider>
        </SalesContext.Provider>
    )
}
