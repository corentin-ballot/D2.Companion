import React, { useContext, createContext, useReducer } from 'react'
  
export interface _MinMax {
    min: number
    max: number
}

export interface _Effect {
    action: number
    valueInt?: number
    minMax?: _MinMax
}

export interface _ItemDescription {
    uid: number
    gid: number
    type: number
    effects: _Effect[]
    prices: string[]
}

export interface ExchangeTypesItemsExchangerDescriptionForUserMessage {
    objectGid: number
    objectType: number
    itemDescriptions: _ItemDescription[]
}

interface MarketState {
    items: _ItemDescription[]
}

const initialState: MarketState = {
    items: []
}

const MarketContext = createContext<MarketState>(initialState)
export const useMarket = (): MarketState => useContext(MarketContext)

const MarketDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const useMarketDispatch = (): React.Dispatch<any> => useContext(MarketDispatchContext)

const reducer = (state: MarketState, action: { type: string, payload: ExchangeTypesItemsExchangerDescriptionForUserMessage }): MarketState => {
    switch (action.type) {
        case 'item_viewed': {
            return {
                items: [...action.payload.itemDescriptions]
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
