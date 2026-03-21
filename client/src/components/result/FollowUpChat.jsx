import React, { useState, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import { useTranslation } from '../../hooks/useTranslation';
import MarkdownContent from '../ui/MarkdownContent';
import CopyButton from '../ui/CopyButton';
import Logo from '../ui/Logo';
import LogoSpinner from '../ui/LogoSpinner';

const FollowUpChat = () => {
    const { state } = useAppState();
    const { handleFollowUp, loading } = useAI();
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null);

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

    const hasReachedLimit = state.followUpHistory.length >= 1;

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

            {!hasReachedLimit && !loading && (
                <div className="relative flex items-end">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); autoResize(); }}
                        onKeyDown={onKeyDown}
                        placeholder={t('followup_placeholder')}
                        className="w-full py-3.5 px-5 pr-14 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B88644]/10 focus:border-[#B88644] transition-all text-sm placeholder:text-slate-400 brand-protect resize-none overflow-hidden"
                    />
                    <button
                        onClick={onSend}
                        disabled={loading || !inputValue.trim()}
                        className="absolute right-3 p-2.5 bg-[#B88644] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 brand-protect"
                    >
                        {loading ? <LogoSpinner className="w-4 h-4" /> : <Send className="w-4 h-4 rtl:scale-x-[-1]" />}
                    </button>
                </div>
            )}
        </section>
    );
};

export default FollowUpChat;
