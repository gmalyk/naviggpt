import React, { useState, useRef, useEffect } from 'react';
import { Menu, MessageSquare, Info, Users, ShieldCheck, Lock, Compass, CreditCard } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { dispatch } = useAppState();
    const { user, openAuthModal } = useAuth();
    const { t } = useTranslation();

    const handleForum = () => {
        navigateTo(dispatch, 'forum');
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
                <Menu className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <a
                        href="/forum"
                        onClick={(e) => { e.preventDefault(); handleForum(); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_forum')}</span>
                    </a>
                    <a
                        href="/compass"
                        onClick={(e) => { e.preventDefault(); navigateTo(dispatch, 'compass'); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <Compass className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_compass')}</span>
                    </a>
                    <a
                        href="/pricing"
                        onClick={(e) => { e.preventDefault(); navigateTo(dispatch, 'pricing'); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_pricing')}</span>
                    </a>
                    <a
                        href="/about"
                        onClick={(e) => { e.preventDefault(); navigateTo(dispatch, 'about'); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <Info className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_about')}</span>
                    </a>
                    <a
                        href="/contact"
                        onClick={(e) => { e.preventDefault(); navigateTo(dispatch, 'contact'); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_contact')}</span>
                    </a>
                    <a
                        href="/terms"
                        onClick={(e) => { e.preventDefault(); navigateTo(dispatch, 'terms'); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left border-t border-slate-100"
                    >
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_terms')}</span>
                    </a>
                    <a
                        href="/privacy"
                        onClick={(e) => { e.preventDefault(); navigateTo(dispatch, 'privacy'); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_privacy')}</span>
                    </a>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
