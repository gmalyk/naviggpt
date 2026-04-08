import React from 'react';
import { MessageSquare, Sparkles, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const LandingHowItWorks = () => {
    const { t } = useTranslation();

    const steps = [
        {
            number: '1',
            icon: MessageSquare,
            title: t('landing_step1_title'),
            text: t('landing_step1_text'),
        },
        {
            number: '2',
            icon: Sparkles,
            title: t('landing_step2_title'),
            text: t('landing_step2_text'),
        },
        {
            number: '3',
            icon: CheckCircle,
            title: t('landing_step3_title'),
            text: t('landing_step3_text'),
        },
    ];

    return (
        <section id="how-it-works" className="py-12 px-6 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        {t('landing_howitworks_title')}
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        {t('landing_howitworks_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <div key={step.number} className="rounded-3xl border border-slate-200 bg-white p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-[#B88644] text-white flex items-center justify-center mx-auto mb-5 text-lg font-bold brand-protect">
                                {step.number}
                            </div>
                            <step.icon className="w-8 h-8 text-[#B88644] mx-auto mb-4 brand-protect" />
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{step.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingHowItWorks;
