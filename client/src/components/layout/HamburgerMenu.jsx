import React, { useState, useRef, useEffect } from 'react';
import { Menu, MessageSquare, Info, Users, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { t } = useTranslation();

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
                    <a href="#forum" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_forum')}</span>
                    </a>
                    <a href="#about" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm">
                        <Info className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_about')}</span>
                    </a>
                    <a href="#contact" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_contact')}</span>
                    </a>
                    <a href="#terms" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm border-t border-slate-100">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>{t('menu_terms')}</span>
                    </a>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
