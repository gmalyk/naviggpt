import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const Footer = () => {
    const { t } = useTranslation();
    const { dispatch } = useAppState();

    return (
        <footer className="py-16 mt-auto">
            <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
                <button
                    onClick={() => {
                        dispatch({ type: ACTIONS.SET_VIEW, payload: 'terms' });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-8 text-[10px] text-slate-300 hover:text-slate-500 transition-colors"
                >
                    {t('menu_terms')}
                </button>
            </div>
        </footer>
    );
};

export default Footer;
