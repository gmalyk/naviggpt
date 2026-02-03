import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import { useTranslation } from '../../hooks/useTranslation';
import QuestionBar from './QuestionBar';
import AnalysisSection from './AnalysisSection';
import FilterForm from './FilterForm';
import PrecisionInput from './PrecisionInput';
import Loader from '../ui/Loader';

const DiscernmentView = () => {
    const { state } = useAppState();
    const { submitFilters, loading } = useAI();
    const { t } = useTranslation();

    return (
        <section className="w-full bg-slate-50/50 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="px-6 max-w-6xl mx-auto w-full">
                <div className="flex justify-end mb-6">
                    <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-[80%]">
                        <p className="text-slate-700">{state.question}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-10 relative">
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
                            {loading ? <Loader className="border-white/30 border-t-white" /> : (
                                <>
                                    <span>{t('submit_btn_long')}</span>
                                    <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DiscernmentView;
