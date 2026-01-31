import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import OptimizedResponse from './OptimizedResponse';
import StandardResponse from './StandardResponse';
import FollowUpChat from './FollowUpChat';

const ResultView = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();

    const resetToHome = () => {
        dispatch({ type: ACTIONS.SET_VIEW, payload: 'home' });
        window.scrollTo(0, 0);
    };

    return (
        <section className="w-full bg-white py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="px-6 max-w-4xl mx-auto w-full">
                <OptimizedResponse content={state.virgileResponse} />
                <StandardResponse content={state.standardResponse} />
                <FollowUpChat />

                <div className="mt-12 pt-12 border-t border-slate-50 flex flex-col items-center gap-8">
                    <button
                        onClick={resetToHome}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors py-2 px-4 rounded-full hover:bg-slate-50 font-medium text-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>{t('new_question_btn')}</span>
                    </button>

                    <div className="bg-gradient-to-br from-slate-900 to-black p-12 rounded-[40px] text-center w-full shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="relative z-10">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{t('footer_title')}</h2>
                            <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
                                {t('footer_text')}
                            </p>
                            <button className="px-10 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-all shadow-xl">
                                {t('subscribe_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResultView;
