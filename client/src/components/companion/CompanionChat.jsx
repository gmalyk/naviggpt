import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Compass, Copy, Check, Globe, Users, Shield, UserCircle, Sparkles, Plus } from 'lucide-react';

const topics = [
    { id: 'reflect', labelKey: 'topic_reflect', prompts: ['topic_reflect_1', 'topic_reflect_2', 'topic_reflect_3'] },
    { id: 'decide', labelKey: 'topic_decide', prompts: ['topic_decide_1', 'topic_decide_2', 'topic_decide_3'] },
    { id: 'understand', labelKey: 'topic_understand', prompts: ['topic_understand_1', 'topic_understand_2', 'topic_understand_3'] },
    { id: 'relationships', labelKey: 'topic_relationships', prompts: ['topic_relationships_1', 'topic_relationships_2', 'topic_relationships_3'] },
    { id: 'surprise', labelKey: 'topic_surprise', prompts: ['topic_surprise_1', 'topic_surprise_2', 'topic_surprise_3'] },
];
import { useCompanion } from '../../hooks/useCompanion';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';
import MarkdownContent from '../ui/MarkdownContent';
import Logo from '../ui/Logo';
import LogoSpinner from '../ui/LogoSpinner';
import SubscriptionModal from '../ui/SubscriptionModal';

