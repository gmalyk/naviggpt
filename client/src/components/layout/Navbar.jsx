import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';
import Logo from '../ui/Logo';
import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import SettingsModal from './SettingsModal';

const Navbar = () => {
    const { state, dispatch } = useAppState();
    const { t } = useTranslation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const resetToHome = () => {
        dispatch({ type: ACTIONS.SET_VIEW, payload: 'home' });
    };

    const hasKey = state.settings.provider === 'openai' ? !!state.settings.openaiKey : !!state.settings.geminiKey;

    return (
        <>
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-slate-100 px-6 py-2 flex items-center justify-between h-14">
                <button onClick={resetToHome} className="flex items-center gap-3 cursor-pointer group">
                    <Logo />
                    <span className="text-lg font-semibold tracking-tight text-slate-900">{t('brand_name')}</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                    >
                        <Settings2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{state.settings.provider === 'openai' ? 'ChatGPT' : 'Gemini'}</span>
                        <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    </button>

                    <LanguageSelector />
                    <HamburgerMenu />
                </div>
            </nav>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
};

export default Navbar;
