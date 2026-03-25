import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Compass, Copy, Check } from 'lucide-react';
import { useCompanion } from '../../hooks/useCompanion';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import MarkdownContent from '../ui/MarkdownContent';
import Logo from '../ui/Logo';
import LogoSpinner from '../ui/LogoSpinner';
import SubscriptionModal from '../ui/SubscriptionModal';

const sageImages = { socrate: '/socrate.png', nestor: '/nestor.png', plutarque: '/plutarque.png' };

const getSuggestions = (mode, t) => [
    t(`companion_suggest_${mode}_1`),
    t(`companion_suggest_${mode}_2`),
    t(`companion_suggest_${mode}_3`),
];

const CompanionChat = () => {
    const { messages, loading, error, sendMessage, clearConversation, conversationCount, hasReachedConversationLimit } = useCompanion();
    const { state: appState, dispatch } = useAppState();
    const { t } = useTranslation();
    const dialogueMode = appState.dialogueMode;
    const [inputValue, setInputValue] = useState('');
    const [suggestionsUsed, setSuggestionsUsed] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [compassInviteDismissed, setCompassInviteDismissed] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const prevModeRef = useRef(dialogueMode);
    const pendingHandled = useRef(false);

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

    useEffect(() => {
        if (hasReachedConversationLimit && messages.length === 0) {
            setShowSubscriptionModal(true);
        }
    }, [hasReachedConversationLimit, messages.length]);

    // Clear conversation when dialogue mode changes
    useEffect(() => {
        if (prevModeRef.current !== dialogueMode && messages.length > 0) {
            clearConversation();
            setSuggestionsUsed(false);
        }
        prevModeRef.current = dialogueMode;
    }, [dialogueMode]);

    // Handle pending companion message from SearchBar
    useEffect(() => {
        if (appState.pendingCompanionMessage && !pendingHandled.current) {
            pendingHandled.current = true;
            const msg = appState.pendingCompanionMessage;
            dispatch({ type: ACTIONS.SET_PENDING_COMPANION_MESSAGE, payload: null });
            sendMessage(msg);
        }
    }, [appState.pendingCompanionMessage]);

    const onSend = async () => {
        if (!inputValue.trim() || loading) return;
        const text = inputValue.trim();
        setInputValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        await sendMessage(text);
    };

    const copyExchange = (assistantIdx) => {
        const userMsg = messages[assistantIdx - 1];
        const assistantMsg = messages[assistantIdx];
        const text = `Q: ${userMsg?.content || ''}\n\nA: ${assistantMsg.content}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIdx(assistantIdx);
            setTimeout(() => setCopiedIdx(null), 2000);
        });
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
                    {/* Mode badge */}
                    {dialogueMode && (
                        <div className="text-center pt-2 pb-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#B88644]/10 text-[#B88644] font-medium">
                                <img src={sageImages[dialogueMode]} alt={t(`sage_${dialogueMode}`)} className="w-5 h-5 rounded-full object-cover" />
                                {t(`sage_${dialogueMode}`)} — {t(`sage_${dialogueMode}_subtitle`)}
                            </span>
                        </div>
                    )}

                    {/* Welcome message when empty */}
                    {messages.length === 0 && !loading && !hasReachedConversationLimit && (
                        <div className="text-center py-16 animate-in fade-in duration-700">
                            <Logo className="w-14 h-14 mx-auto mb-4 opacity-60" />
                            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                {t('companion_welcome')}
                            </p>
                        </div>
                    )}

                    {/* Limit reached message */}
                    {hasReachedConversationLimit && messages.length === 0 && (
                        <div className="text-center py-16 animate-in fade-in duration-700">
                            <Logo className="w-14 h-14 mx-auto mb-4 opacity-40" />
                            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                {t('companion_limit_reached')}
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
                                        <button
                                            onClick={() => copyExchange(idx)}
                                            className="mt-2 p-1.5 text-slate-300 hover:text-[#B88644] transition-colors rounded-md hover:bg-[#B88644]/5"
                                            title={t('copy_exchange')}
                                        >
                                            {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Suggested follow-up questions */}
                    {dialogueMode && messages.length === 2 && !loading && !suggestionsUsed && (
                        <div className="flex flex-wrap gap-2 justify-center animate-in fade-in duration-500">
                            {getSuggestions(dialogueMode, t).map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setSuggestionsUsed(true); sendMessage(suggestion); }}
                                    className="px-4 py-2 text-xs text-[#B88644] bg-[#B88644]/5 border border-[#B88644]/20 rounded-full hover:bg-[#B88644]/10 hover:border-[#B88644]/40 transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Values compass invitation after 2-3 exchanges */}
                    {messages.length >= 4 && !loading && !compassInviteDismissed && appState.values.length === 0 && (
                        <div className="mx-auto max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-gradient-to-r from-[#B88644]/5 to-[#B88644]/10 border border-[#B88644]/20 rounded-2xl p-5 text-center">
                                <Compass className="w-6 h-6 text-[#B88644] mx-auto mb-2" />
                                <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                    {t('companion_compass_invite')}
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => {
                                            dispatch({ type: ACTIONS.SET_RETURN_TO_VIEW, payload: 'companion' });
                                            dispatch({ type: ACTIONS.SET_VIEW, payload: 'compass' });
                                        }}
                                        className="px-5 py-2 text-sm font-medium text-white bg-[#B88644] rounded-full hover:bg-[#a07638] transition-all shadow-sm"
                                    >
                                        {t('companion_compass_invite_btn')}
                                    </button>
                                    <button
                                        onClick={() => setCompassInviteDismissed(true)}
                                        className="text-xs text-slate-400 hover:text-slate-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
            {!hasReachedConversationLimit && (
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
            )}

            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                feature="companion"
            />
        </div>
    );
};

export default CompanionChat;
