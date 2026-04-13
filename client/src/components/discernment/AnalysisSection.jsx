import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import MarkdownContent from '../ui/MarkdownContent';

const AnalysisSection = () => {
    const { state } = useAppState();
    const { t } = useTranslation();

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#7B8FA3] brand-protect" />
                <h2 className="text-sm font-bold text-slate-800">{t('ui_virgile_analysis')}</h2>
            </div>

            <div className="text-slate-600 leading-relaxed">
                <MarkdownContent content={state.analysis} className="text-sm" />
            </div>
        </div>
    );
};

export default AnalysisSection;
