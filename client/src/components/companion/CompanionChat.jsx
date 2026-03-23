import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useCompanion } from '../../hooks/useCompanion';
import { useTranslation } from '../../hooks/useTranslation';
import MarkdownContent from '../ui/MarkdownContent';
import Logo from '../ui/Logo';
import LogoSpinner from '../ui/LogoSpinner';

const CompanionChat = () => {
    const { messages, loading, error, sendMessage, clearConversation } = useCompanion();
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, scrollToBottom]);

    const onSend = async () => {
        if (!inputValue.trim() || loading) return;
        const text = inputValue.trim();
        setInputValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        await sendMessage(text);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)]">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Welcome message when empty */}
                    {messages.length === 0 && !loading && (
                        <div className="text-center py-16 animate-in fade-in duration-700">
                            <Logo className="w-14 h-14 mx-auto mb-4 opacity-60" />
                            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                {t('companion_welcome')}
                            </p>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, idx) => (
                        <div key={idx} className="animate-in fade-in duration-300">
                            {msg.role === 'user' ? (
                                <div className="flex justify-end">
                                    <div className="bg-slate-100 rounded-2xl px-5 py-3 max-w-[80%]">
                                        <p className="text-slate-700 text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Logo className="w-5 h-5" />
                                        <span className="text-xs font-semibold text-slate-500">{t('brand_name')}</span>
                                    </div>
                                    <div className="pl-7">
                                        <MarkdownContent content={msg.content} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex items-center gap-3 pt-8 border-t border-slate-100 animate-in fade-in">
                            <LogoSpinner className="w-6 h-6" />
                            <span className="text-sm text-slate-400">{t('companion_thinking')}</span>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="text-center py-2">
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input area */}
            <div className="border-t border-slate-100 px-4 py-3">
                <div className="max-w-3xl mx-auto relative flex items-end">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); autoResize(); }}
                        onKeyDown={onKeyDown}
                        placeholder={t('companion_placeholder')}
                        disabled={loading}
                        className="w-full py-3.5 px-5 pr-14 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B88644]/10 focus:border-[#B88644] transition-all text-sm placeholder:text-slate-400 brand-protect resize-none overflow-hidden disabled:opacity-50"
                    />
                    <button
                        onClick={onSend}
                        disabled={loading || !inputValue.trim()}
                        className="absolute right-3 bottom-[0.45rem] p-2.5 bg-[#B88644] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 brand-protect"
                    >
                        {loading ? <LogoSpinner className="w-4 h-4" /> : <Send className="w-4 h-4 rtl:scale-x-[-1]" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanionChat;
