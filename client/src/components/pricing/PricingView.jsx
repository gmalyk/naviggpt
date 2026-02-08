import React from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';

const PricingView = () => {
    const { t } = useTranslation();
    const { user, openAuthModal } = useAuth();

    const handleChoosePlan = () => {
        if (!user) {
            openAuthModal();
        }
    };

    const plans = [
        {
            name: t('pricing_individual'),
            price: t('pricing_individual_price'),
            description: t('pricing_individual_desc'),
            features: [
                t('pricing_feat_unlimited'),
                t('pricing_feat_engines'),
            ],
            buttonClass: 'bg-[#B88644] hover:bg-[#a6763b] text-white',
        },
        {
            name: t('pricing_institution'),
            price: t('pricing_institution_price'),
            description: t('pricing_institution_desc'),
            features: [
                t('pricing_feat_unlimited'),
                t('pricing_feat_engines'),
                t('pricing_feat_users'),
                t('pricing_feat_admin'),
                t('pricing_feat_support'),
            ],
            buttonClass: 'bg-slate-800 hover:bg-slate-900 text-white',
        },
    ];

    return (
        <section className="py-12 px-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-center mb-10 text-slate-900">
                {t('pricing_title')}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                            {plan.name}
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            {plan.description}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mb-8">
                            {plan.price}
                        </p>

                        <ul className="space-y-3 mb-8 flex-grow">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleChoosePlan}
                            className={`w-full py-3 rounded-full font-semibold transition-colors ${plan.buttonClass}`}
                        >
                            {t('pricing_choose')}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PricingView;
