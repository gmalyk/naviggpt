import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import MarkdownContent from '../ui/MarkdownContent';

const AnalysisSection = () => {
    const { state } = useAppState();

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#B88644]" />
                <h2 className="text-sm font-bold text-slate-800">Analyse de Virgile</h2>
            </div>

            <div className="text-slate-600 leading-relaxed">
                <MarkdownContent content={state.analysis} className="text-sm" />
            </div>
        </div>
    );
};

export default AnalysisSection;
