import React, { useState } from 'react';
import { Crown, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { navigateTo } from '../../hooks/useRouting';

const AccountView = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { dispatch } = useAppState();
    const [newsletterEnabled, setNewsletterEnabled] = useState(false);
    const [newsletterMessage, setNewsletterMessage] = useState('');

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
                        <Crown className="w-5 h-5 text-[#B88644] brand-protect" />
                        <h2 className="text-xl font-bold text-slate-900">{t('account_subscription')}</h2>
                    </div>

                    <p className="text-sm text-slate-500 mb-6">
                        {t('account_no_subscription')}
                    </p>

                    <button
                        onClick={() => navigateTo(dispatch, 'pricing')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B88644] hover:bg-[#a6763b] text-white font-semibold text-sm transition-colors brand-protect"
                    >
                        {t('account_subscribe_cta')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Newsletter Section */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="w-5 h-5 text-[#B88644] brand-protect" />
                        <h2 className="text-xl font-bold text-slate-900">{t('account_newsletter')}</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">{t('account_newsletter_subscribe')}</p>
                            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleNewsletterToggle}
                            className={`relative w-12 h-6 rounded-full transition-colors brand-protect ${newsletterEnabled ? 'bg-[#B88644]' : 'bg-slate-300'}`}
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
            </div>
        </section>
    );
};

export default AccountView;
