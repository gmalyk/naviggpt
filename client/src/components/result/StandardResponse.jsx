import React, { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import MarkdownContent from '../ui/MarkdownContent';

const StandardResponse = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <section className="width-full mt-6 animate-in fade-in duration-700 delay-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-slate-700">{t('result_standard_title')}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{t('result_comparison_label')}</p>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="mt-4 p-8 bg-white/50 rounded-2xl border border-slate-50 animate-in slide-in-from-top-2 duration-300">
                    <MarkdownContent content={content} className="opacity-70 grayscale-[0.5]" />
                </div>
            )}
        </section>
    );
};

export default StandardResponse;
