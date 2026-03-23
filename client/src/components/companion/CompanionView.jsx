import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import CompanionChat from './CompanionChat';
import Logo from '../ui/Logo';

const CompanionView = () => {
    const { user, loading: authLoading, openAuthModal } = useAuth();
    const { t } = useTranslation();

    if (authLoading) return null;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 animate-in fade-in duration-700">
                <Logo className="w-16 h-16 mb-6 opacity-50" />
                <h2 className="text-lg font-semibold text-slate-700 mb-2">{t('companion_title')}</h2>
                <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
                    {t('companion_auth_required')}
                </p>
                <button
                    onClick={() => openAuthModal()}
                    className="px-6 py-2.5 bg-[#B88644] text-white text-sm font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-sm brand-protect"
                >
                    {t('auth_sign_in')}
                </button>
            </div>
        );
    }

    return <CompanionChat />;
};

export default CompanionView;
