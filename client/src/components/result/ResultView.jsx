import React, { useEffect, useRef } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { navigateTo } from '../../hooks/useRouting';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import OptimizedResponse from './OptimizedResponse';
import StandardResponse from './StandardResponse';
import FollowUpChat from './FollowUpChat';

const ResultView = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const { user } = useAuth();
    const virggileRef = useRef(null);

    useEffect(() => {
        const el = virggileRef.current;
        if (!el) return;

        let scrolled = false;
        const doScroll = () => {
            if (scrolled) return;
            scrolled = true;
            requestAnimationFrame(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        };

        el.addEventListener('animationend', doScroll, { once: true });
        const fallback = setTimeout(doScroll, 1000);

        return () => {
            el.removeEventListener('animationend', doScroll);
            clearTimeout(fallback);
        };
    }, []);

    const resetToHome = () => {
        dispatch({ type: ACTIONS.SET_QUESTION, payload: '' });
        dispatch({ type: ACTIONS.SET_SELECTED_FILTERS, payload: [] });
        dispatch({ type: ACTIONS.SET_PRECISION, payload: '' });
        navigateTo(dispatch, 'home');
    };

    const handleSubscribe = () => {
        navigateTo(dispatch, 'pricing');
    };

    return (
        <section className="w-full bg-white py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="px-6 max-w-4xl mx-auto w-full">
                {state.question && (
                    <div className="flex justify-end mb-8 animate-in fade-in duration-500">
                        <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-[80%]">
                            <p className="text-slate-700">{state.question}</p>
                        </div>
                    </div>
                )}
                <OptimizedResponse content={state.virggileResponse} question={state.question} standardResponse={state.standardResponse} innerRef={virggileRef} />
                <StandardResponse content={state.standardResponse} />

                {!state.usage?.exempt && state.virggileResponse && (
                    <div className="my-6 text-center animate-in fade-in duration-700">
                        <button
                            onClick={handleSubscribe}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B88644] to-[#D4A24C] text-white text-sm font-semibold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Sparkles className="w-4 h-4" />
                            {t('try_free_cta')}
                        </button>
                    </div>
                )}

                <FollowUpChat />

                <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col items-center gap-8">
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
                            <button onClick={handleSubscribe} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-all shadow-xl">
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
