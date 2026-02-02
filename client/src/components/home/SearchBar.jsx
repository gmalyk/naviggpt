import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import { useAI } from '../../hooks/useAI';
import Loader from '../ui/Loader';

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
    const [isFaithOpen, setIsFaithOpen] = useState(false);
    const [isValuesOpen, setIsValuesOpen] = useState(false);
    const [selectedFaithId, setSelectedFaithId] = useState(null);
    const [selectedValues, setSelectedValues] = useState([]);

    const religions = [
        { id: 'christianity', label: t('rel_christianity'), icon: '✝️' },
        { id: 'islam', label: t('rel_islam'), icon: '☪️' },
        { id: 'judaism', label: t('rel_judaism'), icon: '✡️' },
        { id: 'buddhism', label: t('rel_buddhism'), icon: '☸️' },
        { id: 'hinduism', label: t('rel_hinduism'), icon: '🕉️' },
        { id: 'sikhism', label: t('rel_sikhism'), icon: '☬' },
        { id: 'atheism', label: t('rel_atheism'), icon: '⚛️' },
        { id: 'other', label: t('rel_other'), icon: '✨' }
    ];

    const actDomains = [
        { id: 'work', label: t('act_compass_work'), icon: '💼' },
        { id: 'rel', label: t('act_compass_relationships'), icon: '❤️' },
        { id: 'perso', label: t('act_compass_personal'), icon: '📚' },
        { id: 'leisure', label: t('act_compass_leisure'), icon: '🎮' }
    ];

    const selectedFaith = religions.find(r => r.id === selectedFaithId);

    const handleSend = () => {
        if (!inputValue.trim() || loading) return;

        const valuesLabels = selectedValues.map(vId => {
            const domain = actDomains.find(d => d.id === vId);
            return domain ? domain.label : vId;
        });

        askVirgile(inputValue.trim(), selectedFaith, valuesLabels);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const toggleValue = (valId) => {
        setSelectedValues(prev =>
            prev.includes(valId) ? prev.filter(v => v !== valId) : [...prev, valId]
        );
    };

    const selectFaith = (relId) => {
        setSelectedFaithId(relId);
        setIsFaithOpen(false);
    };

    return (
        <section className="max-w-2xl w-full mx-auto mb-8 relative z-50">
            <div className="relative group bg-[#f0f4f9] border border-transparent rounded-[32px] p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('search_placeholder')}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-lg px-2 text-slate-700 placeholder:text-slate-500 w-full"
                    />
                    <div className="flex items-center gap-1 pr-1">
                        <button
                            onClick={handleSend}
                            disabled={loading || !inputValue.trim()}
                            className="p-2 text-[#B88644] hover:bg-[#B88644]/10 rounded-full transition-all disabled:opacity-30"
                        >
                            {loading ? <Loader /> : <Send className="w-6 h-6 rtl:scale-x-[-1]" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2 mt-2 border-t border-slate-200/60">
                    <div className="flex flex-wrap gap-2 border-r border-slate-200 pr-3 mr-1">
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

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setIsFaithOpen(true)}
                            className={`px-4 py-1.5 rounded-full text-xs transition-all border flex items-center gap-2 ${selectedFaith
                                ? 'bg-amber-50 border-amber-200 text-amber-700 font-medium'
                                : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200'}`}
                        >
                            <span>{selectedFaith ? selectedFaith.icon : '⛪'}</span>
                            {selectedFaith ? selectedFaith.label : t('prof_faith')}
                        </button>
                        <button
                            onClick={() => setIsValuesOpen(true)}
                            className="px-4 py-1.5 rounded-full text-xs transition-all border bg-white/60 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200 flex items-center gap-2 relative"
                        >
                            <span>🧭</span>
                            {t('prof_values')}
                            {selectedValues.length > 0 && (
                                <span className="absolute -top-2 -right-1 bg-[#B88644] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                                    {selectedValues.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2 italic">{t('beta_notice')}</p>

            {/* Modal Votre Foi */}
            {isFaithOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">{t('faith_modal_title')}</h3>
                            <button onClick={() => setIsFaithOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">✕</button>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-3">
                            {religions.map(rel => (
                                <button
                                    key={rel.id}
                                    onClick={() => selectFaith(rel.id)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all group ${selectedFaithId === rel.id
                                        ? 'border-amber-400 bg-amber-50'
                                        : 'border-slate-100 hover:border-amber-200 hover:bg-amber-50/50'
                                        }`}
                                >
                                    <span className="text-3xl group-hover:scale-110 transition-transform">{rel.icon}</span>
                                    <span className="text-xs font-medium text-slate-600">{rel.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Vos Valeurs (ACT Compass) */}
            {isValuesOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">{t('values_modal_title')}</h3>
                            <button onClick={() => setIsValuesOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="bg-amber-50 p-4 rounded-2xl mb-6 border border-amber-100">
                                <p className="text-sm text-amber-900 leading-relaxed italic">
                                    {t('act_compass_def')}
                                </p>
                            </div>

                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">{t('act_compass_example_title')}</h4>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {actDomains.map(domain => (
                                    <button
                                        key={domain.id}
                                        onClick={() => toggleValue(domain.id)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${selectedValues.includes(domain.id)
                                            ? 'border-amber-400 bg-amber-50 shadow-sm'
                                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <span className="text-2xl">{domain.icon}</span>
                                        <span className={`text-xs font-bold ${selectedValues.includes(domain.id) ? 'text-amber-900' : 'text-slate-700'}`}>
                                            {domain.label}
                                        </span>
                                        {selectedValues.includes(domain.id) && (
                                            <div className="ml-auto bg-amber-500 rounded-full p-0.5 animate-in zoom-in duration-200">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setIsValuesOpen(false);
                                    setInputValue(t('ai_help_query'));
                                    handleSend();
                                }}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                            >
                                <span className="text-xl">✨</span>
                                {t('ai_help_values_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SearchBar;
