import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const LandingCompanions = () => {
    const { t } = useTranslation();

    const companions = [
        {
            name: t('sage_socrate'),
            subtitle: t('sage_socrate_subtitle'),
            description: t('sage_socrate_tooltip'),
            image: '/socrate.png',
            bgColor: '#8AA0B8',
        },
        {
            name: t('sage_nestor'),
            subtitle: t('sage_nestor_subtitle'),
            description: t('sage_nestor_tooltip'),
            image: '/nestor.png',
            imageClass: 'object-[40%_20%]',
            bgColor: '#9BB0C4',
        },
        {
            name: t('sage_plutarque'),
            subtitle: t('sage_plutarque_subtitle'),
            description: t('sage_plutarque_tooltip'),
            image: '/plutarque.png',
            bgColor: '#6E8496',
        },
    ];

    return (
        <section className="py-12 px-6 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        {t('landing_companions_title')}
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        {t('landing_companions_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {companions.map((companion, idx) => (
                        <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-5 shadow-sm" style={{ backgroundColor: companion.bgColor }}>
                                <img
                                    src={companion.image}
                                    alt={companion.name}
                                    className={`w-full h-full object-cover scale-125 ${companion.imageClass || ''}`}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{companion.name}</h3>
                            <p className="text-sm font-medium text-[#7B8FA3] mb-4 brand-protect">{companion.subtitle}</p>
                            <p className="text-sm text-slate-500 leading-relaxed">{companion.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingCompanions;
