import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Globe, Sparkles, Compass, Plus } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import { useAI } from '../../hooks/useAI';
import { useAuth } from '../../context/AuthContext';
import { navigateTo } from '../../hooks/useRouting';
import LogoSpinner from '../ui/LogoSpinner';

const profiles = [
    { id: 'kid', labelKey: 'prof_kid' },
    { id: 'teen', labelKey: 'prof_teen' },
    { id: 'adult', labelKey: 'prof_adult' },
    { id: 'senior', labelKey: 'prof_senior' }
];

const filterCountCycle = [0, 3, 5];

const sages = [
    { id: 'socrate', image: '/socrate.png', labelKey: 'sage_socrate', tooltipKey: 'sage_socrate_tooltip', hoverColor: 'hover:bg-[#D49078]/15 hover:border-[#D49078]', bgColor: '#D49078' },
    { id: 'nestor', image: '/nestor.png', labelKey: 'sage_nestor', tooltipKey: 'sage_nestor_tooltip', hoverColor: 'hover:bg-[#E6C15A]/15 hover:border-[#E6C15A]', bgColor: '#E6C15A' },
    { id: 'plutarque', image: '/plutarque.png', labelKey: 'sage_plutarque', tooltipKey: 'sage_plutarque_tooltip', hoverColor: 'hover:bg-[#A39656]/15 hover:border-[#A39656]', bgColor: '#A39656' },
];

const topics = [
    { id: 'reflect', labelKey: 'topic_reflect', prompts: ['topic_reflect_1', 'topic_reflect_2', 'topic_reflect_3'] },
    { id: 'decide', labelKey: 'topic_decide', prompts: ['topic_decide_1', 'topic_decide_2', 'topic_decide_3'] },
    { id: 'understand', labelKey: 'topic_understand', prompts: ['topic_understand_1', 'topic_understand_2', 'topic_understand_3'] },
    { id: 'relationships', labelKey: 'topic_relationships', prompts: ['topic_relationships_1', 'topic_relationships_2', 'topic_relationships_3'] },
    { id: 'surprise', labelKey: 'topic_surprise', prompts: ['topic_surprise_1', 'topic_surprise_2', 'topic_surprise_3'] },
];

