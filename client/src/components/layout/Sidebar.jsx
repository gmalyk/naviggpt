import React from 'react';
import { Home, BookOpenText, Compass, MessageSquare, PenLine, Search, Clock, UserCircle, CreditCard, Info, Users, ShieldCheck, Lock, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';
import ThemeSwitcher from './ThemeSwitcher';

const Sidebar = () => {
    const { state, dispatch } = useAppState();
    const { user } = useAuth();
    const { t, language } = useTranslation();
    const blogUrl = '#';
    const isOpen = state.sidebarOpen;

    const toggle = () => {
        dispatch({ type: ACTIONS.SET_SIDEBAR_OPEN, payload: !isOpen });
    };

    const go = (view) => {
        navigateTo(dispatch, view);
    };

    const NavItem = ({ icon: Icon, label, view, onClick, small }) => {
        const isActive = (state.view === view && !(view === 'home' && state.dialogueActive)) || (view === 'companion' && state.dialogueActive && state.view === 'home');
        return (
            <div className="relative group">
                <button
                    onClick={onClick || (() => go(view))}
                    className={`flex items-center w-full rounded-lg transition-colors ${isOpen ? 'gap-3 px-3 py-2' : 'justify-center px-0 py-2.5'
                        } ${small ? 'text-xs text-slate-500 hover:text-slate-700' : 'text-sm'
                        } ${isActive
                            ? 'bg-[#7B8FA3]/10 text-[#7B8FA3] font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[#7B8FA3]' : 'text-slate-400'}`} />
                    {isOpen && <span className="truncate">{label}</span>}
                </button>
                {!isOpen && (
                    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[70]">
                        {label}
                    </span>
                )}
            </div>
        );
    };

    if (!user || state.view === 'landing') return null;

    return (
        <>
            <aside
                className={`hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-slate-100 z-50 flex-col overflow-y-auto overflow-x-hidden transition-[width] duration-200 ease-in-out ${isOpen ? 'w-60' : 'w-14'
                    }`}
            >
                {/* Logo + toggle */}
                <div className={`flex items-center h-14 shrink-0 ${isOpen ? 'justify-between px-3' : 'justify-center'}`}>
                    {isOpen ? (
                        <>
                            <button onClick={() => { dispatch({ type: ACTIONS.SET_DIALOGUE_ACTIVE, payload: false }); go('home'); }} className="flex items-center gap-2 cursor-pointer">
                                <img src="/logo.png" alt="NavigGPT" className="w-8 h-8" />
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
                                onClick={toggle}
                                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <PanelLeftClose className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <div className="relative group">
                            <button
                                onClick={toggle}
                                className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                            >
                                <img src="/logo.png" alt="NavigGPT" className="w-8 h-8 rounded-full" />
                            </button>
                            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[70]">
                                Open sidebar
                            </span>
                        </div>
                    )}
                </div>

                {/* Primary nav */}
                <div className={`pb-3 space-y-0.5 ${isOpen ? 'px-3' : 'px-2'}`}>
                    <NavItem icon={Home} label={t('menu_home')} view="home" onClick={() => {
                        dispatch({ type: ACTIONS.SET_DIALOGUE_ACTIVE, payload: false });
                        go('home');
                    }} />
                    <NavItem icon={BookOpenText} label={t('menu_companion')} view="companion" onClick={() => {
                        dispatch({ type: ACTIONS.SET_DIALOGUE_ACTIVE, payload: true });
                        if (!state.dialogueMode) dispatch({ type: ACTIONS.SET_DIALOGUE_MODE, payload: 'socrate' });
                        go('home');
                    }} />
                    <NavItem icon={Compass} label={t('menu_compass')} view="compass" />
                </div>

                {/* Premium features (disabled) */}
                <div className={`pb-3 space-y-0.5 ${isOpen ? 'px-3' : 'px-2'}`}>
                    {[
                        { icon: Search, label: t('nav_research') },
                        { icon: Clock, label: t('nav_history') },
                        { icon: UserCircle, label: t('nav_profiles') },
                    ].map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className={`sidebar-disabled-item relative group flex items-center w-full rounded-lg opacity-40 ${isOpen ? 'gap-3 px-3 py-2' : 'justify-center px-0 py-2.5'}`}
                            style={{ cursor: 'not-allowed' }}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0 text-slate-400" />
                            {isOpen && <span className="truncate text-sm text-slate-400">{label}</span>}
                        </div>
                    ))}
                </div>

                {/* Usage meter */}
                {isOpen && state.usage.loaded && !state.usage.exempt && (
                    <div className="mx-3 px-4 py-3 bg-slate-50 rounded-lg">
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
                        {state.usage.remaining <= 1 && (
                            <button
                                onClick={() => go('pricing')}
                                className="mt-2 text-[11px] text-[#7B8FA3] font-medium hover:underline"
                            >
                                {t('menu_pricing')}  →
                            </button>
                        )}
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Theme switcher */}
                <div className={`pb-3 ${isOpen ? 'px-3' : 'px-2 flex justify-center'}`}>
                    <ThemeSwitcher expanded={isOpen} />
                </div>

                {/* Secondary nav */}
                <div className={`border-t border-slate-100 space-y-0.5 ${isOpen ? 'p-3' : 'p-2'}`}>
                    <NavItem icon={CreditCard} label={t('menu_pricing')} view="pricing" small />
                    <NavItem icon={Info} label={t('menu_about')} view="about" small />
                    <NavItem icon={Users} label={t('menu_contact')} view="contact" small />
                    <NavItem icon={PenLine} label={t('menu_blog')} onClick={() => window.open(blogUrl, '_blank')} small />
                    <NavItem icon={MessageSquare} label={t('menu_forum')} view="forum" small />
                </div>

                {/* Legal */}
                <div className={`pb-3 space-y-0.5 ${isOpen ? 'px-3' : 'px-2'}`}>
                    <NavItem icon={ShieldCheck} label={t('menu_terms')} view="terms" small />
                    <NavItem icon={Lock} label={t('menu_privacy')} view="privacy" small />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
