import React from 'react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const themes = [
    { id: 'light', color: '#FFFFFF', border: '#e2e8f0' },
    { id: 'silver', color: '#F4F6F8', border: '#b0bec5' },
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
                    className={`w-5 h-5 rounded-full shrink-0 transition-all ${state.theme === id ? 'ring-2 ring-[#7B8FA3] ring-offset-1 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color, border: `1.5px solid ${border}` }}
                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                />
            ))}
        </div>
    );
};

export default ThemeSwitcher;
