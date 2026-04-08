import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { appReducer, initialState } from './appReducer';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        document.documentElement.lang = state.language;
        document.documentElement.dir = state.dir;
    }, [state.language, state.dir]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('virgil-theme', state.theme);
        const isDark = state.theme === 'dark';
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light only';
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) meta.content = isDark ? 'dark' : 'only light';
    }, [state.theme]);

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
