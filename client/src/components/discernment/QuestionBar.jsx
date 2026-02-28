import React from 'react';
import { useAppState } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

const QuestionBar = () => {
    const { state } = useAppState();
    const { t } = useTranslation();

    return (
        <div className="sticky top-14 left-0 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 z-30 animate-in slide-in-from-top duration-300">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <p className="text-slate-800 font-medium text-sm md:text-base line-clamp-1 italic shrink">
                    "{state.question}"
                </p>
                <div className="px-3 py-1 bg-white/50 rounded-full border border-slate-200 flex items-center gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#B88644] brand-protect" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('status_in_progress')}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionBar;
