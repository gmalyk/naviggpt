import React from 'react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const themes = [
    { id: 'light', color: '#FFFFFF', border: '#e2e8f0' },
    { id: 'gold', color: '#FBF8F1', border: '#e2d5b0' },
    { id: 'dark', color: '#1e293b', border: '#475569' },
];

const ThemeSwitcher = ({ expanded }) => {
    const { state, dispatch } = useAppState();

    return (
        <div className={`flex items-center ${expanded ? 'gap-2 px-3' : 'flex-col gap-1.5 px-0 justify-center'}`}>
            {themes.map(({ id, color, border }) => (
                <button
                    key={id}
                    onClick={() => dispatch({ type: ACTIONS.SET_THEME, payload: id })}
                    className={`w-5 h-5 rounded-full shrink-0 transition-all ${state.theme === id ? 'ring-2 ring-[#B88644] ring-offset-1 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color, border: `1.5px solid ${border}` }}
                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                />
            ))}
        </div>
    );
};

export default ThemeSwitcher;
