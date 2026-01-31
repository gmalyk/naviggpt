import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { languages } from '../../i18n/languages';

const LanguageSelector = () => {
    const { state, dispatch } = useAppState();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = languages.find(l => l.code === state.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code) => {
        dispatch({ type: ACTIONS.SET_LANGUAGE, payload: code });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLang.label}</span>
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {languages.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => handleSelect(l.code)}
                            className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm flex justify-between items-center ${state.language === l.code ? 'bg-slate-50 font-semibold' : ''}`}
                        >
                            <span>{l.label}</span>
                            <span>{l.flag}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
