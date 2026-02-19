import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const partners = [
    { name: 'Perplexity', src: '/Perplexity_AI_logo.svg.png' }
];

const Footer = () => {
    const { t } = useTranslation();
    const { dispatch } = useAppState();

    return (
        <footer className="py-16 mt-auto">
            <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-8">{t('works_with')}</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-30 grayscale hover:opacity-50 transition-all duration-700 font-medium text-slate-400">
                    {partners.map(p => (
                        <div key={p.name} className="flex items-center gap-2">
                            <img
                                src={p.src}
                                alt={p.name}
                                className="h-6 object-contain"
                            />
                            {/* name already in logo */}
                        </div>
                    ))}
                </div>
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