const SearchBar = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const { askVirggile, loading } = useAI();
    const { user, openAuthModal } = useAuth();
    const inputValue = state.inputDraft;
    const setInputValue = (val) => dispatch({ type: ACTIONS.SET_INPUT_DRAFT, payload: val });
    const [expandedTopic, setExpandedTopic] = useState(null);

    const prevQuestionRef = useRef(state.question);
    const textareaRef = useRef(null);

    const autoResize = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }, []);

    useEffect(() => {
        if (prevQuestionRef.current !== '' && state.question === '') {
            setInputValue('');
        }
        prevQuestionRef.current = state.question;
    }, [state.question]);

    useEffect(() => {
        autoResize();
    }, [inputValue, autoResize]);

    const handleSend = () => {
        if (!inputValue.trim() || loading) return;

        if (state.dialogueActive && state.dialogueMode) {
            if (!user) {
                openAuthModal('sign_in', t('companion_auth_required'));
                return;
            }
            dispatch({ type: ACTIONS.SET_PENDING_COMPANION_MESSAGE, payload: inputValue.trim() });
            setInputValue('');
            navigateTo(dispatch, 'companion');
            return;
        }

        askVirggile(inputValue.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <section className="max-w-2xl w-full mx-auto mb-8 relative z-50">
            <div className="relative group bg-white border border-slate-200 rounded-[32px] p-5 transition-all focus-within:border-[#B88644]/40 brand-protect">
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative group/attach shrink-0">
                        <button
                            disabled
                            className="p-2 rounded-full text-slate-300 cursor-not-allowed opacity-40 transition-all"
                            title={t('nav_upgrade_tooltip')}
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-slate-800 text-white text-[11px] leading-snug px-3 py-2 opacity-0 group-hover/attach:opacity-100 transition-opacity z-50 text-center shadow-lg">
                            {t('nav_upgrade_tooltip')}
                        </span>
                    </div>
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={state.dialogueActive ? t('companion_input_placeholder') : t('search_placeholder')}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-lg md:text-xl px-2 text-slate-700 placeholder:text-slate-400 w-full resize-none overflow-hidden"
                    />
                    <div className="flex items-center gap-1 pr-1">
                        <button
                            onClick={handleSend}
                            disabled={loading || !inputValue.trim()}
                            className={`p-2 text-[#B88644] hover:bg-[#B88644]/10 rounded-full transition-all brand-protect ${loading ? '' : 'disabled:opacity-30'}`}
                        >
                            {loading ? <LogoSpinner className="w-6 h-6" /> : <Send className="w-6 h-6 rtl:scale-x-[-1]" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center justify-center sm:justify-start pt-2 mt-2 border-t border-slate-200/60">
                    {profiles.map(p => (
                        <button
                            key={p.id}
                            onClick={() => dispatch({ type: ACTIONS.SET_PROFILE, payload: p.id })}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all border brand-protect ${state.profile === p.id
                                ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                                : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-[#B88644]/10 hover:border-[#B88644]/40 hover:text-[#B88644]'
                                }`}
                        >
                            {t(p.labelKey)}
                        </button>
                    ))}
                    {!state.dialogueActive && (
                        <>
                            <button
                                onClick={() => dispatch({ type: ACTIONS.SET_WEB_SEARCH, payload: !state.useWebSearch })}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all border flex items-center gap-1.5 brand-protect ${state.useWebSearch
                                    ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                                    : 'bg-white/60 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200'
                                    }`}
                                title={t('web_search_tooltip')}
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>{t('web_search_label')}</span>
                            </button>
                            <div className="relative group/keys flex items-center gap-1.5">
                                <span className="shrink-0 text-[10px] text-slate-400 self-center mr-1">{t('filter_count_label')}</span>
                                <button
                                    onClick={() => {
                                        const currentIndex = filterCountCycle.indexOf(state.filterCount);
                                        const nextValue = filterCountCycle[(currentIndex + 1) % filterCountCycle.length];
                                        dispatch({ type: ACTIONS.SET_FILTER_COUNT, payload: nextValue });
                                    }}
                                    className="peer shrink-0 px-4 py-1.5 rounded-full text-xs transition-all border border-[#B88644] bg-white shadow-sm brand-protect"
                                >
                                    {filterCountCycle.map((val, i) => (
                                        <span key={val}>
                                            <span className={state.filterCount === val ? 'text-[#B88644] font-bold brand-protect' : 'text-slate-300'}>
                                                {val}
                                            </span>
                                            {i < filterCountCycle.length - 1 && <span className="text-slate-300 mx-0.5">·</span>}
                                        </span>
                                    ))}
                                </button>
                                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-slate-800 text-white text-[11px] leading-snug px-3 py-2 opacity-0 peer-hover:opacity-100 transition-opacity z-50 text-center shadow-lg">
                                    {t('keys_tooltip')}
                                </span>
                            </div>
                            <div className="relative group/compass">
                                <button
                                    onClick={() => {
                                        dispatch({ type: ACTIONS.SET_RETURN_TO_VIEW, payload: state.view || 'home' });
                                        navigateTo(dispatch, 'compass');
                                    }}
                                    className="peer shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center brand-protect"
                                >
                                    <Compass className={`w-4 h-4 transition-colors ${state.values?.length > 0 ? 'text-[#B88644]' : 'text-slate-400 group-hover/compass:text-[#B88644]'}`} />
                                    {state.values?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B88644] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                            {state.values.length}
                                        </span>
                                    )}
                                </button>
                                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-slate-800 text-white text-[11px] leading-snug px-3 py-2 opacity-0 peer-hover:opacity-100 transition-opacity z-50 text-center shadow-lg">
                                    {state.values?.length > 0
                                        ? `${state.values.length} ${t('values_selected_count')}`
                                        : t('compass_fab_hint')
                                    }
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {state.dialogueActive && (
                    <div className="flex gap-1.5 items-center justify-center sm:justify-start pt-1.5 mt-1.5">
                        {sages.map(s => (
                            <div key={s.id} className={`relative group/${s.id}`}>
                                <button
                                    onClick={() => dispatch({ type: ACTIONS.SET_DIALOGUE_MODE, payload: s.id })}
                                    className={`peer shrink-0 px-3 py-1.5 rounded-full text-xs transition-all border flex items-center gap-1.5 brand-protect ${state.dialogueMode === s.id
                                        ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                                        : `bg-white/60 border-slate-100 text-slate-600 ${s.hoverColor}`
                                        }`}
                                >
                                    <img src={s.image} alt={t(s.labelKey)} className="w-5 h-5 rounded-full object-cover" style={{ backgroundColor: s.bgColor }} />
                                    <span>{t(s.labelKey)}</span>
                                </button>
                                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-slate-800 text-white text-[11px] leading-snug px-3 py-2 opacity-0 peer-hover:opacity-100 transition-opacity z-50 text-center shadow-lg">
                                    {t(s.tooltipKey)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Topic starters */}
            {!inputValue.trim() && !loading && (
                <div className="mt-3 flex flex-col items-center gap-2">
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
                                        setInputValue(t(promptKey));
                                        setExpandedTopic(null);
                                        textareaRef.current?.focus();
                                    }}
                                    className="px-4 py-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-2xl hover:border-[#B88644]/40 hover:text-[#B88644] transition-all shadow-sm"
                                >
                                    {t(promptKey)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <p className="text-center text-[10px] text-slate-400 mt-2 italic">{t('beta_notice')}</p>
            {state.usage.loaded && !state.usage.exempt && (
                <div className="mt-3 mx-auto max-w-xs">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500">
                            {t('usage_remaining').replace('{{used}}', state.usage.used).replace('{{limit}}', state.usage.limit)}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                state.usage.used >= state.usage.limit
                                    ? 'bg-red-500'
                                    : state.usage.used >= state.usage.limit - 1
                                        ? 'bg-amber-500'
                                        : 'bg-[#B88644]'
                            }`}
                            style={{ width: `${Math.min((state.usage.used / state.usage.limit) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default SearchBar;
