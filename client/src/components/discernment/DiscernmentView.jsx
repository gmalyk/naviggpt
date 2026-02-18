import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import { useTranslation } from '../../hooks/useTranslation';
import QuestionBar from './QuestionBar';
import AnalysisSection from './AnalysisSection';
import FilterForm from './FilterForm';
import PrecisionInput from './PrecisionInput';
import LogoSpinner from '../ui/LogoSpinner';

const DiscernmentView = () => {
    const { state } = useAppState();
    const { submitFilters, loading } = useAI();
    const { t } = useTranslation();
    const cardRef = useRef(null);

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
        <section className="w-full bg-slate-50/50 py-12 pb-[50vh] animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="px-6 max-w-6xl mx-auto w-full">
                <div className="flex justify-end mb-6">
                    <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-[80%]">
                        <p className="text-slate-700">{state.question}</p>
                    </div>
                </div>

                <div ref={cardRef} id="analysis-card" className="scroll-mt-20 bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-10 relative">
                    <AnalysisSection />

                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-slate-800">{t('discernment_title')}</h3>
                        <FilterForm />
                    </div>

                    <PrecisionInput />

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={submitFilters}
                            disabled={loading || state.selectedFilters.length === 0}
                            className="flex items-center gap-3 px-8 py-3 bg-[#0F172A] text-white text-sm font-bold rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
                        >
                            {loading ? <LogoSpinner className="w-5 h-5" /> : (
                                <>
                                    <span>{t('submit_btn_long')}</span>
                                    <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
                                </>
                            )}
                        </button>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center gap-3 pt-6 animate-in fade-in duration-500">
                            <LogoSpinner className="w-12 h-12" />
                            <span className="text-sm text-slate-400">{t('status_in_progress')}…</span>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default DiscernmentView;
