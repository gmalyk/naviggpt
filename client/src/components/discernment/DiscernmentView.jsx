import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { navigateTo } from '../../hooks/useRouting';
import { useAI } from '../../hooks/useAI';
import { useTranslation } from '../../hooks/useTranslation';
import QuestionBar from './QuestionBar';
import AnalysisSection from './AnalysisSection';
import FilterForm from './FilterForm';
import PrecisionInput from './PrecisionInput';
import LogoSpinner from '../ui/LogoSpinner';

const DiscernmentView = () => {
    const { state, dispatch } = useAppState();
    const { submitFilters, loading } = useAI();
    const { t } = useTranslation();
    const cardRef = useRef(null);

    const handleDefineValues = () => {
        dispatch({ type: ACTIONS.SET_RETURN_TO_VIEW, payload: 'discernment' });
        navigateTo(dispatch, 'compass');
    };

    useEffect(() => {
        const section = cardRef.current?.closest('section');
        if (!section) return;

        let scrolled = false;
        const doScroll = () => {
            if (scrolled) return;
            scrolled = true;
            requestAnimationFrame(() => {
                cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        };

        section.addEventListener('animationend', doScroll, { once: true });
        const fallback = setTimeout(doScroll, 500);

        return () => {
            section.removeEventListener('animationend', doScroll);
            clearTimeout(fallback);
        };
    }, []);

    return (
        <section className={`w-full bg-slate-50/50 py-12 animate-in fade-in slide-in-from-bottom-8 duration-300 ${state.view === 'result' ? 'pb-6' : 'pb-[50vh]'}`}>
            <div className="px-6 max-w-6xl mx-auto w-full">
                <div className="flex justify-end mb-6">
                    <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-[80%]">
                        <p className="text-slate-700">{state.question}</p>
                    </div>
                </div>

                <div ref={cardRef} id="analysis-card" className="scroll-mt-20 bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-5 relative">
                    <AnalysisSection />

                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-slate-800">{t('discernment_title')}</h3>
                        <FilterForm />
                    </div>

                    <PrecisionInput />

                    {loading ? (
                        <div className="flex flex-col items-center gap-3 pt-4 animate-in fade-in duration-500">
                            <LogoSpinner className="w-12 h-12" />
                            <span className="text-sm text-slate-400">{t('status_in_progress')}…</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <button onClick={handleDefineValues} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#B88644] border border-[#B88644]/30 rounded-full hover:bg-[#B88644]/5 transition-all brand-protect">
                                    <Compass className="w-4 h-4" />
                                    <span>{state.values.length > 0 ? t('edit_my_values') : t('define_my_values')}</span>
                                </button>
                                {state.values.length > 0 && (
                                    <span className="text-xs text-slate-400">
                                        {state.values.length} {t('values_selected_count')}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={submitFilters}
                                disabled={state.selectedFilters.length === 0}
                                className="flex items-center gap-3 px-8 py-3 bg-[#0F172A] text-white text-sm font-bold rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
                            >
                                <span>{t('submit_btn_long')}</span>
                                <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default DiscernmentView;
