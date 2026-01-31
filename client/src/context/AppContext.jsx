import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { appReducer, initialState } from './appReducer';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        document.documentElement.lang = state.language;
        document.documentElement.dir = state.dir;
    }, [state.language, state.dir]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
};
