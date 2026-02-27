import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Sparkles, Shield } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const ForumView = () => {
    const { t } = useTranslation();
    const { user, openAuthModal } = useAuth();
    const [status, setStatus] = useState(null); // null | 'pending' | 'accepted'
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!supabase) { setLoading(false); return; }

        try {
            if (user) {
                const { data } = await supabase
                    .from('forum_guestlist')
                    .select('status')
                    .eq('user_id', user.id)
                    .single();
                setStatus(data?.status || null);
            } else {
                setStatus(null);
            }
        } catch {
            // table may not exist yet
        }
        setLoading(false);
    };

    const handleJoin = () => {
        if (!user) { openAuthModal(); return; }
        setConfirming(true);
    };

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('forum_guestlist')
                .insert({
                    user_id: user.id,
                    email: user.email,
                    status: 'pending'
                });
            if (!error) {
                setStatus('pending');
            }
        } catch {
            // handle silently
        }
        setSubmitting(false);
        setConfirming(false);
    };

    return (
        <section className="py-16 px-6 max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="rounded-3xl border border-slate-200 bg-white p-12 md:p-16 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center gap-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B88644]/10 rounded-full border border-[#B88644]/20">
                        <Shield className="w-3.5 h-3.5 text-[#B88644]" />
                        <span className="text-xs font-semibold text-[#B88644] tracking-wide uppercase">
                            {t('forum_guestlist_badge')}
                        </span>
                    </div>

                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center ring-1 ring-slate-200">
                        <Users className="w-9 h-9 text-[#B88644]" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        {t('forum_guestlist_title')}
                    </h1>

                    <p className="text-slate-500 max-w-xl leading-relaxed text-sm md:text-base">
                        {t('forum_description')}
                    </p>

                    <p className="text-slate-500 max-w-xl leading-relaxed text-sm md:text-base">
                        {t('forum_guestlist_text')}
                    </p>

                    {loading ? (
                        <div className="w-8 h-8 border-2 border-[#B88644]/30 border-t-[#B88644] rounded-full animate-spin" />
                    ) : status === 'accepted' ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 rounded-full border border-emerald-200">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">
                                    {t('forum_guestlist_accepted')}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">{t('forum_guestlist_accepted_text')}</p>
                        </div>
                    ) : status === 'pending' ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 rounded-full border border-amber-200">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-700">
                                    {t('forum_guestlist_pending')}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">{t('forum_guestlist_pending_text')}</p>
                        </div>
                    ) : confirming ? (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                            <p className="text-sm text-slate-600 font-medium">
                                {t('forum_guestlist_confirm_text')}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setConfirming(false)}
                                    disabled={submitting}
                                    className="px-6 py-2.5 text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-60"
                                >
                                    {t('forum_guestlist_cancel')}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={submitting}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B88644] hover:bg-[#A07638] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                    {t('forum_guestlist_confirm')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleJoin}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#B88644] hover:bg-[#A07638] text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Sparkles className="w-4 h-4" />
                            {t('forum_guestlist_join')}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ForumView;
