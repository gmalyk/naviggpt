import React from 'react';
import { ShieldCheck, EyeOff, Globe, Scale } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const LandingTrust = () => {
    const { t } = useTranslation();

    const items = [
        { icon: ShieldCheck, label: t('landing_trust_no_resale') },
        { icon: EyeOff, label: t('landing_trust_no_ads') },
        { icon: Globe, label: t('landing_trust_languages') },
        { icon: Scale, label: t('landing_trust_antisycophancy') },
    ];

    return (
        <section className="py-12 px-6">
            <div className="max-w-5xl mx-auto bg-slate-900 rounded-[32px] p-10 md:p-14">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
                    {t('landing_trust_title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <item.icon className="w-6 h-6 text-[#A3B5C7]" />
                            </div>
                            <p className="text-sm text-slate-300 font-medium">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingTrust;
