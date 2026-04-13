import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';
import { ACTIONS } from '../../context/appReducer';

const MAX_VALUES = 8;

const CompassFab = () => {
    const { state, dispatch } = useAppState();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [hovered, setHovered] = useState(false);

    const count = state.values?.length || 0;
    const progress = count / MAX_VALUES;

    if (!user || state.view === 'landing' || state.view === 'compass') return null;

    const handleClick = () => {
        dispatch({ type: ACTIONS.SET_RETURN_TO_VIEW, payload: state.view });
        navigateTo(dispatch, 'compass');
    };

    // SVG circle parameters for the progress ring
    const radius = 23;
    const circumference = 2 * Math.PI * radius;
    const strokeOffset = circumference * (1 - progress);

    return (
        <div className="fixed bottom-6 right-3 sm:right-6 z-50 hidden sm:flex flex-col items-end gap-2">
            {/* Tooltip */}
            {hovered && (
                <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap mb-1 animate-in fade-in slide-in-from-bottom-1 duration-150">
                    {count === 0
                        ? t('compass_fab_hint')
                        : `${count} ${t('values_selected_count')}`
                    }
                </div>
            )}

            {/* FAB */}
            <button
                onClick={handleClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="relative w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
            >
                {/* Progress ring */}
                <svg className="absolute inset-0 w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                    <circle
                        cx="24" cy="24" r={radius}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="2.5"
                    />
                    {count > 0 && (
                        <circle
                            cx="24" cy="24" r={radius}
                            fill="none"
                            stroke="#7B8FA3"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeOffset}
                            className="transition-all duration-500"
                        />
                    )}
                </svg>

                {/* Icon + count */}
                <div className="relative flex items-center justify-center compass-glow">
                    <Compass className="w-5 h-5 text-[#7B8FA3]" />
                </div>

                {/* Badge */}
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7B8FA3] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {count}
                    </span>
                )}
            </button>
        </div>
    );
};

export default CompassFab;
