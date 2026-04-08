import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState('sign_in');
    const [authModalMessage, setAuthModalMessage] = useState('');

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                supabase.auth.signOut();
                setUser(null);
            } else {
                setUser(session?.user ?? null);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === 'SIGNED_IN' && session?.user) {
                const key = `notified_signup_${session.user.id}`;
                if (!localStorage.getItem(key)) {
                    localStorage.setItem(key, '1');
                    const name = session.user.user_metadata?.full_name || '';
                    api.notifySignup(session.user.email, name).catch(() => {});
                }
            }
            if (event === 'PASSWORD_RECOVERY') {
                setAuthModalTab('update_password');
                setAuthModalOpen(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        if (supabase) await supabase.auth.signOut();
    };

    const openAuthModal = (tab = 'sign_in', message = '') => {
        setAuthModalTab(tab);
        setAuthModalMessage(message);
        setAuthModalOpen(true);
    };
    const closeAuthModal = () => {
        setAuthModalOpen(false);
        setAuthModalMessage('');
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, authModalOpen, authModalTab, setAuthModalTab, authModalMessage, openAuthModal, closeAuthModal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
