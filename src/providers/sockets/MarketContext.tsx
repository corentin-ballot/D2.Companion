import React, { useContext, createContext, useReducer } from 'react'

export interface ObjectEffect {
    actionId: number;
    value: number;
}

export interface BidExchangerObjectInfo {
    effects: ObjectEffect[];
    objectGID: number;
    objectType: number;
    objectUID: number;
    prices: number[];
}

export interface ExchangeTypesItemsExchangerDescriptionForUserMessage {
    itemTypeDescriptions: BidExchangerObjectInfo[];
    objectType: number;
}

interface MarketState {
    items: BidExchangerObjectInfo[]
}

const initialState: MarketState = {
    items: []
}

const MarketContext = createContext<MarketState>(initialState)
export const useMarket = (): MarketState => useContext(MarketContext)

const MarketDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useMarketDispatch = (): React.Dispatch<any> => useContext(MarketDispatchContext)

const reducer = (state: MarketState, action: { type: string, payload: any }): MarketState => {
    switch (action.type) {
        case 'item_viewed': {
            return {
                items: [...action.payload.itemTypeDescriptions]
            }; 
        }
        default: {
            throw Error(`MarketContext unknown action: ${action.type}`)
        }
    }
}

interface MarketProviderProps {
    children: React.ReactElement
}

export const MarketProvider = ({ children }: MarketProviderProps): React.ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <MarketContext.Provider value={state}>
            <MarketDispatchContext.Provider value={dispatch}>
                {children}
            </MarketDispatchContext.Provider>
        </MarketContext.Provider>
    )
}
