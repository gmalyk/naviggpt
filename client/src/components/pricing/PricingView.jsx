import React, { useState } from 'react';
import { Check, Loader2, X, CreditCard } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const PricingView = () => {
    const { t } = useTranslation();
    const { user, openAuthModal } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChoosePlan = async (planType) => {
        if (!user) {
            openAuthModal('sign_in', t('auth_plan_hint'));
            return;
        }

        setLoading(true);
        setShowSuccessModal(false);
        setErrorMessage('');

        try {
            const firstName = user?.user_metadata?.full_name?.split(' ')[0] || '';
            await api.choosePlan(planType, user.email, firstName);
            setShowSuccessModal(true);
        } catch (e) {
            setErrorMessage(t('pricing_error'));
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            key: 'individual',
            name: t('pricing_individual'),
            price: t('pricing_individual_price'),
            description: t('pricing_individual_desc'),
            features: [
                t('pricing_feat_usage_limits'),
                t('pricing_feat_history'),
                t('pricing_feat_no_ads'),
                t('pricing_feat_anti_sycophancy'),
                t('pricing_feat_timer'),
                t('pricing_feat_parental'),
                t('pricing_feat_values_saved'),
                t('pricing_feat_no_gadgets'),
                t('pricing_feat_no_data_resale'),
                t('pricing_feat_no_standard_window'),
                t('pricing_feat_voice_dictation'),
                t('pricing_feat_file_image_download'),
                t('pricing_feat_custom_agents'),
                t('pricing_feat_and_more'),
            ],
            buttonClass: 'bg-[#B88644] hover:bg-[#a6763b] text-white brand-protect',
        },
        {
            key: 'institution',
            name: t('pricing_institution'),
            price: t('pricing_institution_price'),
            description: t('pricing_institution_desc'),
            highlight: t('pricing_feat_includes_individual'),
            features: [
                t('pricing_feat_culture'),
                t('pricing_feat_categories'),
                t('pricing_feat_price_users'),
                t('pricing_feat_admin'),
                t('pricing_feat_support'),
            ],
            buttonClass: 'bg-slate-800 hover:bg-slate-900 text-white',
        },
    ];

    return (
        <section className="py-12 px-6 max-w-5xl mx-auto flex flex-col items-center animate-in fade-in duration-500">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
                <CreditCard className="w-7 h-7 text-[#B88644] brand-protect" />
            </div>

            <h1 className="text-3xl font-bold text-center mb-10 text-slate-600">
                {t('pricing_title')}
            </h1>

            {errorMessage && (
                <p className="mb-6 text-center text-sm text-red-600 animate-in fade-in duration-300">
                    {errorMessage}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {plans.map((plan) => (
                    <div
                        key={plan.key}
                        className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-xl font-bold text-slate-600 mb-1">
                            {plan.name}
                        </h2>
                        <p className="text-sm text-slate-600 mb-6">
                            {plan.description}
                        </p>
                        <p className="text-3xl font-bold text-slate-600 mb-8">
                            {plan.price}
                        </p>

                        {plan.highlight && (
                            <p className="text-sm font-medium text-slate-500 mb-3 italic">{plan.highlight}</p>
                        )}
                        <ul className="space-y-3 mb-8 flex-grow">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleChoosePlan(plan.key)}
                            disabled={loading}
                            className={`w-full py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 ${plan.buttonClass} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {t('pricing_sending')}
                                </>
                            ) : (
                                t('pricing_choose')
                            )}
                        </button>
                    </div>
                ))}
            </div>
            {showSuccessModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full mx-6 p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-600 mb-2">
                            {t('pricing_success_title')}
                        </h3>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            {t('pricing_success_text')}
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="px-8 py-2.5 bg-[#B88644] text-white rounded-full font-semibold hover:bg-[#a6763b] transition-colors brand-protect"
                        >
                            {t('pricing_success_ok')}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PricingView;
