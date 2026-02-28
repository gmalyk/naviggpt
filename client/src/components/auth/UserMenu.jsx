import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppContext';
import { ACTIONS } from '../../context/appReducer';
import { useTranslation } from '../../hooks/useTranslation';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, signOut } = useAuth();
    const { dispatch } = useAppState();
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

    const avatarUrl = user?.user_metadata?.avatar_url;
    const displayName = user?.user_metadata?.full_name || user?.email || '';
    const initial = (displayName[0] || '?').toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#B88644]/30 transition-all brand-protect"
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    <div className="w-full h-full bg-[#B88644] text-white flex items-center justify-center text-sm font-bold brand-protect">
                        {initial}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
                        {user?.email && displayName !== user.email && (
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            dispatch({ type: ACTIONS.SET_VIEW, payload: 'account' });
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{t('auth_account')}</span>
                    </button>
                    <button
                        onClick={() => {
                            signOut();
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm w-full text-left"
                    >
                        <LogOut className="w-4 h-4 text-slate-400" />
                        <span>{t('auth_sign_out')}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
