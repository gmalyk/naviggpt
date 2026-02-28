import React, { useEffect, useRef } from 'react';
import { Send, Globe } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import { useAI } from '../../hooks/useAI';
import LogoSpinner from '../ui/LogoSpinner';

const profiles = [
    { id: 'kid', labelKey: 'prof_kid' },
    { id: 'teen', labelKey: 'prof_teen' },
    { id: 'adult', labelKey: 'prof_adult' },
    { id: 'senior', labelKey: 'prof_senior' }
];

const filterCountCycle = [5, 3, 0];

const SearchBar = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const { askVirgile, loading } = useAI();
    const inputValue = state.inputDraft;
    const setInputValue = (val) => dispatch({ type: ACTIONS.SET_INPUT_DRAFT, payload: val });

    const prevQuestionRef = useRef(state.question);

    useEffect(() => {
        if (prevQuestionRef.current !== '' && state.question === '') {
            setInputValue('');
        }
        prevQuestionRef.current = state.question;
    }, [state.question]);

    const handleSend = () => {
        if (!inputValue.trim() || loading) return;

        askVirgile(inputValue.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <section className="max-w-2xl w-full mx-auto mb-8 relative z-50">
            <div className="relative group bg-white border border-slate-200 rounded-[32px] p-5 transition-all focus-within:border-[#B88644]/40 brand-protect">
                <div className="flex items-center gap-3 mb-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('search_placeholder')}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-lg md:text-xl px-2 text-slate-700 placeholder:text-slate-400 w-full"
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

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2 mt-2 border-t border-slate-200/60">
                    {profiles.map(p => (
                        <button
                            key={p.id}
                            onClick={() => dispatch({ type: ACTIONS.SET_PROFILE, payload: p.id })}
                            className={`px-4 py-1.5 rounded-full text-xs transition-all border brand-protect ${state.profile === p.id
                                ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                                : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200'
                                }`}
                        >
                            {t(p.labelKey)}
                        </button>
                    ))}
                    <button
                        onClick={() => dispatch({ type: ACTIONS.SET_WEB_SEARCH, payload: !state.useWebSearch })}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all border flex items-center gap-1.5 ml-auto brand-protect ${state.useWebSearch
                            ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                            : 'bg-white/60 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200'
                            }`}
                        title={t('web_search_tooltip')}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{t('web_search_label')}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 self-center mr-1">{t('filter_count_label')}</span>
                    <button
                        onClick={() => {
                            const currentIndex = filterCountCycle.indexOf(state.filterCount);
                            const nextValue = filterCountCycle[(currentIndex + 1) % filterCountCycle.length];
                            dispatch({ type: ACTIONS.SET_FILTER_COUNT, payload: nextValue });
                        }}
                        className="px-4 py-1.5 rounded-full text-xs transition-all border border-[#B88644] bg-white shadow-sm brand-protect"
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
                </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2 italic">{t('beta_notice')}</p>

        </section>
    );
};

export default SearchBar;
