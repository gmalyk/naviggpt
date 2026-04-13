import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Copy, Share2, Check } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import { useTranslation } from '../../hooks/useTranslation';
import MarkdownContent from '../ui/MarkdownContent';
import CopyButton from '../ui/CopyButton';
import Logo from '../ui/Logo';
import LogoSpinner from '../ui/LogoSpinner';
import SubscriptionModal from '../ui/SubscriptionModal';

const FOLLOW_UP_LIMIT = 20;

const FollowUpChat = () => {
    const { state } = useAppState();
    const { handleFollowUp, loading } = useAI();
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef(null);

    const hasReachedLimit = !state.usage?.exempt && state.followUpHistory.length >= FOLLOW_UP_LIMIT;

    useEffect(() => {
        if (hasReachedLimit) {
            setShowSubscriptionModal(true);
        }
    }, [hasReachedLimit]);

    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }, []);

    const onSend = async () => {
        if (!inputValue.trim() || loading) return;
        const text = inputValue.trim();
        setInputValue('');
        await handleFollowUp(text);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const buildThreadText = () => {
        return state.followUpHistory
            .map((chat) => `${chat.user}\n\n${t('brand_name')} :\n${chat.ai}`)
            .join('\n\n---\n\n');
    };

    const handleCopyThread = async () => {
        try {
            await navigator.clipboard.writeText(buildThreadText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback silent */ }
    };

    const handleShareThread = async () => {
        const text = buildThreadText();
        if (navigator.share) {
            try {
                await navigator.share({ text });
            } catch { /* cancelled */ }
        } else {
            handleCopyThread();
        }
    };

    return (
        <section className="width-full mt-6 max-w-4xl mx-auto animate-in fade-in duration-700 delay-500">
            <div className="space-y-8 mb-12">
                {state.followUpHistory.map((chat, idx) => (
                    <div key={idx} className="space-y-6 pt-8 border-t border-slate-100 animate-in fade-in">
                        <div className="flex justify-end">
                            <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-[80%]">
                                <p className="text-slate-700">{chat.user}</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <Logo className="w-6 h-6" />
                                <span className="text-sm font-semibold text-slate-700">{t('brand_name')}</span>
                            </div>
                            <MarkdownContent content={chat.ai} />
                            <CopyButton content={chat.ai} />
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-3 pt-8 border-t border-slate-100 animate-in fade-in">
                        <LogoSpinner className="w-6 h-6" />
                        <span className="text-sm text-slate-400">{t('status_in_progress')}…</span>
                    </div>
                )}
            </div>

            {hasReachedLimit && !loading && (
                <div className="text-center py-8 space-y-4 border-t border-slate-100 animate-in fade-in">
                    <p className="text-sm text-slate-500">{t('followup_limit_reached')}</p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={handleCopyThread}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {t('copy_thread')}
                        </button>
                        <button
                            onClick={handleShareThread}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#7B8FA3] hover:bg-[#5A7085] rounded-xl transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            {t('share_thread')}
                        </button>
                    </div>
                </div>
            )}

            {!hasReachedLimit && !loading && (
                <div className="relative flex items-end">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); autoResize(); }}
                        onKeyDown={onKeyDown}
                        placeholder={t('followup_placeholder')}
                        className="w-full py-3.5 px-5 pr-14 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7B8FA3]/10 focus:border-[#7B8FA3] transition-all text-sm placeholder:text-slate-400 brand-protect resize-none overflow-hidden"
                    />
                    <button
                        onClick={onSend}
                        disabled={loading || !inputValue.trim()}
                        className="absolute right-3 bottom-2.5 p-2.5 bg-[#7B8FA3] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 brand-protect"
                    >
                        {loading ? <LogoSpinner className="w-4 h-4" /> : <Send className="w-4 h-4 rtl:scale-x-[-1]" />}
                    </button>
                </div>
            )}

            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                feature="followup"
            />
        </section>
    );
};

export default FollowUpChat;
