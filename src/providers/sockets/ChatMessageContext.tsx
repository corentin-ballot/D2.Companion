import { Dispatch, ReactNode, createContext, useReducer } from 'react';

interface ChatMessageState {
    messages: any[];
}

const initialState: ChatMessageState = {
    messages: [],
};

export const ChatMessageContext = createContext<ChatMessageState>(initialState);
export const ChatMessageDispatchContext = createContext<Function>(() => null);

interface ChatMessageProviderProps {
    children: ReactNode;
}

export function ChatMessageProvider({ children }: ChatMessageProviderProps) {
    const [state, dispatch] = useReducer(
        stateReducer,
        initialState
    );

    return (
        <ChatMessageContext.Provider value={state}>
            <ChatMessageDispatchContext.Provider value={dispatch}>
                {children}
            </ChatMessageDispatchContext.Provider>
        </ChatMessageContext.Provider>
    );
}

function stateReducer(state: ChatMessageState, action: any) {
    switch (action.type) {
        case 'message_added': {
            return {
                ...state,
                messages: [...state.messages, {
                    ...action.message
                }]
            };
        }
        case 'message_changed': {
            return {
                ...state,
                messages: state.messages.map((message: any) => {
                    if (message.id === action.message.id) {
                        return action.message;
                    } else {
                        return message;
                    }
                })
            };
        }
        case 'message_deleted': {
            return {
                ...state,
                messages: state.messages.filter((message: any) => message.id !== action.message.id)
            };
        }
        default: {
            throw Error('ChatMessageContext unknown action: ' + action.type);
        }
    }
}