import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
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

const SearchBar = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const { askVirgile, loading } = useAI();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (state.question === '') setInputValue('');
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
            <div className="relative group bg-white border border-slate-200 rounded-[32px] p-5 transition-all focus-within:border-[#B88644]/40">
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
                            className="p-2 text-[#B88644] hover:bg-[#B88644]/10 rounded-full transition-all disabled:opacity-30"
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
                            className={`px-4 py-1.5 rounded-full text-xs transition-all border ${state.profile === p.id
                                ? 'bg-white border-[#B88644] text-[#B88644] font-bold shadow-sm'
                                : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200'
                                }`}
                        >
                            {t(p.labelKey)}
                        </button>
                    ))}
                </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2 italic">{t('beta_notice')}</p>

        </section>
    );
};

export default SearchBar;
