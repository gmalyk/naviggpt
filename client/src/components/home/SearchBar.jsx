import React, { useEffect, useRef, useCallback } from 'react';
import { Send, Globe, MessageCircle } from 'lucide-react';
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

const filterCountCycle = [5, 3, 0];

const sages = [
    { id: 'socrate', image: '/socrate.png', labelKey: 'sage_socrate', tooltipKey: 'sage_socrate_tooltip' },
    { id: 'nestor', image: '/nestor.png', labelKey: 'sage_nestor', tooltipKey: 'sage_nestor_tooltip' },
    { id: 'plutarque', image: '/plutarque.png', labelKey: 'sage_plutarque', tooltipKey: 'sage_plutarque_tooltip' },
];

const SearchBar = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const { askVirggile, loading } = useAI();
    const { user, openAuthModal } = useAuth();
    const inputValue = state.inputDraft;
    const setInputValue = (val) => dispatch({ type: ACTIONS.SET_INPUT_DRAFT, payload: val });

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
                <div className="flex items-start gap-3 mb-3">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('search_placeholder')}
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

                <div className="flex flex-nowrap gap-1.5 items-center justify-center sm:justify-start pt-2 mt-2 border-t border-slate-200/60 overflow-x-auto">
                    {profiles.map(p => (
                        <button
                            key={p.id}
                            onClick={() => dispatch({ type: ACTIONS.SET_PROFILE, payload: p.id })}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all border brand-protect ${state.profile === p.id
                                ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                                : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200'
                                }`}
                        >
                            {t(p.labelKey)}
                        </button>
                    ))}
                    <button
                        onClick={() => dispatch({ type: ACTIONS.SET_DIALOGUE_ACTIVE, payload: !state.dialogueActive })}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all border flex items-center gap-1.5 brand-protect ${state.dialogueActive
                            ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                            : 'bg-white/60 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200'
                            }`}
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{t('dialogue_label')}</span>
                    </button>
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
                            <span className="shrink-0 text-[10px] text-slate-400 self-center mr-1">{t('filter_count_label')}</span>
                            <button
                                onClick={() => {
                                    const currentIndex = filterCountCycle.indexOf(state.filterCount);
                                    const nextValue = filterCountCycle[(currentIndex + 1) % filterCountCycle.length];
                                    dispatch({ type: ACTIONS.SET_FILTER_COUNT, payload: nextValue });
                                }}
                                className="shrink-0 px-4 py-1.5 rounded-full text-xs transition-all border border-[#B88644] bg-white shadow-sm brand-protect"
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
                                        : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200'
                                        }`}
                                >
                                    <img src={s.image} alt={t(s.labelKey)} className="w-5 h-5 rounded-full object-cover" />
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
            <p className="text-center text-[10px] text-slate-400 mt-2 italic">{t('beta_notice')}</p>
            {state.usage.loaded && !state.usage.exempt && (
                <p className="text-center text-[11px] text-slate-400 mt-1">
                    {t('usage_remaining').replace('{{used}}', state.usage.used).replace('{{limit}}', state.usage.limit)}
                </p>
            )}
        </section>
    );
};

export default SearchBar;
