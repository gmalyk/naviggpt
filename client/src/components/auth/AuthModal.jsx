import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

const AuthModal = () => {
    const { authModalOpen, closeAuthModal } = useAuth();
    const { t } = useTranslation();
    const [tab, setTab] = useState('sign_in');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    if (!authModalOpen) return null;

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
    };

    const handleTabSwitch = (newTab) => {
        setTab(newTab);
        resetForm();
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!supabase) { setError('Auth not configured'); setLoading(false); return; }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            resetForm();
            closeAuthModal();
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError(t('auth_passwords_mismatch'));
            return;
        }
        setLoading(true);
        if (!supabase) { setError('Auth not configured'); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setSuccess(t('auth_check_email'));
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">
                        {tab === 'sign_in' ? t('auth_sign_in') : t('auth_sign_up')}
                    </h2>
                    <button onClick={() => { resetForm(); closeAuthModal(); }} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => handleTabSwitch('sign_in')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'sign_in' ? 'text-[#B88644] border-b-2 border-[#B88644]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {t('auth_sign_in')}
                    </button>
                    <button
                        onClick={() => handleTabSwitch('sign_up')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'sign_up' ? 'text-[#B88644] border-b-2 border-[#B88644]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {t('auth_sign_up')}
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="text-sm text-slate-600">{success}</p>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={tab === 'sign_in' ? handleSignIn : handleSignUp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth_email')}</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B88644]/30 focus:border-[#B88644] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth_password')}</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B88644]/30 focus:border-[#B88644] transition-all"
                                    />
                                </div>
                                {tab === 'sign_up' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth_confirm_password')}</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B88644]/30 focus:border-[#B88644] transition-all"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2.5 bg-[#B88644] text-white text-sm font-bold rounded-full shadow-lg shadow-amber-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {loading ? '...' : (tab === 'sign_in' ? t('auth_sign_in') : t('auth_sign_up'))}
                                </button>
                            </form>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
