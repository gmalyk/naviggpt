import React, { createContext, useReducer, useContext } from 'react';

const CompanionContext = createContext();

const ACTIONS = {
    ADD_USER_MESSAGE: 'ADD_USER_MESSAGE',
    ADD_ASSISTANT_MESSAGE: 'ADD_ASSISTANT_MESSAGE',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_CONVERSATION: 'CLEAR_CONVERSATION',
};

const initialState = {
    messages: [],
    loading: false,
    error: null,
};

function companionReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_USER_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, { role: 'user', content: action.payload, timestamp: Date.now() }],
                error: null,
            };
        case ACTIONS.ADD_ASSISTANT_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, { role: 'assistant', content: action.payload, timestamp: Date.now() }],
            };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, loading: false };
        case ACTIONS.CLEAR_CONVERSATION:
            return { ...initialState };
        default:
            return state;
    }
}

export const CompanionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(companionReducer, initialState);

    return (
        <CompanionContext.Provider value={{ state, dispatch }}>
            {children}
        </CompanionContext.Provider>
    );
};

export const useCompanionState = () => {
    const context = useContext(CompanionContext);
    if (!context) {
        throw new Error('useCompanionState must be used within a CompanionProvider');
    }
    return context;
};

export { ACTIONS as COMPANION_ACTIONS };
