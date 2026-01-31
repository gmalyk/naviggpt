import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import QuestionBar from './QuestionBar';
import AnalysisSection from './AnalysisSection';
import FilterForm from './FilterForm';
import PrecisionInput from './PrecisionInput';
import Loader from '../ui/Loader';

const DiscernmentView = () => {
    const { state } = useAppState();
    const { submitFilters, loading } = useAI();

    return (
        <div className="min-h-screen flex flex-col w-full bg-slate-50/50 animate-in fade-in duration-300">
            <main className="flex-grow pt-24 pb-20 px-6 max-w-6xl mx-auto w-full">
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Votre question :</span>
                    <p className="text-slate-600 italic text-xs md:text-sm font-medium">"{state.question}"</p>
                </div>

                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-10 relative">
                    <AnalysisSection />

                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-slate-800">Sélectionnez les clés de discernement pour orienter l'IA.</h3>
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
                                    <span>Envoyer avec filtres</span>
                                    <ArrowRight className="w-4 h-4 rtl:scale-x-[-1]" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DiscernmentView;