const sageImages = { socrate: '/socrate.png', nestor: '/nestor.png', plutarque: '/plutarque.png' };
const sageBgColors = { socrate: '#D49078', nestor: '#E6C15A', plutarque: '#A39656' };

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
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [showUploadTip, setShowUploadTip] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const prevModeRef = useRef(dialogueMode);
    const pendingHandled = useRef(false);

    const canUpload = !!appState.usage?.exempt;

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

    // Reset suggestions when dialogue mode changes (conversation persists for continuity)
    useEffect(() => {
        if (prevModeRef.current !== dialogueMode) {
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

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newFiles = files.map(file => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
        }));
        setAttachedFiles(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (idx) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const onSend = async () => {
        if ((!inputValue.trim() && attachedFiles.length === 0) || loading) return;
        const text = inputValue.trim();
        const files = [...attachedFiles];
        setInputValue('');
        setAttachedFiles([]);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        await sendMessage(text, files.length > 0 ? files : undefined);
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
                    {/* Companion switcher */}
                    <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                        {Object.keys(sageImages).map((key) => (
                            <div key={key} className="relative group">
                                <button
                                    onClick={() => dispatch({ type: ACTIONS.SET_DIALOGUE_MODE, payload: key })}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${dialogueMode === key
                                        ? 'bg-[#B88644]/10 text-[#B88644] ring-1 ring-[#B88644]/30'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                        }`}
                                >
                                    <img src={sageImages[key]} alt={t(`sage_${key}`)} className="w-5 h-5 rounded-full object-cover" style={{ backgroundColor: sageBgColors[key] }} />
                                    {t(`sage_${key}`)}
                                </button>
                                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[70]">
                                    {t(`sage_${key}_subtitle`)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Welcome message when empty */}
                    {messages.length === 0 && !loading && !hasReachedConversationLimit && (
                        <div className="text-center py-16 animate-in fade-in duration-700">
                            <Logo className="w-14 h-14 mx-auto mb-4 opacity-60" />
                            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                {t('companion_welcome')}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>10+ {t('stat_languages')}</span>
                                </div>
                                <div className="w-px h-3 bg-slate-200" />
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <UserCircle className="w-3.5 h-3.5" />
                                    <span>4 {t('stat_age_profiles')}</span>
                                </div>
                                <div className="w-px h-3 bg-slate-200" />
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>100% {t('stat_private')}</span>
                                </div>
                                <div className="w-px h-3 bg-slate-200" />
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>1k+ {t('stat_users')}</span>
                                </div>
                            </div>
                            {/* Topic starters */}
                            <div className="mt-8 flex flex-col items-center gap-2">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {topics.map(topic => (
                                        <button
                                            key={topic.id}
                                            onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs transition-all border ${
                                                expandedTopic === topic.id
                                                    ? 'bg-[#B88644]/10 border-[#B88644]/40 text-[#B88644] font-semibold'
                                                    : 'bg-white/60 border-slate-200 text-slate-500 hover:border-[#B88644]/30 hover:text-[#B88644]'
                                            } ${topic.id === 'surprise' ? 'flex items-center gap-1' : ''}`}
                                        >
                                            {topic.id === 'surprise' && <Sparkles className="w-3 h-3" />}
                                            {t(topic.labelKey)}
                                        </button>
                                    ))}
                                </div>
                                {expandedTopic && (
                                    <div className="flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                        {topics.find(tp => tp.id === expandedTopic).prompts.map((promptKey, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setExpandedTopic(null);
                                                    sendMessage(t(promptKey));
                                                }}
                                                className="px-4 py-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-2xl hover:border-[#B88644]/40 hover:text-[#B88644] transition-all shadow-sm"
                                            >
                                                {t(promptKey)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                                        {dialogueMode ? (
                                            <img src={sageImages[dialogueMode]} alt={t(`sage_${dialogueMode}`)} className="w-5 h-5 rounded-full object-cover" style={{ backgroundColor: sageBgColors[dialogueMode] }} />
                                        ) : (
                                            <Logo className="w-5 h-5" />
                                        )}
                                        <span className="text-xs font-semibold text-slate-500">
                                            {dialogueMode ? t(`sage_${dialogueMode}`) : t('brand_name')}
                                        </span>
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

                    {/* Trial CTA after first exchange */}
                    {!appState.usage?.exempt && messages.length >= 2 && messages.length <= 4 && !loading && (
                        <div className="text-center animate-in fade-in duration-700">
                            <button
                                onClick={() => navigateTo(dispatch, 'pricing')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B88644] to-[#D4A24C] text-white text-sm font-semibold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Sparkles className="w-4 h-4" />
                                {t('try_free_cta')}
                            </button>
                        </div>
                    )}

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
                    <div className="max-w-3xl mx-auto">
                        {/* Attached files chips */}
                        {attachedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 pl-12">
                                {attachedFiles.map((f, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B88644]/10 border border-[#B88644]/20 rounded-full text-xs text-[#B88644]">
                                        <span className="max-w-[150px] truncate">{f.name}</span>
                                        <button onClick={() => removeFile(idx)} className="hover:text-red-500 transition-colors">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="relative flex items-end">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,.pdf,.txt,.csv,.json,.md,.doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div className="relative group">
                                <button
                                    onClick={() => {
                                        if (canUpload) {
                                            fileInputRef.current?.click();
                                        } else {
                                            setShowUploadTip(prev => !prev);
                                        }
                                    }}
                                    className={`p-2.5 mr-2 rounded-full transition-colors ${canUpload ? 'text-slate-400 hover:text-[#B88644] hover:bg-[#B88644]/10 cursor-pointer' : 'text-slate-300'}`}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                                {/* Desktop: hover tooltip */}
                                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[70] hidden md:block">
                                    {canUpload
                                        ? (t('upload_file_tooltip') || 'Attach a file')
                                        : (t('upload_upgrade_tooltip') || 'Upgrade your plan to upload files')}
                                </span>
                                {/* Mobile: tap tooltip */}
                                {showUploadTip && !canUpload && (
                                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1.5 text-[11px] text-white z-[70] shadow-lg md:hidden animate-in fade-in duration-150">
                                        {t('upload_upgrade_tooltip') || 'Upgrade your plan to upload files'}
                                    </span>
                                )}
                            </div>
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
                                disabled={loading || (!inputValue.trim() && attachedFiles.length === 0)}
                                className="absolute right-3 bottom-[0.45rem] p-2.5 bg-[#B88644] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 brand-protect"
                            >
                                {loading ? <LogoSpinner className="w-4 h-4" /> : <Send className="w-4 h-4 rtl:scale-x-[-1]" />}
                            </button>
                        </div>
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
