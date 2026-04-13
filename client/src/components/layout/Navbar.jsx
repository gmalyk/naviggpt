import React, { useState } from 'react';
import { Menu, X, Home, BookOpenText, Compass, MessageSquare, PenLine, CreditCard, Info, Users, ShieldCheck, Lock, Search, Clock, UserCircle } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';

import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import AuthModal from '../auth/AuthModal';
import UserMenu from '../auth/UserMenu';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
    const { state, dispatch } = useAppState();
    const { user, loading: authLoading, openAuthModal } = useAuth();
    const { t, language } = useTranslation();
    const blogUrl = '#';
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobilePremiumTip, setMobilePremiumTip] = useState(null);

    const hasSidebar = !!user && state.view !== 'landing';

    const resetToHome = () => {
        dispatch({ type: ACTIONS.SET_QUESTION, payload: '' });
        dispatch({ type: ACTIONS.SET_SELECTED_FILTERS, payload: [] });
        dispatch({ type: ACTIONS.SET_PRECISION, payload: '' });
        navigateTo(dispatch, user ? 'home' : 'landing');
    };

    const goMobile = (view) => {
        navigateTo(dispatch, view);
        setMobileOpen(false);
    };

    const MobileNavItem = ({ icon: Icon, label, view, onClick }) => {
        const isActive = (state.view === view && !(view === 'home' && state.dialogueActive)) || (view === 'companion' && state.dialogueActive && state.view === 'home');
        return (
            <button
                onClick={onClick || (() => goMobile(view))}
                className={`flex items-center gap-4 w-full px-5 py-3.5 text-left text-base transition-colors ${isActive
                    ? 'bg-[#7B8FA3]/10 text-[#7B8FA3] font-semibold'
                    : 'text-slate-700 active:bg-slate-50'
                    }`}
            >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#7B8FA3]' : 'text-slate-400'}`} />
                <span>{label}</span>
            </button>
        );
    };

    return (
        <>
            {/* --- Top bar --- */}
            <nav className={`fixed top-0 right-0 bg-white/95 backdrop-blur-sm z-[60] border-b border-slate-100 px-4 md:px-6 py-2 flex items-center justify-between h-14 transition-[left] duration-200 left-0 ${hasSidebar ? (state.sidebarOpen ? 'md:left-60' : 'md:left-14') : ''}`}>
                {/* Left: logo (always on mobile, only when no sidebar on desktop) */}
                <button onClick={resetToHome} className={`flex items-center gap-2 cursor-pointer group ${hasSidebar ? 'md:hidden' : ''}`}>
                    <img src="/logo.png" alt="NavigGPT" className="w-9 h-9 transition-transform hover:scale-105" />
                    <span className="text-lg font-semibold tracking-tight text-slate-600">
                        {t('brand_name').split('').map((char, i) =>
                            char.toLowerCase() === 'g' ? (
                                <span
                                    key={i}
                                    className="bg-clip-text text-transparent brand-protect"
                                    style={{ backgroundImage: 'radial-gradient(circle, #A3B5C7 0%, #7B8FA3 60%, #4A5E72 100%)', colorScheme: 'light only' }}
                                >
                                    {char}
                                </span>
                            ) : char
                        )}
                    </span>
                </button>
                {/* Desktop spacer when sidebar present */}
                {hasSidebar && <div className="hidden md:block" />}

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <LanguageSelector />
                    {!authLoading && (
                        user ? (
                            <UserMenu />
                        ) : (
                            <button
                                onClick={() => openAuthModal()}
                                className="px-4 py-1.5 bg-[#7B8FA3] text-white text-xs font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-sm brand-protect"
                            >
                                {t('auth_sign_in')}
                            </button>
                        )
                    )}
                    {/* Mobile hamburger (logged-in users) */}
                    {hasSidebar && (
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                    {/* Desktop-only: landing hamburger */}
                    {!hasSidebar && <span className="hidden md:block"><HamburgerMenu /></span>}
                    {/* Mobile: landing hamburger */}
                    {!hasSidebar && (
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </nav>

            {/* --- Full-screen mobile menu --- */}
            <div
                className={`fixed inset-0 z-[200] bg-white flex flex-col transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100 shrink-0">
                    <button onClick={() => { resetToHome(); setMobileOpen(false); }} className="flex items-center gap-2">
                        <img src="/logo.png" alt="NavigGPT" className="w-9 h-9" />
                        <span className="text-lg font-semibold tracking-tight text-slate-600">
                            {t('brand_name').split('').map((char, i) =>
                                char.toLowerCase() === 'g' ? (
                                    <span
                                        key={i}
                                        className="bg-clip-text text-transparent brand-protect"
                                        style={{ backgroundImage: 'radial-gradient(circle, #A3B5C7 0%, #7B8FA3 60%, #4A5E72 100%)' }}
                                    >
                                        {char}
                                    </span>
                                ) : char
                            )}
                        </span>
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav items */}
                <div className="flex-1 overflow-y-auto py-2">
                    {/* Primary */}
                    <div className="py-1">
                        <MobileNavItem icon={Home} label={t('menu_home')} view="home" onClick={() => {
                            dispatch({ type: ACTIONS.SET_DIALOGUE_ACTIVE, payload: false });
                            goMobile('home');
                        }} />
                        {user && (
                            <MobileNavItem icon={BookOpenText} label={t('menu_companion')} view="companion" onClick={() => {
                                dispatch({ type: ACTIONS.SET_DIALOGUE_ACTIVE, payload: true });
                                if (!state.dialogueMode) dispatch({ type: ACTIONS.SET_DIALOGUE_MODE, payload: 'socrate' });
                                navigateTo(dispatch, 'home');
                                setMobileOpen(false);
                            }} />
                        )}
                        <MobileNavItem icon={Compass} label={t('menu_compass')} view="compass" />
                    </div>

                    {/* Theme */}
                    <div className="px-5 py-2">
                        <ThemeSwitcher expanded={true} />
                    </div>

                    {/* Premium features (disabled) */}
                    {user && (
                        <div className="py-1">
                            {[
                                { icon: Search, label: t('nav_research') },
                                { icon: Clock, label: t('nav_history') },
                                { icon: UserCircle, label: t('nav_profiles') },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="relative flex items-center gap-4 w-full px-5 py-3.5 text-base opacity-40"
                                    onClick={() => setMobilePremiumTip(prev => prev === label ? null : label)}
                                >
                                    <Icon className="w-5 h-5 shrink-0 text-slate-400" />
                                    <span className="text-slate-400">{label}</span>
                                    {mobilePremiumTip === label && (
                                        <span className="absolute left-16 top-full -mt-1 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1.5 text-[11px] text-white z-[70] shadow-lg animate-in fade-in duration-150">
                                            {t('premium_upgrade_hint') || 'Upgrade your plan to access this feature'}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mx-5 my-2 border-t border-slate-100" />

                    {/* Secondary */}
                    <div className="py-1">
                        <MobileNavItem icon={CreditCard} label={t('menu_pricing')} view="pricing" />
                        <MobileNavItem icon={Info} label={t('menu_about')} view="about" />
                        <MobileNavItem icon={Users} label={t('menu_contact')} view="contact" />
                        <MobileNavItem icon={PenLine} label={t('menu_blog')} view="blog" onClick={() => { window.open(blogUrl, '_blank'); setMobileOpen(false); }} />
                        <MobileNavItem icon={MessageSquare} label={t('menu_forum')} view="forum" />
                    </div>

                    <div className="mx-5 my-2 border-t border-slate-100" />

                    {/* Legal */}
                    <div className="py-1">
                        <MobileNavItem icon={ShieldCheck} label={t('menu_terms')} view="terms" />
                        <MobileNavItem icon={Lock} label={t('menu_privacy')} view="privacy" />
                    </div>

                    {/* Usage meter */}
                    {user && state.usage.loaded && !state.usage.exempt && (
                        <div className="mx-5 mt-4 px-4 py-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    {t('usage_title') || 'Usage'}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {state.usage.used}/{state.usage.limit}
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#7B8FA3] rounded-full transition-all"
                                    style={{ width: `${Math.min(100, (state.usage.used / state.usage.limit) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom: sign in or user info */}
                {!authLoading && !user && (
                    <div className="p-5 border-t border-slate-100 shrink-0">
                        <button
                            onClick={() => { openAuthModal(); setMobileOpen(false); }}
                            className="w-full py-3 bg-[#7B8FA3] text-white text-sm font-bold rounded-full active:scale-95 transition-all shadow-sm"
                        >
                            {t('auth_sign_in')}
                        </button>
                    </div>
                )}
            </div>

            <AuthModal />
        </>
    );
};

export default Navbar;
