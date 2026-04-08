import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Sparkles, Bot } from 'lucide-react';
import virggilImg from '../../assets/images/virggil.webp';

const LandingComparison = () => {
    const { t } = useTranslation();

    return (
        <section className="py-12 px-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-12">
                <img src={virggilImg} alt="Virggil" className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover" />
                <div className="text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                        {t('landing_compare_title')}
                    </h2>
                    <p className="text-slate-500 max-w-2xl">
                        {t('landing_compare_subtitle')}
                    </p>
                </div>
            </div>

            <div className="bg-slate-100 rounded-2xl px-6 py-4 text-center mb-8 max-w-3xl mx-auto">
                <p className="text-sm text-slate-500 mb-1">{t('landing_compare_question_label')}</p>
                <p className="text-base md:text-lg font-medium text-slate-700 italic">
                    "{t('landing_compare_question')}"
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Virggil */}
                <div className="rounded-3xl border-2 border-[#B88644]/30 bg-white p-8 flex flex-col shadow-lg shadow-[#B88644]/5 relative">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-[#B88644] text-white text-xs font-bold rounded-full brand-protect">
                        {t('landing_compare_badge')}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#B88644]/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#B88644] brand-protect" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">Virggil</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed flex-grow">
                        {t('landing_compare_virggil_text')}
                    </p>
                </div>

                {/* Standard AI */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-600">{t('landing_compare_standard_label')}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed flex-grow">
                        {t('landing_compare_standard_text')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LandingComparison;
