import React, { useState } from 'react';
import { Crown, XCircle, Mail, CreditCard, Shield, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';

const AccountView = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { dispatch } = useAppState();
    const [newsletterEnabled, setNewsletterEnabled] = useState(true);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [newsletterMessage, setNewsletterMessage] = useState('');

    // Mock data
    const mockPlan = {
        name: t('account_plan_individual'),
        price: '4,99 € / mois',
        status: 'active',
        renewalDate: '15/03/2026',
    };
    const mockCard = { last4: '4242', brand: 'Visa' };

    const handleNewsletterToggle = () => {
        const newValue = !newsletterEnabled;
        setNewsletterEnabled(newValue);
        setNewsletterMessage(newValue ? t('account_newsletter_subscribed') : t('account_newsletter_unsubscribed'));
        setTimeout(() => setNewsletterMessage(''), 3000);
    };

    return (
        <section className="py-12 px-6 max-w-3xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-center mb-10 text-slate-900">
                {t('account_title')}
            </h1>

            <div className="space-y-6">
                {/* Subscription Section */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-5 h-5 text-[#B88644]" />
                        <h2 className="text-xl font-bold text-slate-900">{t('account_subscription')}</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-lg font-semibold text-slate-800">{mockPlan.name}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{mockPlan.price}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {t('account_plan_status_active')}
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 mb-6">
                        {t('account_renewal_date')} : {mockPlan.renewalDate}
                    </p>

                    <button
                        onClick={() => dispatch({ type: ACTIONS.SET_VIEW, payload: 'pricing' })}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B88644] hover:bg-[#a6763b] text-white font-semibold text-sm transition-colors"
                    >
                        {t('account_change_plan')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Cancel Section */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <h2 className="text-xl font-bold text-slate-900">{t('account_cancel')}</h2>
                    </div>

                    <p className="text-sm text-slate-500 mb-6">
                        {t('account_cancel_info')}
                    </p>

                    {!showCancelConfirm ? (
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="px-5 py-2.5 rounded-full border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
                        >
                            {t('account_cancel')}
                        </button>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                            <p className="text-sm text-red-700 mb-4">{t('account_cancel_confirm')}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    className="px-4 py-2 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
                                >
                                    {t('btn_cancel')}
                                </button>
                                <button
                                    className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                                >
                                    {t('account_cancel')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Newsletter Section */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="w-5 h-5 text-[#B88644]" />
                        <h2 className="text-xl font-bold text-slate-900">{t('account_newsletter')}</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">{t('account_newsletter_subscribe')}</p>
                            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleNewsletterToggle}
                            className={`relative w-12 h-6 rounded-full transition-colors ${newsletterEnabled ? 'bg-[#B88644]' : 'bg-slate-300'}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${newsletterEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>

                    {newsletterMessage && (
                        <p className="mt-4 text-sm text-green-600 animate-in fade-in duration-300">
                            {newsletterMessage}
                        </p>
                    )}
                </div>

                {/* Payment Section */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="w-5 h-5 text-[#B88644]" />
                        <h2 className="text-xl font-bold text-slate-900">{t('account_payment')}</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center">
                                <CreditCard className="w-5 h-4 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {mockCard.brand} •••• •••• •••• {mockCard.last4}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {t('account_payment_card')} {t('account_payment_ending')} {mockCard.last4}
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-2 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors">
                            {t('account_payment_update')}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                        <Shield className="w-4 h-4" />
                        <span>{t('account_payment_secure')}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccountView;
