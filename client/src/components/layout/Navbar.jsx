import React from 'react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';

import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import AuthModal from '../auth/AuthModal';
import UserMenu from '../auth/UserMenu';

const Navbar = () => {
    const { state, dispatch } = useAppState();
    const { user, loading: authLoading, openAuthModal } = useAuth();
    const { t } = useTranslation();

    const resetToHome = () => {
        dispatch({ type: ACTIONS.SET_QUESTION, payload: '' });
        dispatch({ type: ACTIONS.SET_SELECTED_FILTERS, payload: [] });
        dispatch({ type: ACTIONS.SET_PRECISION, payload: '' });
        navigateTo(dispatch, 'home');
    };

    return (
        <>
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-[100] border-b border-slate-100 px-6 py-2 flex items-center justify-between h-14">
                <button onClick={resetToHome} className="flex items-center gap-2 cursor-pointer group">
                    <img src="/logo.png" alt="Virgile" className="w-9 h-9 transition-transform hover:scale-105" />
                    <span className="text-lg font-semibold tracking-tight text-slate-600">
                        {t('brand_name').split('').map((char, i) =>
                            char.toLowerCase() === 'g' ? (
                                <span
                                    key={i}
                                    className="bg-clip-text text-transparent brand-protect"
                                    style={{ backgroundImage: 'radial-gradient(circle, #D9B06A 0%, #B88644 60%, #8C6230 100%)', colorScheme: 'light only' }}
                                >
                                    {char}{char}
                                </span>
                            ) : char
                        )}
                    </span>
                </button>

                <div className="flex items-center gap-3">
                    <LanguageSelector />
                    {!authLoading && (
                        user ? (
                            <UserMenu />
                        ) : (
                            <button
                                onClick={() => openAuthModal()}
                                className="px-4 py-1.5 bg-[#B88644] text-white text-xs font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-sm brand-protect"
                            >
                                {t('auth_sign_in')}
                            </button>
                        )
                    )}
                    <HamburgerMenu />
                </div>
            </nav>

            <AuthModal />
        </>
    );
};

export default Navbar;
