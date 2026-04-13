import React from 'react';
import { X } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';

const LimitBanner = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();

    if (!state.showLimitBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-4 shadow-lg">
            <p className="text-sm flex-1">{t('daily_limit_reached')}</p>
            <button
                onClick={() => {
                    dispatch({ type: ACTIONS.HIDE_LIMIT_BANNER });
                    navigateTo(dispatch, 'pricing');
                }}
                className="px-5 py-2 bg-[#7B8FA3] hover:bg-[#5A7085] text-white text-sm font-semibold rounded-full transition-colors whitespace-nowrap"
            >
                {t('upgrade_plan')}
            </button>
            <button
                onClick={() => dispatch({ type: ACTIONS.HIDE_LIMIT_BANNER })}
                className="p-1 hover:bg-white/10 rounded transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default LimitBanner;
